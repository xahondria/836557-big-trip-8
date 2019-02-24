import DATA from "../mock/trip-points-data";

class TripPointsRenderer {

  renderOffers(offers) {
    let offerItems = ``;

    offers.forEach((offer) => {
      offerItems += `
        <li>
          <button class="trip-point__offer">${offer}</button>
        </li>
      `;
      console.log(offerItems);
    });

      return offerItems;
  }

  render() {
    let container = document.querySelector(`.trip-day__items`);
    container.innerHTML = ``;


    const fragment = document.createDocumentFragment();

    DATA.forEach((props) => {
      const newElement = document.createElement(`template`);
      newElement.innerHTML = `
        <article class="trip-point">
          <i class="trip-icon">${props.icon}</i>
          <h3 class="trip-point__title">${props.title}</h3>
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
