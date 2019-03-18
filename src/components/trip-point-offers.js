function tripPointOffers(offers) {
  return offers.map((offer) => `
    <li>
      <button class="trip-point__offer">${offer}</button>
    </li>
  `)
    .join``;
}

export default tripPointOffers;
