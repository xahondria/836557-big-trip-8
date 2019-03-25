import Filter from "./components/filter";
import TripPoint from "./components/trip-point";
import TripDay from "./components/trip-day";
import TRIP_POINTS_DATA from "./mock/trip-points-data";
import utils from "./utils";
import FILTERS_DATA from "./mock/filters-data";
import TripPointEdit from "./components/trip-point-edit";
import currentlyRenderedObjects from "./currently-rendered-objects";
import moment from "moment";


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
    onSave(ev, tripPointEdit) {
      const element = ev.currentTarget.closest(`.point`);
      ev.preventDefault();
      tripPointEdit.destroyFlatpickr();
      tripPoint.setState(tripPointEdit.getState());
      tripPoint.updateComponent(element);
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
    },

  };
};

utils.defineCurrentlyRenderedObjects(
    TRIP_POINTS_DATA,
    TripPoint,
    tripPointOptions(),
    `tripPoints`);

currentlyRenderedObjects.tripPoints.forEach((tripPoint) => {

  /*
  tripDays
  */

  const tripPointDate = moment(tripPoint._state.startTime).format(`YYYY, MM, DD`);

  if (currentlyRenderedObjects.uniqueDays.has(tripPointDate)) {
    return;
  }
  currentlyRenderedObjects.uniqueDays.add(tripPointDate);

  const tripDayOptions = () => {
    return {
      onSortByTime() {
        this.eventsToday = currentlyRenderedObjects.tripPoints.filter((el) => moment(el._state.startTime).format(`YYYY, MM, DD`) === this.date);

        utils.renderComponent(
            this._element.querySelector(`.trip-day__items`),
            this.eventsToday);
      },
    };
  };

  utils.defineCurrentlyRenderedObjects(
      [...currentlyRenderedObjects.uniqueDays],
      TripDay,
      tripDayOptions(),
      `tripDays`);

  utils.renderComponent(
      document.querySelector(`.trip-points`),
      currentlyRenderedObjects.tripDays);

  /*
    tripDays END
    */

});

/*
tripPoints END
*/


// TODO сделать new event
// TODO сделать сбор данных по _getFormData
// TODO сделать статистику
// TODO сделать сортировки
// TODO менять total в правом верхнем углу
// TODO менять описание поездки и даты в хедере

// TODO менять дату в левой колонке

