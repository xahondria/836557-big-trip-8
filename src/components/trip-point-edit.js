import flatpickr from "flatpickr";
import Component from "./component";
import tripPointEditDestinations from "./trip-point-edit-destinations";

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
      duration: data.duration,
      price: data.price,
      offers: data.offers,
    };

    this.calendar = null;
    this.timePicker = null;

    this._onTripTypeChange = this._onTripTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);

    this.onSave = typeof options.onSave === `function` ? options.onSave : null;
    this.onClose = typeof options.onClose === `function` ? options.onClose : null;
  }

  get template() {
    return `
      <article class="point">
        <form class="point__form" action="" method="get">
          <header class="point__header">
            <label class="point__date" style="display: block">
              choose day
              <input class="point__input" type="text" placeholder="MAR 18" name="day">
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
              <input class="point__input" type="text" value="00:00 — 00:00" name="time" placeholder="00:00 — 00:00">
            </label>
      
            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="160" name="price">
            </label>
      
            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button" type="reset">Delete</button>
            </div>
      
            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
              <label class="point__favorite" for="favorite">favorite</label>
            </div>
          </header>
      
          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>
      
              <div class="point__offers-wrap">
                <input class="point__offers-input visually-hidden" type="checkbox" id="add-luggage" name="offer" value="add-luggage">
                <label for="add-luggage" class="point__offers-label">
                  <span class="point__offer-service">Add luggage</span> + €<span class="point__offer-price">30</span>
                </label>
      
                <input class="point__offers-input visually-hidden" type="checkbox" id="switch-to-comfort-class" name="offer" value="switch-to-comfort-class">
                <label for="switch-to-comfort-class" class="point__offers-label">
                  <span class="point__offer-service">Switch to comfort class</span> + €<span class="point__offer-price">100</span>
                </label>
      
                <input class="point__offers-input visually-hidden" type="checkbox" id="add-meal" name="offer" value="add-meal">
                <label for="add-meal" class="point__offers-label">
                  <span class="point__offer-service">Add meal </span> + €<span class="point__offer-price">15</span>
                </label>
      
                <input class="point__offers-input visually-hidden" type="checkbox" id="choose-seats" name="offer" value="choose-seats">
                <label for="choose-seats" class="point__offers-label">
                  <span class="point__offer-service">Choose seats</span> + €<span class="point__offer-price">5</span>
                </label>
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

  _destroyFlatpickr() {
    if (this.calendar) {
      this.calendar.destroy();
    }
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

  bind() {
    if (this.onSave) {
      this._fragment.querySelector(`.point__form`)
        .addEventListener(`submit`, (ev) => this.onSave(ev, this));
    }

    this._fragment.querySelector(`.travel-way__select`)
      .addEventListener(`change`, this._onTripTypeChange);
    this._fragment.querySelector(`.point__destination-input`)
      .addEventListener(`change`, this._onDestinationChange);

    this.calendar = flatpickr(
        this._fragment.querySelector(`.point__date .point__input`),
        {
          dateFormat: `M j`,
        });

    this.timePicker = flatpickr(
        this._fragment.querySelector(`.point__time .point__input`),
        {
          enableTime: true,
          noCalendar: true,
          dateFormat: `H:i`,
        });
  }
}

export default TripPointEdit;
