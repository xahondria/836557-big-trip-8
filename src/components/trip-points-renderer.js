import DATA from "../mock/trip-points-data";
import Utils from "./utils";

class TripPointsRenderer {
  setFilter(ev) {
    ev.preventDefault();
    return ev.target.value === `everything` ?
      this.render() :
      this.render(Utils.getRandomElementsFromArray(DATA, Utils.getRandomInt(4)));
  }

  renderOffers(offers) {
    let offerItems = ``;

    offers.forEach((offer) => {
      offerItems += `
        <li>
          <button class="trip-point__offer">${offer}</button>
        </li>
      `;
    });

    return offerItems;
  }

  render(data = DATA) {
    let container = document.querySelector(`.trip-day__items`);
    container.innerHTML = ``;


    const fragment = document.createDocumentFragment();

    data.forEach((props) => {
      const newElement = document.createElement(`template`);
      newElement.innerHTML = `
        <article class="trip-point">
          <i class="trip-icon">${props.icon}</i>
          <h3 class="trip-point__title">${props.tripType} to ${props.city}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${props.timetable}</span>
            <span class="trip-point__duration">${props.duration}</span>
          </p>
          <p class="trip-point__price">${props.price}</p>
          <ul class="trip-point__offers">
            ${this.renderOffers(props.offers)}
          </ul>
        </article>
      `;

      fragment.appendChild(newElement.content);
    });

    container.appendChild(fragment);
  }
}

const tripPointsRenderer = new TripPointsRenderer();

export default tripPointsRenderer;
