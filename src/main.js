import Filter from "./components/filter";
import TripPoint from "./components/trip-point";
import TRIP_POINTS_DATA from "./mock/trip-points-data";
import utils from "./utils";
import FILTERS_DATA from "./mock/filters-data";

utils.renderComponent(
    document.querySelector(`.trip-filter`),
    FILTERS_DATA,
    Filter,
    `filters`);

utils.renderComponent(
    document.querySelector(`.trip-day__items`),
    TRIP_POINTS_DATA,
    TripPoint,
    `tripPoints`);
