function tripPointOffers(offers) {
  if (Array.isArray(offers)) {
    return offers.map((offer) => {
      if (offer.accepted) {
        return `
          <li>
            <button class="trip-point__offer">${offer.title} +${offer.price}</button>
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
