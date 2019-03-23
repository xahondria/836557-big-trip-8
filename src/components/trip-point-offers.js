function tripPointOffers(offers) {
  if (typeof offers === `object`) {
    return Object.keys(offers).map((offer) => {
      if (offers[offer].isChecked) {
        return `
          <li>
            <button class="trip-point__offer">${offer}</button>
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
