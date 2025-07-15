import { filterStore } from "../../shared/simpleStore";
import createButton from "../../shared/ui-kits/button";
import createInput from "../../shared/ui-kits/input";

const createHeader = () => {
  const header = document.createElement("header");

  const logo = createLogo();

  header.append(logo, createSearchContainer());
};

const createSearchContainer = () => {
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");

  const input = createInput("header__input", "text", (e) =>
    filterStore.setState({ title: e.target.input })
  );

  const button = createButton("Search", () => {}, "search-button");

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

export default createHeader;
