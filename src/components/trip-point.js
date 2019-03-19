import Component from "./component";
import tripPointOffers from "./trip-point-offers";

class TripPoint extends Component {
  /**
   * @param {Object} data - input data for component
   * @param {Object} options - options of TripPoint
   * @param {Function} options.onClick - event handler that will be bind for click, second argument is a reference to current TripPoint
   */
  constructor(data, options = {}) {
    super();
    this._state = {
      icon: data.icon,
      tripType: data.tripType,
      city: data.city,
      timetable: data.timetable,
      duration: data.duration,
      price: data.price,
      offers: data.offers,
    };
    this.onEdit = typeof options.onEdit === `function` ? options.onEdit : null;
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._state.icon}</i>
        <h3 class="trip-point__title">${this._state.tripType} to ${this._state.city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._state.timetable}</span>
          <span class="trip-point__duration">${this._state.duration}</span>
        </p>
        <p class="trip-point__price">${this._state.price}</p>
        <ul class="trip-point__offers">
          ${tripPointOffers(this._state.offers)}
        </ul>
      </article>
    `.trim();
  }

  bind() {
    if (this.onEdit) {
      this._fragment.querySelector(`.trip-point`)
        .addEventListener(`click`, (ev) => this.onEdit(ev, this));
    }
  }
}

export default TripPoint;
