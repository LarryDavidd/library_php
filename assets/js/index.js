import { filterStore } from "./shared/simpleStore";
import createFilterWidget from "./widgets/filter-widget";
import createHeader from "./widgets/header";

document.addEventListener("DOMContentLoaded", () => {
  subscribeFilterStore();

  const header = createHeader();
  const filterWidget = createFilterWidget();
});

const subscribeFilterStore = () => {
  filterStore.subscribe((state) => {
    const formData = getFormatData(state);
    fetch("/library_php/api/books/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(formData),
    }).then(console.log);
  });
};

const getFormatData = (state) => {
  return {
    title: state.title,
    authors: state.authors,
    genres: state.genres,
  };
};
