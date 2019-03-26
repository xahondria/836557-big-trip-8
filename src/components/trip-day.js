import Component from "./component";
import utils from '../utils';
import moment from "moment";

class TripDay extends Component {
  constructor(data, _options = {}) {
    super();
    this.date = data.date;
    this.tripPoints = data.tripPoints;
  }

  get template() {
    return `
      <section class="trip-day">
        <article class="trip-day__info">
          <span class="trip-day__caption">Day</span>
          <p class="trip-day__number">${ moment(this.date).format(`D`) }</p>
          <h2 class="trip-day__title">${ moment(this.date).format(`MMM YY`) }</h2>
        </article>
        <div class="trip-day__items">
        </div>
      </section>
    `.trim();
  }

  render() {
    super.render();

    utils.renderComponent(
        this._element.querySelector(`.trip-day__items`),
        this.tripPoints);

    return this._element;
  }


}

export default TripDay;
