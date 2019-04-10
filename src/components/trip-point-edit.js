import flatpickr from "flatpickr";
import Component from "./component";
import tripPointEditDestinations from "./trip-point-edit-destinations";
import moment from "moment";
import tripPointEditOffers from "./trip-point-edit-offers";
import tripPointIcons from "../constants/tripPointIcons";
import {getCache} from '../cache';
import tripPointEditPictures from "./trip-point-edit-pictures";

class TripPointEdit extends Component {
  /**
   * @param {Object} data - input data for component
   * @param {Object} options - options of TripPointEdit
   * @param {Function} options.onSave - event handler that will be bind for onSubmit event, second argument is a reference to current TripPointEdit
   * @param {Function} options.onClose - event handler that will be bind for keydown "Escape" event, second argument is a reference to current TripPointEdit
   * @param {Function} options.onDelete
   */
  constructor(data, options = {}) {
    super();
    const destinations = getCache(`destinations`);
    const cities = destinations.map((d) => d.name);
    this._props = {
      tripTypes: tripPointIcons,
      cities,
    };
    this._state = {
      id: data.id,
      icon: data.icon,
      tripType: data.tripType,
      city: data.city,
      startTime: data.startTime,
      endTime: data.endTime,
      price: parseInt(data.price, 10),
      isFavorite: data.isFavorite,
      offers: data.offers,
    };

    this.startTimePicker = null;
    this.endTimePicker = null;

    this.onSave = typeof options.onSave === `function` ? options.onSave : () => {};
    this.onClose = typeof options.onClose === `function` ? options.onClose : () => {};
    this.onDelete = typeof options.onDelete === `function` ? options.onDelete : () => {};

    this._onTripTypeChange = this._onTripTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSave = this.onSave.bind(this);
    this._onChangeOffers = this._onChangeOffers.bind(this);
    this._onStartTimeChange = this._onStartTimeChange.bind(this);
    this._onEndTimeChange = this._onEndTimeChange.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);

  }

  get template() {
    return `
      <article class="point">
        <form class="point__form" action="" method="get">
          <fieldset class="point__form-fieldset" style="border: none">
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
                      value="sightseeing" 
                      ${this._state.tripType === `sightseeing` && `checked`}   
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
                  value=${this._state.city.name} 
                  name="destination"
                >
                <datalist id="destination-select">
                  ${tripPointEditDestinations(this._props.cities)}
                </datalist>
              </div>
        
              <div class="point__time">
                choose time
                <input 
                  class="point__input date-start" 
                  type="text" 
                  name="date-start"
                  placeholder="00:00 — 00:00"
                  value="${moment(this._state.startTime).format(`HH:mm`)}" 
                >
                <input 
                  class="point__input date-end" 
                  type="text" 
                  name="date-end" 
                  placeholder="21:00"
                  value="${moment(this._state.endTime).format(`HH:mm`)}" 
                >
              </div>
        
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
                <p class="point__destination-text">
                  ${this._state.city.description}
                </p>
                <div class="point__destination-images">
                  ${tripPointEditPictures(this._state.city.pictures)};
                </div>
              </section>
              <input type="hidden" class="point__total-price" name="total-price" value="">
            </section>
          </fieldset>
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
    if (this.startTimePicker) {
      this.startTimePicker.destroy();
    }
    if (this.endTimePicker) {
      this.endTimePicker.destroy();
    }
  }

  _onTripTypeChange(ev) {
    ev.preventDefault();
    this._state.tripType = ev.target.value;
    this._state.icon = this._props.tripTypes[this._state.tripType];
    this._state.offers = getCache(`offers`).find((offerOfType) => offerOfType.type === this._state.tripType).offers;
    this.updateComponent(ev.target.closest(`.point`));
  }

  _onDestinationChange(ev) {
    ev.preventDefault();
    this._state.city = getCache(`destinations`).find((destination) => destination.name === ev.target.value);
    this.updateComponent(ev.target.closest(`.point`));
  }

  _onStartTimeChange(date) {
    this._state.startTime = date[0].valueOf();
    if (this._state.startTime > this._state.endTime) {
      this._state.endTime = this._state.startTime;
    }
    this._state.timetable = `
        ${moment(this._state.startTime).format(`HH:mm`)} &mdash; ${moment(this._state.endTime).format(`HH:mm`)}
      `.trim();
    this.updateComponent(this._element);
  }

  _onEndTimeChange(date) {
    this._state.endTime = date[0].valueOf();
    if (this._state.endTime < this._state.startTime) {
      this._state.startTime = this._state.endTime;
    }
    this._state.timetable = `
        ${moment(this._state.startTime).format(`HH:mm`)} &mdash; ${moment(this._state.endTime).format(`HH:mm`)}
      `.trim();
    this.updateComponent(this._element);
  }

  _onPriceChange(ev) {
    ev.preventDefault();
    this._state.price = ev.target.value;
  }

  _onFavoriteChange(ev) {
    ev.preventDefault();
    this._state.isFavorite = ev.target.checked;
  }

  _onChangeOffers(ev) {
    ev.preventDefault();
    this._state.offers[ev.target.value].accepted = ev.target.checked;
  }

  bind() {
    if (this.onSave) {
      this._element.querySelector(`.point__form`)
        .addEventListener(`submit`, this.onSave);
    }

    if (this.onClose) {
      document.addEventListener(`keydown`, this.onClose);
    }

    if (this.onDelete) {
      this._element.querySelector(`.point__button--delete`)
        .addEventListener(`click`, this.onDelete);
    }

    this._element.querySelector(`.travel-way__select`)
      .addEventListener(`change`, this._onTripTypeChange);
    this._element.querySelector(`.point__destination-input`)
      .addEventListener(`change`, this._onDestinationChange);

    this.startTimePicker = flatpickr(
        this._element.querySelector(`.date-start`),
        {
          enableTime: true,
          dateFormat: `H:i`,
          onClose: (selectedDates) => {
            this._onStartTimeChange(selectedDates);
          }
        });

    this.endTimePicker = flatpickr(
        this._element.querySelector(`.date-end`),
        {
          enableTime: true,
          dateFormat: `H:i`,
          onClose: (selectedDates) => {
            this._onEndTimeChange(selectedDates);
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
