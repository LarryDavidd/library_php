import { authorsStore, genresStore } from "../../shared/simpleStore";

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
    state.authors.forEach((author) =>
      container.append(createCheckbox("author", author))
    );
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
      container.append(createCheckbox("genres", genre))
    );
  });

  checkboxGroup.append(container);
  return checkboxGroup;
};

export default createFilterWidget;
