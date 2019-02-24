import filtersProps from "../mock/filters-data";

function renderFilter() {
  let container = document.querySelector(`.trip-filter`);
  container.innerHTML = ``;

  const fragment = document.createDocumentFragment();

  filtersProps.forEach((props) => {
    const newElement = document.createElement(`template`);
    newElement.innerHTML = `
        <input 
          type="radio" 
          id=${props.id} 
          name="filter" 
          value=${props.value} 
          ${props.isChecked}
          ${props.isDisabled}
        >
        <label 
          class="trip-filter__item" 
          for=${props.id}
        >
          ${props.labelText}
        </label>
      `;

    fragment.appendChild(newElement.content);

  });

  container.appendChild(fragment);
}

export default renderFilter;
