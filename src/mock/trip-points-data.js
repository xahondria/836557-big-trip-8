import Utils from "../components/utils";

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
  cities: [
    `Baghdad`,
    `Bahia Blanca`,
    `Baku`,
    `Bandung`,
    `Bangalore`,
    `Bangkok`,
    `Banjul`,
    `Barcelona`,
  ],
  offers: new Set([
    `Add luggage`,
    `Switch to comfort class`,
    `Add meal`,
    `Choose seats`,
  ]),
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
};

function generateTripPoint() {
  const TripPoint = {
    tripType: Utils.getRandomKeyFromObject(DATA.tripTypes),
    city: DATA.cities[DATA.cities.length * Math.random() << 0],
    timetable: `22:00&nbsp;&mdash; 07:00`,
    duration: `2h 40m`,
    price: `&euro;&nbsp;20`,
    offers: Utils.getRandomElementsFromArray([...DATA.offers], Utils.getRandomInt(2)),
  };

  TripPoint.icon = DATA.tripTypes[TripPoint.tripType];

  return TripPoint;
}


const TRIP_POINTS_DATA = [
  generateTripPoint(),
  generateTripPoint(),
  generateTripPoint(),
  generateTripPoint(),
];

export default TRIP_POINTS_DATA;
