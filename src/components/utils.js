const Utils = {
  getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
  },

  getRandomKeyFromObject(obj) {
    const keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
  },

  getRandomElementsFromArray(arr, newArrMaxLength) {
    arr = arr.slice();
    let newArr = [];
    const newArrLength = Math.floor(Math.random() * (newArrMaxLength + 1));
    for (let i = 0; i < newArrLength; i++) {
      const randomIdx = Math.floor(Math.random() * arr.length);
      newArr[i] = arr[randomIdx];
      arr.splice(randomIdx, 1);
    }

    return newArr;
  },
};

export default Utils;
