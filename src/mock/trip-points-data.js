import utils from "../utils";
import moment from "moment";

const DATA = {
  HOUR_TO_MS_RATE: 3600000,
  HOUR_DISPERSION: 5,
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
      title: `Add luggage`,
      isChecked: true,
      price: 30,
    },
    'switch-to-comfort-class': {
      title: `Switch to comfort class`,
      isChecked: true,
      price: 100,
    },
    'add-meal': {
      title: `Add meal`,
      isChecked: false,
      price: 15,
    },
    'choose-seats': {
      title: `Choose seats`,
      isChecked: false,
      price: 5,
    },
  },
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
};

function getOffers() {
  let offers = {};
  const offersKeys = Object.keys(DATA.offers);
  utils.getRandomElementsFromArray(offersKeys, utils.getRandomInt(offersKeys.length)).forEach((offer) => {
    offers[offer] = DATA.offers[offer];
  });
  return offers;
}

function generateTripPoint() {
  return {
    tripType: utils.getRandomKeyFromObject(DATA.tripTypes),
    city: DATA.cities[DATA.cities.length * Math.random() << 0],
    get timetable() {
      return `
        ${moment(this.startTime).format(`H mm`)} &mdash; ${moment(this.startTime + this.duration).format(`H mm`)}
      `.trim();
    },
    startTime: Date.now() + utils.getRandomInt(DATA.HOUR_DISPERSION) * DATA.HOUR_TO_MS_RATE,
    duration: 800000 + utils.getRandomInt(8000000),
    price: `20`,
    offers: getOffers(),
    get icon() {
      return DATA.tripTypes[this.tripType];
    },
  };
}

const TRIP_POINTS_DATA = [...Array(4)].map(generateTripPoint);

export default TRIP_POINTS_DATA;
