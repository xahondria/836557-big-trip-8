import utils from "../components/utils";

const DATA = {
  tripTypes: {
    'Taxi': `🚕`,
    'Bus': `🚌`,
    'Train': `🚂`,
    'Ship': `🛳️`,
    'Transport': `🚊`,
    'Drive': `🚗`,
    'Flight': `✈`,
    'Check-in': `🏨`,
    'Sightseeing': `🏛`,
    'Restaurant': `🍴`,
  },
  cities: new Set([
    `Baghdad`,
    `Bahia Blanca`,
    `Baku`,
    `Bandung`,
    `Bangalore`,
    `Bangkok`,
    `Banjul`,
    `Barcelona`,
  ]),
  offers: new Set([
    `Add luggage`,
    `Switch to comfort class`,
    `Add meal`,
    `Choose seats`,
  ]),
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
};

class TripPoint {
  constructor() {
    this.tripType = utils.getRandomKeyFromObject(DATA.tripTypes);
    this.icon = DATA.tripTypes[this.tripType];
    this.city = [...DATA.cities][[...DATA.cities].length * Math.random() << 0];
    this.timetable = `22:00&nbsp;&mdash; 07:00`;
    this.duration = `2h 40m`;
    this.price = `&euro;&nbsp;20`;
    this.offers = utils.getRandomElementsFromArray([...DATA.offers], 2);
  }
}

const TRIP_POINTS_DATA = [
  new TripPoint(),
  new TripPoint(),
  new TripPoint(),
  new TripPoint(),
];

export default TRIP_POINTS_DATA;
