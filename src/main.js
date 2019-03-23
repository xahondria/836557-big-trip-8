import Filter from "./components/filter";
import TripPoint from "./components/trip-point";
import TRIP_POINTS_DATA from "./mock/trip-points-data";
import utils from "./utils";
import FILTERS_DATA from "./mock/filters-data";
import TripPointEdit from "./components/trip-point-edit";
import currentlyRenderedObjects from "./currently-rendered-objects";

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
    }
  };
};

utils.defineCurrentlyRenderedObjects(
    FILTERS_DATA,
    Filter,
    filterOptions(),
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

utils.defineCurrentlyRenderedObjects(
    TRIP_POINTS_DATA,
    TripPoint,
    tripPointOptions(),
    `tripPoints`);

utils.renderComponent(
    document.querySelector(`.trip-day__items`),
    `tripPoints`);

// TODO сделать new event
// TODO сделать сбор данных по _getFormData
// TODO сделать статистику
// TODO сделать сортировки
// TODO менять дату в левой колонке
// TODO менять total в правом верхнем углу
// TODO менять описание поездки и даты в хедере

// TODO изначально время у тебя не отображается никакое. и дата у всех предложений одна - первое марта

