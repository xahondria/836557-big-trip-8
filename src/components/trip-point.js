import Component from "./component";
import tripPointOffers from "./trip-point-offers";
import TripPointEdit from "./trip-point-edit";

class TripPoint extends Component {
  constructor(data) {
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

    this._onClick = this._onClick.bind(this);

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

  _onClick(ev) {
    ev.preventDefault();
    const element = ev.currentTarget;
    element.replaceWith(new TripPointEdit(this._state).render());
  }

  bind() {
    this._fragment.querySelector(`.trip-point`)
      .addEventListener(`click`, this._onClick);
  }
}

export default TripPoint;
