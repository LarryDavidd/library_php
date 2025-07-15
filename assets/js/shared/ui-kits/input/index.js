const createInput = (classList, type, cb) => {
  const input = document.createElement("input");
  input.classList.add("input", classList);
  input.setAttribute("type", type);
  input.addEventListener("blur", (e) => cb(e));
  return input;
};

export default createInput;
