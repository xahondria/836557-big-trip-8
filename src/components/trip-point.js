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
      id: data.id,
      icon: data.icon,
      tripType: data.tripType,
      city: data.city,
      startTime: data.startTime,
      endTime: data.endTime,
      price: data.price,
      isFavorite: data.isFavorite,
      offers: data.offers,
    };
    this.onEdit = typeof options.onEdit === `function` ? options.onEdit : null;
    this.onEdit = this.onEdit.bind(this);

  }

  get timetable() {
    const {startTime, endTime} = this._state;
    if (startTime <= 0) {
      return ``;
    }
    return `
      ${moment(startTime).format(`HH:mm`)} &mdash; ${moment(endTime).format(`HH:mm`)}
    `.trim();
  }

  get duration() {
    const duration = this._state.endTime - this._state.startTime;
    return duration >= 0 ? moment.duration(duration).format(`DD[` + `D ` + `]H[` + `H ` + `]mm[` + `M` + `]`) : ``;
  }

  get tripTypeIcon() {
    if (typeof this._state.icon !== `undefined`) {
      return this._state.icon;
    }
    return ``;
  }

  get destinationName() {
    if (typeof this._state.city !== `undefined`) {
      return this._state.city.name;
    }
    return ``;
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this.tripTypeIcon}</i>
        <h3 class="trip-point__title">${this._state.tripType} to ${this.destinationName}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this.timetable}</span>
          <span class="trip-point__duration">${this.duration}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._state.price}</p>
        <ul class="trip-point__offers">
          ${tripPointOffers(this._state.offers)}
        </ul>
      </article>
    `.trim();
  }

  get offersPrice() {
    return Object.keys(this._state.offers).reduce((acc, offer) => {
      if (this._state.offers[offer].accepted) {
        return acc + parseInt(this._state.offers[offer].price, 10);
      }
      return acc;
    }, 0);
  }

  get fullPrice() {
    return parseInt(this._state.price, 10) + this.offersPrice;
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
