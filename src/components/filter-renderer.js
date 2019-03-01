import DATA from "../mock/filters-data";
import tripPointsRenderer from "./trip-points-renderer";

class FilterRenderer {
  constructor() {
    this.container = document.querySelector(`.trip-filter`);
  }

  handleChange() {
    const filters = this.container.querySelectorAll(`.trip-filter input`);
    filters.forEach((filter) => {
      filter.addEventListener(`change`, (ev) => {
        tripPointsRenderer.setFilter(ev);
      });
    });
  }

  render() {
    this.container.innerHTML = ``;

    const fragment = document.createDocumentFragment();

    DATA.forEach((props) => {
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
    this.container.appendChild(fragment);

    this.handleChange();
  }
}

const filterRenderer = new FilterRenderer();
export default filterRenderer;
