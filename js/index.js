document.addEventListener("DOMContentLoaded", () => {
  const library = document.getElementById("library");
  if (library) {
    fetchInfo();

    subscribeFilterStore();

    const header = createHeader();
    const filterWidget = createFilterWidget();
    const bookList = createBookList();

    library.append(header, filterWidget, bookList);
    parseButton();
  }
});

const fetchInfo = () => {
  fetchBooks(filterStore.getState()).then((res) =>
    booksStore.setState({ books: res.data })
  );
  fetchAuthors().then((res) => authorsStore.setState({ authors: res.data }));
  fetchGenres().then((res) => genresStore.setState({ genres: res.data }));
};

const createBookList = () => {
  const booksContainer = document.createElement("div");
  booksContainer.classList.add("books-container");

  booksStore.subscribe((state) => {
    booksContainer.innerHTML = "";
    booksContainer.append(getBookList(state.books));
  });

  return booksContainer;
};

const subscribeFilterStore = () => {
  filterStore.subscribe((state) => {
    fetchBooks(state);
  });
};

const fetchAuthors = async () => {
  return fetch("/library_php/api/authors").then((res) => res.json());
};

const fetchGenres = async () => {
  return fetch("/library_php/api/genres").then((res) => res.json());
};

const fetchBooks = async (state) => {
  const formData = getFormatData(state);
  return fetch("/library_php/api/books/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(formData),
  }).then((res) => res.json());
};

const getFormatData = (state) => {
  return {
    title: state.title,
    authors: state.authors,
    genres: state.genres,
  };
};

// simpleStore

function createStore(initialState = {}) {
  let state = initialState;

  const listeners = new Set();

  const getState = () => state;

  const setState = (updater) => {
    const newState =
      typeof updater === "function" ? updater(state) : { ...state, ...updater };

    state = newState;
    notifyListeners();
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const notifyListeners = () => {
    listeners.forEach((listener) => listener(state));
  };

  return { getState, setState, subscribe };
}

const filterStore = createStore({ title: "", authors: [], genres: [] });
const booksStore = createStore({ books: [] });
const authorsStore = createStore({ authors: [] });
const genresStore = createStore({ genres: [] });

// filter

const createFilterWidget = () => {
  const filterContainer = document.createElement("div");
  filterContainer.classList.add("filter-container");

  const authorContainer = createAuthorContainer();
  const genreContainer = createGenresContainer();

  filterContainer.append(authorContainer, genreContainer);

  return filterContainer;
};

const createAuthorContainer = () => {
  const checkboxGroup = document.createElement("div");
  checkboxGroup.classList.add("checkbox-group");

  const container = document.createElement("div");
  container.classList.add("checkbox-list-container");

  authorsStore.subscribe((state) => {
    container.innerHTML = "";
    state.authors.forEach((author) => {
      const name = `${author.first_name} ${author.last_name ?? ""} ${
        author.middle_name ?? ""
      }`;
      container.append(createCheckbox("author", author.id, name));
    });
  });

  checkboxGroup.append(container);
  return checkboxGroup;
};

const createGenresContainer = () => {
  const checkboxGroup = document.createElement("div");
  checkboxGroup.classList.add("checkbox-group");

  const container = document.createElement("div");
  container.classList.add("checkbox-list-container");

  genresStore.subscribe((state) => {
    container.innerHTML = "";
    state.genres.forEach((genre) =>
      container.append(createCheckbox("genres", genre.id, genre.name))
    );
  });

  checkboxGroup.append(container);
  return checkboxGroup;
};

export default createFilterWidget;

// header

const createHeader = () => {
  const header = document.createElement("header");

  const logo = createLogo();

  header.append(logo, createSearchContainer());

  return header;
};

const createSearchContainer = () => {
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");

  const input = createInput("header__input", "text", (e) =>
    filterStore.setState({ title: e.target.input })
  );

  const button = createButton({
    name: "Search",
    cb: () => {},
    classname: "search-button",
  });

  searchContainer.append(input, button);

  return searchContainer;
};

const createLogo = () => {
  const logo = document.createElement("a");
  logo.setAttribute("href", "#");
  logo.classList.add("logo");
  logo.innerHTML = "Library";
  return logo;
};

// input

const createInput = (classList, type, cb) => {
  const input = document.createElement("input");
  input.classList.add("input", classList);
  input.setAttribute("type", type);
  input.addEventListener("blur", (e) => cb(e));
  return input;
};

// button

const createButton = ({ name, cb, classname }) => {
  const button = document.createElement("button");
  button.innerHTML = name;
  button.classList.add("button", classname);
  button.addEventListener("click", () => cb);
  return button;
};

// checkbox

const createCheckbox = (nameAttribute, itemId, itemName) => {
  const checkboxId = `${nameAttribute}_${itemId}`;

  const itemElement = document.createElement("div");
  itemElement.className = "checkbox-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `${checkboxId}`;
  checkbox.value = itemId;

  const label = document.createElement("label");
  label.htmlFor = checkboxId;
  label.textContent = itemName;

  itemElement.appendChild(checkbox);
  itemElement.appendChild(label);

  return itemElement;
};

// booking list

const getBookList = (items) => {
  const booksGrid = document.createElement("div");
  booksGrid.classList.add("books-grid");

  items.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    bookCard.innerHTML = `
      <img src="${book.image_path}" alt="${book.title}" class="book-image">
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.authors}</p>
        <div class="book-genres">
          ${book.genres
            .split(",")
            .map((genre) => `<span class="genre-tag">${genre}</span>`)
            .join("")}
        </div>
        <p class="book-description">${book.description}</p>
      </div>
    `;

    booksGrid.appendChild(bookCard);
  });

  return booksGrid;
};

const parseButton = () => {
  const button = document.getElementById("parseButton");
  button.addEventListener("click", () => {
    fetch("/library_php/api/parse").then(console.log);
  });
};
