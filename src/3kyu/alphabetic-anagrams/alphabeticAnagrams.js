/*
  Alphabetic Anagrams
  https://www.codewars.com/kata/53e57dada0cb0400ba000688
*/

const listPosition = (word) => {
  word = word.split("");
  const sorted = word.slice().sort();

  const factorialise = (num) => {
    if (num < 0) {
      return -1;
    } else if (num === 0) {
      return 1;
    } else {
      return num * factorialise(num - 1);
    }
  };

  const getLetterCounts = (word) =>
    word.split("").reduce((acc, letter) => {
      acc[letter] = acc[letter] ? acc[letter] + 1 : 1;
      return acc;
    }, {});

  const calculatePermutations = (word) => {
    const x = factorialise(word.length);
    const letterCountsMap = getLetterCounts(word);
    const y = Object.values(letterCountsMap).reduce(
      (acc, letterCount) => acc * factorialise(letterCount),
      1
    );

    return x / y;
  };

  return word.reduce((a, c) => {
    const index = sorted.indexOf(c);

    sorted.splice(index, 1);

    const set = [...new Set(sorted.slice(0, index))];

    return (
      a +
      set.reduce(
        (acc, l) => acc + calculatePermutations(sorted.join("").replace(l, c)),
        0
      )
    );
  }, 1);
};

module.exports = listPosition;
