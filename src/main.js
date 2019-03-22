import Filter from "./components/filter";
import TripPoint from "./components/trip-point";
import TRIP_POINTS_DATA from "./mock/trip-points-data";
import utils from "./utils";
import FILTERS_DATA from "./mock/filters-data";
import TripPointEdit from "./components/trip-point-edit";

utils.defineCurrentlyRenderedObjects(
    FILTERS_DATA,
    Filter,
    {},
    `filters`);

utils.renderComponent(
    document.querySelector(`.trip-filter`),
    `filters`);

const tripPointOptions = () => {
  return {
    onEdit(ev) {
      ev.preventDefault();
      const element = ev.currentTarget;
      const newElementState = Object.assign({}, this._state);

      this.unbind();
      const tripPointEditElement = new TripPointEdit(
          newElementState,
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
      tripPointEdit._destroyFlatpickr();
      tripPoint._state = Object.assign({}, tripPointEdit._state);
      tripPoint.updateComponent(element);
    },
    onClose(ev) {
      if (ev.key === `Escape`) {
        ev.preventDefault();
        this._destroyFlatpickr();
        tripPoint.updateComponent(this._currentHTMLElement);
      }
    },
  };
};

utils.defineCurrentlyRenderedObjects(
    TRIP_POINTS_DATA,
    TripPoint,
    tripPointOptions(),
    `tripPoints`);

utils.renderComponent(
    document.querySelector(`.trip-day__items`),
    `tripPoints`);
