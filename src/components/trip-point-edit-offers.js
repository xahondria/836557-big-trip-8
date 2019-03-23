function tripPointEditOffers(offers) {
  if (typeof offers === `object`) {
    return Object.getOwnPropertyNames(offers).map((offer) => {
      return `
        <input 
          class="point__offers-input visually-hidden" 
          type="checkbox" 
          id="${offer}" 
          name="offer" 
          value="${offer}"
          ${offers[offer].isChecked && `checked`}
        >
        <label for="${offer}" class="point__offers-label">
          <span class="point__offer-service">${offers[offer].title}</span> + €<span class="point__offer-price">${offers[offer].price}</span>
        </label>
        `;
    })
      .join``;
  } else {
    return ``;
  }
}
export default tripPointEditOffers;
