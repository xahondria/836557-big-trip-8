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
  };
};

// TODO допилить кнопки
// TODO убрать лишний инпут даты
// TODO добавить flatpickr range


utils.defineCurrentlyRenderedObjects(
    TRIP_POINTS_DATA,
    TripPoint,
    tripPointOptions(),
    `tripPoints`);

utils.renderComponent(
    document.querySelector(`.trip-day__items`),
    `tripPoints`);
