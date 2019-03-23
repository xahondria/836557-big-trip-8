import flatpickr from "flatpickr";
import Component from "./component";
import tripPointEditDestinations from "./trip-point-edit-destinations";
import moment from "moment";
import tripPointEditOffers from "./trip-point-edit-offers";

class TripPointEdit extends Component {
  /**
   * @param {Object} data - input data for component
   * @param {Object} options - options of TripPointEdit
   * @param {Function} options.onSave - event handler that will be bind for onSubmit event, second argument is a reference to current TripPointEdit
   * @param {Function} options.onClose - event handler that will be bind for keydown "Escape" event, second argument is a reference to current TripPointEdit
   */
  constructor(data, options = {}) {
    super();
    this._props = {
      tripTypes: {
        'taxi': `🚕`,
        'bus': `🚌`,
        'train': `🚂`,
        'ship': `🛳️`,
        'transport': `🚊`,
        'drive': `🚗`,
        'flight': `✈`,
        'check-in': `🏨`,
        'sight-seeing': `🏛`,
        'restaurant': `🍴`,
      },
      cities: [
        `Baghdad`,
        `Bahia Blanca`,
        `Baku`,
        `Bandung`,
        `Bangalore`,
        `Bangkok`,
        `Banjul`,
        `Barcelona`,
      ],
    };
    this._state = {
      icon: data.icon,
      tripType: data.tripType,
      city: data.city,
      timetable: data.timetable,
      startTime: data.startTime,
      duration: data.duration,
      price: parseInt(data.price, 10),
      isFavorite: data.isFavorite,
      offers: data.offers,
    };

    this.timePicker = null;

    this.onSave = typeof options.onSave === `function` ? options.onSave : null;
    this.onClose = typeof options.onClose === `function` ? options.onClose : null;

    this._onTripTypeChange = this._onTripTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this._onDelete = this._onDelete.bind(this);
    this._onChangeOffers = this._onChangeOffers.bind(this);
    this._onTimeChange = this._onTimeChange.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);

  }

  get template() {
    return `
      <article class="point">
        <form class="point__form" action="" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input 
                class="point__input" 
                type="text" 
                placeholder="MAR 18"
                name="day"
              >
            </label>
      
            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle">${this._state.icon}️</label>
      
              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
      
              <div class="travel-way__select">
                <div class="travel-way__select-group">
                  <input 
                    class="travel-way__select-input visually-hidden" 
                    type="radio" 
                    id="travel-way-taxi" 
                    name="travel-way" 
                    value="taxi" 
                    ${this._state.tripType === `taxi` && `checked`}   
                  >
                  <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
      
                  <input 
                    class="travel-way__select-input visually-hidden" 
                    type="radio" 
                    id="travel-way-bus" 
                    name="travel-way" 
                    value="bus" 
                    ${this._state.tripType === `bus` && `checked`}   
                  >
                  <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
      
                  <input 
                    class="travel-way__select-input visually-hidden" 
                    type="radio" 
                    id="travel-way-train" 
                    name="travel-way" 
                    value="train" 
                    ${this._state.tripType === `train` && `checked`}   
                  >
                  <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
      
                  <input 
                    class="travel-way__select-input visually-hidden" 
                    type="radio" id="travel-way-flight" 
                    name="travel-way" 
                    value="flight" 
                    ${this._state.tripType === `flight` && `checked`}   
                  >
                  <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
                </div>
      
                <div class="travel-way__select-group">
                  <input 
                    class="travel-way__select-input visually-hidden" 
                    type="radio" id="travel-way-check-in" 
                    name="travel-way" 
                    value="check-in" 
                    ${this._state.tripType === `check-in` && `checked`}   
                  >
                  <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
      
                  <input 
                    class="travel-way__select-input visually-hidden" 
                    type="radio" id="travel-way-sightseeing" 
                    name="travel-way" 
                    value="sight-seeing" 
                    ${this._state.tripType === `sight-seeing` && `checked`}   
                  >
                  <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                </div>
              </div>
            </div>
      
            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">${this._state.tripType} to</label>
              <input 
                class="point__destination-input" 
                list="destination-select" 
                id="destination" 
                value=${this._state.city} 
                name="destination"
              >
              <datalist id="destination-select">
                ${tripPointEditDestinations(this._props.cities)}
              </datalist>
            </div>
      
            <label class="point__time">
              choose time
              <input 
                class="point__input" 
                type="text" 
                placeholder="00:00 — 00:00"
                value="${this._state.startTime > 0 ? this._state.timetable : ``}" 
                name="time" 
              >
            </label>
      
            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input 
                class="point__input" 
                type="text" 
                value="${this._state.price ? this._state.price : ``}" 
                name="price"
              >
            </label>
      
            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button point__button--delete" type="reset">Delete</button>
            </div>
      
            <div class="paint__favorite-wrap">
              <input 
                type="checkbox" 
                class="point__favorite-input visually-hidden" 
                id="favorite" 
                name="favorite"
                ${this._state.isFavorite && `checked`}
              >
              <label class="point__favorite" for="favorite">favorite</label>
            </div>
          </header>
      
          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>
      
              <div class="point__offers-wrap">
                ${tripPointEditOffers(this._state.offers)}
              </div>
      
            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>
              <div class="point__destination-images">
                <img src="http://picsum.photos/330/140?r=123" alt="picture from place" class="point__destination-image">
                <img src="http://picsum.photos/300/200?r=1234" alt="picture from place" class="point__destination-image">
                <img src="http://picsum.photos/300/100?r=12345" alt="picture from place" class="point__destination-image">
                <img src="http://picsum.photos/200/300?r=123456" alt="picture from place" class="point__destination-image">
                <img src="http://picsum.photos/100/300?r=1234567" alt="picture from place" class="point__destination-image">
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>
    `.trim();
  }

  _getFormData(form) {
    const formData = new FormData(form.querySelector(`.point`));

    const TripPointEditMapper = this.createTripPointEditMapper(this._state);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (TripPointEditMapper[property]) {
        TripPointEditMapper[property](value);
      }
    }
  }

  createTripPointEditMapper() {
  }

  destroyFlatpickr() {
    if (this.timePicker) {
      this.timePicker.destroy();
    }
  }

  _onTripTypeChange(ev) {
    ev.preventDefault();
    this._state.tripType = ev.target.value;
    this._state.icon = this._props.tripTypes[this._state.tripType];
    this.updateComponent(ev.target.closest(`.point`));
  }

  _onDestinationChange(ev) {
    ev.preventDefault();
    this._state.city = ev.target.value;
  }

  _onTimeChange(selectedDates) {
    if (selectedDates.length === 2) {
      this._state.startTime = selectedDates[0].valueOf();
      this._state.duration = selectedDates[1].valueOf() - this._state.startTime;
      this._state.timetable = `
        ${moment(this._state.startTime).format(`H mm`)} &mdash; ${moment(this._state.startTime + this._state.duration).format(`H mm`)}
      `.trim();
    }
  }

  _onPriceChange(ev) {
    ev.preventDefault();
    this._state.price = ev.target.value;
  }

  _onDelete(ev) {
    ev.preventDefault();
    this.unrender();
  }

  _onFavoriteChange(ev) {
    ev.preventDefault();
    this._state.isFavorite = ev.target.checked;
  }

  _onChangeOffers(ev) {
    ev.preventDefault();
    this._state.offers[ev.target.value].isChecked = ev.target.checked;
  }

  bind() {
    if (this.onSave) {
      this._element.querySelector(`.point__form`)
        .addEventListener(`submit`, (ev) => this.onSave(ev, this));
    }

    if (this.onClose) {
      document.addEventListener(`keydown`, this.onClose);
    }

    if (this._onDelete) {
      this._element.querySelector(`.point__button--delete`)
        .addEventListener(`click`, this._onDelete);
    }

    this._element.querySelector(`.travel-way__select`)
      .addEventListener(`change`, this._onTripTypeChange);
    this._element.querySelector(`.point__destination-input`)
      .addEventListener(`change`, this._onDestinationChange);

    this.timePicker = flatpickr(
        this._element.querySelector(`.point__time .point__input`),
        {
          enableTime: true,
          dateFormat: `H:i`,
          mode: `range`,
          locale: {
            rangeSeparator: ` — `
          },
          onClose: (selectedDates) => {
            this._onTimeChange(selectedDates);
          }
        });

    this._element.querySelector(`.point__price .point__input`)
      .addEventListener(`input`, this._onPriceChange);
    this._element.querySelector(`.point__favorite-input`)
      .addEventListener(`change`, this._onFavoriteChange);
    this._element.querySelector(`.point__offers-wrap`)
      .addEventListener(`change`, this._onChangeOffers);

  }

  unbind() {
    document.removeEventListener(`keydown`, this.onClose);
  }

}

export default TripPointEdit;
