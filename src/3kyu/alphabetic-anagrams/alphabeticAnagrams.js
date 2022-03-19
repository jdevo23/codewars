function listPosition(word) {
  word = word.split("");
  const bestWord = word.slice().sort();

  const factorialise = (num) => {
    if (num < 0) {
      return -1;
    } else if (num === 0) {
      return 1;
    } else {
      return num * factorialise(num - 1);
    }
  };

  const calculateCombinations = (array) => {
    const obj = {};

    for (let i = 0; i < array.length; i++) {
      if (obj[array[i]]) {
        obj[array[i]] = obj[array[i]] += 1;
      } else {
        obj[array[i]] = 1;
      }
    }

    let divisor = 1;

    for (const key in obj) {
      divisor = divisor * factorialise(obj[key]);
    }

    return factorialise(array.length) / divisor;
  };

  const calculateCharOccurrences = (char, array) => {
    let num = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === char) {
        num++;
      }
    }
    return num;
  };

  const calculatePosition = (p, index, numOccurrences, numCombinations) => {
    if (index > 1) {
      if (!numOccurrences) {
        return p + numCombinations;
      } else {
        return;
      }
    } else {
      return p;
    }
  };

  let position = calculateCombinations(bestWord);

  for (let i = 0; i < word.length; i++) {
    // find index of letter in array
    const index = bestWord.indexOf(word[i]);
    // remove element from array
    bestWord.splice(index, 1);
    // update range
    //     position = calculatePosition(position, index + 1, calculateCharOccurrences(word[i], bestWord), calculateCombinations(bestWord));
  }

  return position;
}
