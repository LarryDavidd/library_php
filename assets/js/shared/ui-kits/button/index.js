const createButton = ({ name, cb, classname }) => {
  const button = document.createElement("button");
  button.innerHTML = name;
  button.classList.add("button", classname);
  button.addEventListener("click", () => cb);
};

export default createButton;
