function tripPointEditPictures(pictures) {
  return pictures.map((picture) => `<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`).join``;
}

export default tripPointEditPictures;
