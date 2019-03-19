function tripPointEditDestinations(destinations) {
  return destinations.map((destination) => `
    <option value=${destination}></option>
  `).join``;
}

export default tripPointEditDestinations;
