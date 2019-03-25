import Component from "./component";
import moment from "moment";

class TripDay extends Component {
  constructor(data, options = {}) {
    super();
    this.date = data;

    this.onSortByTime = typeof options.onSortByTime === `function` ? options.onSortByTime : null;
    this.onSortByTime = this.onSortByTime.bind(this);

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

  bind() {
    this.onSortByTime();
    if (this.onSortByTime) {
      document.querySelector(`.trip-sorting__item--time`).addEventListener(`click`, this.onSortByTime);
    }
  }

  unbind() {
    document.removeEventListener(`.trip-sorting__item--time`).addEventListener(`click`, this.onSortByTime);
  }


}

export default TripDay;
