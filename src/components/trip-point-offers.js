function tripPointOffers(offers) {
  if (typeof offers === `object`) {
    return Object.getOwnPropertyNames(offers).map((offer) => {
      if (offers[offer].isChecked) {
        return `
          <li>
            <button class="trip-point__offer">${offers[offer].title} +${offers[offer].price}</button>
          </li>
        `;
      } else {
        return ``;
      }
    })
    .join``;
  } else {
    return ``;
  }
}

export default tripPointOffers;
