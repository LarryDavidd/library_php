const createCheckbox = (nameAttribute, item) => {
  const checkboxId = `${nameAttribute}_${item.id}`;

  const itemElement = document.createElement("div");
  itemElement.className = "checkbox-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = `${nameAttribute}[]`;
  checkbox.value = item.id;

  const label = document.createElement("label");
  label.htmlFor = checkboxId;
  label.textContent = item.name;

  itemElement.appendChild(checkbox);
  itemElement.appendChild(label);
  listFragment.appendChild(itemElement);
};
