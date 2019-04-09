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
import {getCache} from "./cache";

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
      tripPoint.setState(this.getState());
      tripPoint.updateComponent(element);
      rerenderList();
    },
    onClose(ev) {
      if (ev.key === `Escape`) {
        ev.preventDefault();
        this.destroyFlatpickr();
        tripPoint.updateComponent(this.getElement());
      }
    },
    onDelete(ev) {
      ev.preventDefault();
      this.unrender();
      currentlyRenderedObjects.tripPoints = currentlyRenderedObjects.tripPoints.filter((tp) => tp !== tripPoint);
      rerenderList();
    },

  };
};

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

window.Promise.all([
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
});

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
