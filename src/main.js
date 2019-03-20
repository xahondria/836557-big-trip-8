import Filter from "./components/filter";
import TripPoint from "./components/trip-point";
import TRIP_POINTS_DATA from "./mock/trip-points-data";
import utils from "./utils";
import FILTERS_DATA from "./mock/filters-data";
import TripPointEdit from "./components/trip-point-edit";

utils.renderComponent(
    document.querySelector(`.trip-filter`),
    FILTERS_DATA,
    Filter,
    {},
    `filters`);

const tripPointOptions = () => {
  return {
    onEdit(ev, tripPoint) {
      ev.preventDefault();
      const element = ev.currentTarget;
      const newElement = Object.assign({}, tripPoint._state);

      element.replaceWith(new TripPointEdit(
          newElement,
          tripPointEditOptions(tripPoint))
        .render());
    },
  };
};

const tripPointEditOptions = (tripPoint) => {
  return {
    onSave(ev, tripPointEdit) {
      const element = ev.currentTarget.closest(`.point`);
      ev.preventDefault();
      tripPoint._state = Object.assign({}, tripPointEdit._state);
      tripPoint.updateComponent(element);
    },
    // onClose(_ev, _tripPointEdit) {
    //   ev.preventDefault();
    //
    //   tripPoint.updateComponent(element);
    // },
  };
};


utils.renderComponent(
    document.querySelector(`.trip-day__items`),
    TRIP_POINTS_DATA,
    TripPoint,
    tripPointOptions(),
    `tripPoints`);
