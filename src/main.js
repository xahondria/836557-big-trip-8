import Filter from "./components/filter";
import TripPoint from "./components/trip-point";
import TripDay from "./components/trip-day";
import TRIP_POINTS_DATA from "./mock/trip-points-data";
import utils from "./utils";
import FILTERS_DATA from "./mock/filters-data";
import TripPointEdit from "./components/trip-point-edit";
import currentlyRenderedObjects from "./currently-rendered-objects";
import moment from "moment";

window._options = {
  sort: `asc`,
};

/*
FILTERS
*/

const filterOptions = () => {
  return {
    onChange(ev) {
      ev.preventDefault();
      const container = document.querySelector(`.trip-day__items`);
      let filteredData = currentlyRenderedObjects.tripPoints;
      if (ev.target.value !== `everything`) {
        filteredData = utils.getRandomElementsFromArray(currentlyRenderedObjects.tripPoints, utils.getRandomInt(4));
      }

      container.innerHTML = ``;
      utils.renderElements(container, filteredData.map((el) => el.render()));
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

function updateSortTripPoints(array, asc = true) {

  array.sort((left, right) => asc
    ? left._state.startTime - right._state.startTime
    : right._state.startTime - left._state.startTime);
}

const rerenderList = () => {
  updateSortTripPoints(currentlyRenderedObjects.tripPoints, window._options.sort === `asc`);

  // Группировка
  const groups = currentlyRenderedObjects.tripPoints.reduce((memo, current) => {
    const tripPointDate = moment(current._state.startTime).startOf(`day`).toDate();
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

utils.defineCurrentlyRenderedObjects(
    TRIP_POINTS_DATA,
    TripPoint,
    tripPointOptions(),
    `tripPoints`);

rerenderList();


// TODO сделать new event
// TODO сделать сбор данных по _getFormData
// TODO сделать статистику
// TODO сделать сортировки
document.querySelector(`#sorting-time`).addEventListener(`click`, function () {
  const asc = window._options.sort === `asc`;
  window._options.sort = asc ? `desc` : `asc`;
  rerenderList();
});
// TODO менять total в правом верхнем углу
// TODO менять описание поездки и даты в хедере
