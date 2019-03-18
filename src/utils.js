import currentlyRenderedObjects from "./currently-rendered-objects";

const utils = {
  getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
  },

  getRandomKeyFromObject(obj) {
    const keys = Object.keys(obj);
    return keys[this.getRandomInt(keys.length - 1)];
  },

  getRandomElementsFromArray(arr, newArrLength) {
    if (newArrLength > arr.length) {
      throw new RangeError(`getRandomElementsFromArray:  more elements taken than available`);
    }

    const randomArrIndexes = new Set();

    while (randomArrIndexes.size < newArrLength) {
      randomArrIndexes.add(Math.floor(Math.random() * arr.length));
    }
    const newArr = new Array(newArrLength);

    for (let el of [...randomArrIndexes]) {
      newArr[[...randomArrIndexes].indexOf(el)] = arr[el];
    }

    return newArr;
  },

  renderElements(container, elements) {
    elements.map((el) => {
      container.appendChild(el);
    });
  },

  /**
   * @param {object} container
   * @param {array} data массив объектов, на основе которых формируются компоненты
   * @param {class} Component
   * @param {string} componentsName название массива, в котором будут храниться отрендеренные компоненты
   */
  renderComponent(container, data, Component, componentsName) {
    container.innerHTML = ``;
    Object.defineProperty(currentlyRenderedObjects, componentsName, {
      value: [],
      writable: true,
      configurable: true,
    });
    data.forEach((el) => {
      currentlyRenderedObjects[componentsName].push(new Component(el));
    });

    utils.renderElements(container, currentlyRenderedObjects[componentsName].map((el) => el.render()));
  },
};

export default utils;
