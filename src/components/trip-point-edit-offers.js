function tripPointEditOffers(offers) {
  if (typeof offers === `object`) {
    return Object.keys(offers).map((offer) => {
      const offerName = typeof offers[offer].title !== `undefined` ? offers[offer].title : offers[offer].name;
      return `
        <input 
          class="point__offers-input visually-hidden" 
          type="checkbox" 
          id="${offer}" 
          name="offer" 
          value="${offer}"
          ${offers[offer].accepted && `checked`}
        >
        <label for="${offer}" class="point__offers-label">
          <span class="point__offer-service">${offerName}</span> + €<span class="point__offer-price">${offers[offer].price}</span>
        </label>
        `;
    })
      .join``;
  } else {
    return ``;
  }
}
export default tripPointEditOffers;
