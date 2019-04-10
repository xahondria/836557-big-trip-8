function tripPointOffers(offers) {
  if (Array.isArray(offers)) {
    return offers.map((offer) => {
      const offerName = typeof offer.title !== `undefined` ? offer.title : offer.name;
      if (offer.accepted) {
        return `
          <li>
            <button class="trip-point__offer">${offerName} +${offer.price}</button>
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
