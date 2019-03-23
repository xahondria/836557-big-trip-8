import utils from "../utils";

const DATA = {
  tripTypes: {
    'taxi': `🚕`,
    'bus': `🚌`,
    'train': `🚂`,
    'ship': `🛳️`,
    'transport': `🚊`,
    'drive': `🚗`,
    'flight': `✈`,
    'check-in': `🏨`,
    'sight-seeing': `🏛`,
    'restaurant': `🍴`,
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
  offers: {
    'add-luggage': {
      isChecked: true,
      price: 30,
    },
    'switch-to-comfort-class': {
      isChecked: true,
      price: 100,
    },
    'add-meal': {
      isChecked: false,
      price: 15,
    },
    'choose-seats': {
      isChecked: false,
      price: 5,
    },
  },
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
};

function generateTripPoint() {
  return {
    tripType: utils.getRandomKeyFromObject(DATA.tripTypes),
    city: DATA.cities[DATA.cities.length * Math.random() << 0],
    timetable: `22:00&nbsp;&mdash; 07:00`,
    duration: `2h 40m`,
    price: `20`,
    offers: DATA.offers,
    get icon() {
      return DATA.tripTypes[this.tripType];
    },
  };
}

const TRIP_POINTS_DATA = [...Array(4)].map(generateTripPoint);

export default TRIP_POINTS_DATA;
