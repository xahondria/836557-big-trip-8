import Component from "./component";
import utils from "../utils";
import TRIP_POINTS_DATA from "../mock/trip-points-data";
import TripPoint from "./trip-point";

// TODO при смене фильтра ломаются обработчики событий на tripPoint

class Filter extends Component {
  constructor(data) {
    super();
    this._state = {
      id: data.id,
      value: data.value,
      isChecked: data.isChecked,
      isDisabled: data.isDisabled,
      labelText: data.labelText,
    };

    this._onChange = this._onChange.bind(this);
  }

  get template() {
    return `
      <input 
        type="radio" 
        id=${this._state.id} 
        name="filter" 
        value=${this._state.value} 
        ${this._state.isChecked}
        ${this._state.isDisabled}
      >
      <label 
        class="trip-filter__item" 
        for=${this._state.id}
      >
        ${this._state.labelText}
      </label>
    `.trim();
  }

  createFragment(template) {
    return document.createRange().createContextualFragment(template);
  }

  render() {
    this._fragment = this.createFragment(this.template);
    this._fragment._currentComponent = this;
    this.bind();
    return this._fragment;
  }

  _onChange(ev) {
    ev.preventDefault();
    let filteredData = null;
    if (ev.target.value === `everything`) {
      filteredData = TRIP_POINTS_DATA;
    } else {
      filteredData = utils.getRandomElementsFromArray(TRIP_POINTS_DATA, utils.getRandomInt(4));
    }

    utils.renderComponent(
        document.querySelector(`.trip-day__items`),
        filteredData,
        TripPoint,
        `tripPoints`);

  }

  bind() {
    document.querySelector(`.trip-filter`)
      .addEventListener(`change`, this._onChange);
  }
}

export default Filter;
