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
   * @param {array} data массив объектов, на основе которых формируются компоненты
   * @param {class} Component
   * @param {Object} options - дополнительные опции для компонента
   * @param {string} componentsName название массива, в котором будут храниться отрендеренные компоненты
   */
  defineCurrentlyRenderedObjects(data, Component, options, componentsName) {
    currentlyRenderedObjects[componentsName] = [];
    data.forEach((el) => {
      currentlyRenderedObjects[componentsName].push(new Component(el, options));
    });
  },


  /**
   * @param {object} container
   * @param {array} components массива, c отрендеренными компонентами
   */
  renderComponent(container, components) {
    container.innerHTML = ``;

    utils.renderElements(container, components.map((el) => {
      return el.render();
    }));
  },
};

export default utils;
