const Utils = {
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
};

export default Utils;
