import Filter from "./components/filter";
import TripPoint from "./components/trip-point";
import TripDay from "./components/trip-day";
import utils from "./utils";
import FILTERS_DATA from "./mock/filters-data";
import TripPointEdit from "./components/trip-point-edit";
import currentlyRenderedObjects from "./currently-rendered-objects";
import moment from "moment";
import setChart from "./components/stats";
import API from "./api";
import {storeCache} from "./cache";
import tripPointsIcons from "./constants/tripPointIcons";

window._options = {
  sort: `event_asc`,
  filter: `everything`,
};

/*
FILTERS
*/
function getFilteredTripPoints(array, filter) {
  switch (filter) {
    case `everything`:
      return array;
    case `future`:
      return array.filter((tripPoint) => tripPoint.getState().startTime > Date.now());
    case `past`:
      return array.filter((tripPoint) => tripPoint.getState().startTime < Date.now());
    default:
      return array;
  }
}

const filterOptions = () => {
  return {
    onChange(ev) {
      ev.preventDefault();
      window._options.filter = ev.target.value;
      if (document.querySelector(`.view-switch-table`).classList.contains(`view-switch__item--active`)) {
        rerenderList();
      } else {
        rerenderCharts();
      }
    },
  };
};

utils.defineCurrentlyRenderedObjects(
    FILTERS_DATA,
    Filter,
    filterOptions(),
    `filters`);

utils.renderComponent(
    document.querySelector(`.trip-filter`),
    currentlyRenderedObjects.filters);

/*
FILTERS END
*/


/*
tripPoints
*/

const tripPointOptions = () => {
  return {
    onEdit(ev) {
      ev.preventDefault();
      const element = ev.currentTarget;

      this.unbind();
      const tripPointEditElement = new TripPointEdit(
          this.getState(),
          tripPointEditOptions(this))
        .render();
      element.replaceWith(tripPointEditElement);
    },
  };
};

const tripPointEditOptions = (tripPoint) => {
  return {
    onSave(ev) {
      const element = ev.currentTarget.closest(`.point`);
      ev.preventDefault();
      this.destroyFlatpickr();
      const currentState = this.getState();

      element.removeAttribute(`style`);
      element.classList.remove(`shake`);
      element.querySelector(`.point__button--save`).innerText = `Saving...`;
      element.querySelector(`.point__form-fieldset`).setAttribute(`disabled`, ``);

      API.updateTripPoint(currentState)
        .then((newTripPoint) => {
          const newState = {
            id: newTripPoint.id,
            icon: tripPointsIcons[newTripPoint.type],
            tripType: newTripPoint.type,
            city: newTripPoint.destination,
            startTime: newTripPoint.date_from,
            endTime: newTripPoint.date_to,
            price: newTripPoint.base_price,
            isFavorite: newTripPoint.is_favorite,
            offers: newTripPoint.offers,
          };
          tripPoint.setState(newState);
          tripPoint.updateComponent(element);
          rerenderList();
        })
        .catch(() => {
          element.querySelector(`.point__form-fieldset`).removeAttribute(`disabled`);
          element.querySelector(`.point__button--save`).innerText = `Save`;
          element.setAttribute(`style`, `border: red 1px solid`);
          element.classList.add(`shake`);
        });

    },
    onClose(ev) {
      if (ev.key === `Escape`) {
        ev.preventDefault();
        this.destroyFlatpickr();
        tripPoint.updateComponent(this.getElement());
      }
    },
    onDelete(ev) {
      const element = ev.currentTarget.closest(`.point`);
      ev.preventDefault();

      element.removeAttribute(`style`);
      element.classList.remove(`shake`);
      element.querySelector(`.point__button--delete`).innerText = `Deleting...`;
      element.querySelector(`.point__form-fieldset`).setAttribute(`disabled`, ``);

      API.deleteTripPoint(this._state.id)
      .then(() => {
        this.unrender();
        currentlyRenderedObjects.tripPoints = currentlyRenderedObjects.tripPoints.filter((tp) => tp !== tripPoint);
        rerenderList();
      })
      .catch(() => {
        element.querySelector(`.point__form-fieldset`).removeAttribute(`disabled`);
        element.querySelector(`.point__button--delete`).innerText = `Delete`;
        element.setAttribute(`style`, `border: red 1px solid`);
        element.classList.add(`shake`);
      });
    },

  };
};

const newTripPointEditOptions = () => {
  return {
    onSave(ev) {
      ev.preventDefault();
      const currentState = this.getState();

      const element = this.updateComponent(ev.currentTarget.closest(`.point`));
      element.querySelector(`.point__button--save`).innerText = `Saving...`;
      element.querySelector(`.point__form-fieldset`).setAttribute(`disabled`, ``);

      // validation
      let formIsValid = true;
      if (this.getState().tripType === ``) {
        formIsValid = false;
        element.querySelector(`.travel-way__label`).setAttribute(`style`, `background-color: rgba(255,0,0,0.3)`);
      }

      if (this.getState().city.name === ``) {
        formIsValid = false;
        element.querySelector(`.point__destination-input`).setAttribute(`style`, `background-color: rgba(255,0,0,0.3)`);
      }
      console.log(this.getState().price);
      console.log((Number.isInteger(parseInt(this.getState().price, 10))));
      if (!(Number.isInteger(parseInt(this.getState().price, 10)))) {
        formIsValid = false;
        element.querySelector(`.point__input--price`).setAttribute(`style`, `background-color: rgba(255,0,0,0.3)`);
      }

      if (!formIsValid) {
        console.log(formIsValid);
        element.setAttribute(`style`, `border: red 1px solid`);
        element.classList.add(`shake`);
        element.querySelector(`.point__button--save`).innerText = `Save`;
        element.querySelector(`.point__form-fieldset`).removeAttribute(`disabled`);
        return;
      }

      API.createTripPoint(currentState)
        .then((newTripPoint) => {
          const newState = {
            id: newTripPoint.id,
            icon: tripPointsIcons[newTripPoint.type],
            tripType: newTripPoint.type,
            city: newTripPoint.destination,
            startTime: newTripPoint.date_from,
            endTime: newTripPoint.date_to,
            price: newTripPoint.base_price,
            isFavorite: newTripPoint.is_favorite,
            offers: newTripPoint.offers,
          };
          currentlyRenderedObjects.tripPoints.push(new TripPoint(newState, tripPointOptions()));
          rerenderList();
        })
        .catch(() => {
          element.querySelector(`.point__form-fieldset`).removeAttribute(`disabled`);
          element.querySelector(`.point__button--save`).innerText = `Save`;
          element.setAttribute(`style`, `border: red 1px solid`);
          element.classList.add(`shake`);
        });
      this.destroyFlatpickr();

    },
    onClose(ev) {
      if (ev.key === `Escape`) {
        ev.preventDefault();
        this.destroyFlatpickr();
        this.unrender();
      }
    },
    onDelete(ev) {
      ev.preventDefault();
      this.destroyFlatpickr();
      this.unrender();
    },

  };
};

function addNewTripPoint() {

  const mockData = {
    get id() {
      return utils.getRandomInt(99999);
    },
    icon: ``,
    tripType: ``,
    city: {
      description: ``,
      name: ``,
      pictures: [],
    },
    startTime: Date.now(),
    endTime: Date.now(),
    price: ``,
    isFavorite: false,
    offers: ``,
  };

  const TPE = new TripPointEdit(mockData, newTripPointEditOptions());
  TPE.render();
  TPE.renderToTop(document.querySelector(`.trip-points`));
}

document.querySelector(`.trip-controls__new-event`).addEventListener(`click`, addNewTripPoint);

function updateSortTripPoints(array, sortType = `time_asc`) {
  switch (sortType) {
    case `event_asc`:
      array.sort((left, right) => {
        if (left.getState().tripType > right.getState().tripType) {
          return 1;
        }
        if (left.getState().tripType < right.getState().tripType) {
          return -1;
        }
        return 0;
      });
      break;
    case `event_desc`:
      array.sort((left, right) => {
        if (left.getState().tripType > right.getState().tripType) {
          return -1;
        }
        if (left.getState().tripType < right.getState().tripType) {
          return 1;
        }
        return 0;
      });
      break;
    case `time_asc`:
      array.sort((left, right) => left.getState().startTime - right.getState().startTime);
      break;
    case `time_desc`:
      array.sort((left, right) => right.getState().startTime - left.getState().startTime);
      break;
    case `price_asc`:
      array.sort((left, right) => left.fullPrice - right.fullPrice);
      break;
    case `price_desc`:
      array.sort((left, right) => right.fullPrice - left.fullPrice);
      break;
  }
}

function updateTotalPrice() {
  const totalPrice = currentlyRenderedObjects.tripPoints.reduce((total, current) => {
    return total + current.fullPrice;
  }, 0);

  document.querySelector(`.trip__total-cost`).innerText = `€ ${totalPrice}`;
}

const rerenderList = () => {
  console.log(currentlyRenderedObjects);
  // Фильтрация
  currentlyRenderedObjects.filteredTripPoints = getFilteredTripPoints(currentlyRenderedObjects.tripPoints, window._options.filter);

  // Сортировка
  updateSortTripPoints(currentlyRenderedObjects.filteredTripPoints, window._options.sort);
  updateTotalPrice();

  // Группировка
  const groups = currentlyRenderedObjects.filteredTripPoints.reduce((memo, current) => {
    const tripPointDate = moment(current.getState().startTime).startOf(`day`).toDate();
    if (!memo.length) {
      memo.push({
        key: tripPointDate,
        values: [],
      });
    }
    const prevGroup = memo[memo.length - 1];

    if (prevGroup.key.getTime() === tripPointDate.getTime()) {
      prevGroup.values.push(current);
    } else {
      memo.push({
        key: tripPointDate,
        values: [current],
      });
    }
    return memo;
  }, []);
  // Конец группировки

  // Очистка предыдущих event
  if (currentlyRenderedObjects.tripDays) {
    currentlyRenderedObjects.tripDays.forEach((td) => td.unbind());
  }

  // Рендеринг компонентов
  currentlyRenderedObjects.tripDays = groups.map((group) => {
    return new TripDay({
      date: group.key,
      tripPoints: group.values,
    }, {});
  });
  utils.renderComponent(
      document.querySelector(`.trip-points`),
      currentlyRenderedObjects.tripDays);
};

function rerenderCharts() {
  window._moneyChart.destroy();
  window._transportChart.destroy();
  setChart(statsElement, getFilteredTripPoints(currentlyRenderedObjects.tripPoints, window._options.filter));
}

document.querySelector(`.trip-points`).innerText = `Loading route...`;

Promise.all([
  API.getTripPoints(),
  API.getTripPointDestinations(),
  API.getTripPointOffers(),
]).then(([tripPoints, destinations, offers]) => {
  storeCache(`destinations`, destinations);
  storeCache(`offers`, offers);
  utils.defineCurrentlyRenderedObjects(
      tripPoints,
      TripPoint,
      tripPointOptions(),
      `tripPoints`
  );

  rerenderList();
})
// .catch(() => {
//   document.querySelector(`.trip-points`).innerText = `Something went wrong while loading your route info. Check your connection or try again later`;
// })
;

// сортировки
document.querySelector(`#sorting-time`).addEventListener(`click`, function () {
  const asc = window._options.sort === `time_asc`;
  window._options.sort = asc ? `time_desc` : `time_asc`;
  rerenderList();
});
document.querySelector(`#sorting-event`).addEventListener(`click`, function () {
  const asc = window._options.sort === `event_asc`;
  window._options.sort = asc ? `event_desc` : `event_asc`;
  rerenderList();
});
document.querySelector(`#sorting-price`).addEventListener(`click`, function () {
  const asc = window._options.sort === `price_asc`;
  window._options.sort = asc ? `price_desc` : `price_asc`;
  rerenderList();
});

// Статистика
const tableButton = document.querySelector(`.view-switch-table`);
const statsButton = document.querySelector(`.view-switch-stats`);
const tableElement = document.querySelector(`#table`);
const statsElement = document.querySelector(`#stats`);

tableButton.addEventListener((`click`), function () {
  if (tableButton.classList.contains(`view-switch__item--active`)) {
    return;
  }
  tableButton.classList.add(`view-switch__item--active`);
  statsButton.classList.remove(`view-switch__item--active`);
  statsElement.classList.add(`visually-hidden`);
  tableElement.classList.remove(`visually-hidden`);
  window._moneyChart.destroy();
  window._transportChart.destroy();
  window._timeSpendChart.destroy();
});

statsButton.addEventListener((`click`), function () {
  if (statsButton.classList.contains(`view-switch__item--active`)) {
    return;
  }
  statsButton.classList.add(`view-switch__item--active`);
  tableButton.classList.remove(`view-switch__item--active`);
  tableElement.classList.add(`visually-hidden`);
  statsElement.classList.remove(`visually-hidden`);

  setChart(statsElement, getFilteredTripPoints(currentlyRenderedObjects.tripPoints, window._options.filter));
});

// TODO сделать new event
// TODO сделать сбор данных по _getFormData
// TODO сделать статистику
// TODO менять total в правом верхнем углу
// TODO менять описание поездки и даты в хедере
