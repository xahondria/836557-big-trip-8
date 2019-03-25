import Component from "./component";
import tripPointOffers from "./trip-point-offers";
import moment from "moment";
import "moment-duration-format";

class TripPoint extends Component {
  /**
   * @param {Object} data - input data for component
   * @param {Object} options - options of TripPoint
   * @param {Function} options.onEdit - event handler that will be bind for event, second argument is a reference to current TripPoint
   * @param {Function} options.renderDays - renders day container for tripPoints
   */
  constructor(data, options = {}) {
    super();
    this._state = {
      icon: data.icon,
      tripType: data.tripType,
      city: data.city,
      timetable: data.timetable,
      startTime: data.startTime,
      duration: data.duration,
      price: data.price,
      isFavorite: data.isFavorite,
      offers: data.offers,
    };

    this.onEdit = typeof options.onEdit === `function` ? options.onEdit : null;
    this.onEdit = this.onEdit.bind(this);

  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._state.icon}</i>
        <h3 class="trip-point__title">${this._state.tripType} to ${this._state.city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._state.startTime > 0 ? this._state.timetable : ``}</span>
          <span class="trip-point__duration">${this._state.duration >= 0 ? moment.duration(this._state.duration).format(`H[` + `H ` + `]mm[` + `M` + `]`) : ``}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._state.price}</p>
        <ul class="trip-point__offers">
          ${tripPointOffers(this._state.offers)}
        </ul>
      </article>
    `.trim();
  }

  bind() {
    if (this.onEdit) {
      this._element.addEventListener(`click`, this.onEdit);
    }
  }

  unbind() {
  }
}

export default TripPoint;
