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

utils.renderComponent(
    document.querySelector(`.trip-day__items`),
    TRIP_POINTS_DATA,
    TripPoint,
    {
      onEdit(ev, tripPoint) {
        ev.preventDefault();
        const element = ev.currentTarget;
        element.replaceWith(new TripPointEdit(Object.assign({}, tripPoint._state), {
          onSave(newState, _tripPointEdit) {
            tripPoint._state = Object.assign({}, newState);
            tripPoint.updateComponent(element);
          },
          onClose(_ev, _tripPointEdit) {
            tripPoint.updateComponent(element);
          }
        }).render());
      },
    },
    `tripPoints`);
