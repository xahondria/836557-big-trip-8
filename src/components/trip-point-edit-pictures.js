function tripPointEditPictures(pictures) {
  if (pictures) {
    return pictures.map((picture) => `<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`).join``;
  }
  return ``;
}

export default tripPointEditPictures;
