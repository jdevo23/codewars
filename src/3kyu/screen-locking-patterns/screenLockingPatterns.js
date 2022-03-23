/* 
  Screen Locking Patterns
  https://www.codewars.com/kata/585894545a8a07255e0002f1
*/

const returnIndex = (at, arrayOfArrays) => {
  for (let i = 0; i < arrayOfArrays.length; i++) {
    for (let j = 0; j < arrayOfArrays[i].length; j++) {
      if (arrayOfArrays[i][j] === at) {
        return [i, j];
      }
    }
  }
};

const returnFilter = ([i, j], at, array, v) => {
  const filter = [at];

  if (array[i] && array[i][j + 2]) {
    if (!v[array[i][j + 1]]) {
      filter.push(array[i][j + 2]);
    }
  }

  if (array[i] && array[i][j - 2]) {
    if (!v[array[i][j - 1]]) {
      filter.push(array[i][j - 2]);
    }
  }

  if (array[i + 2] && array[i + 2][j]) {
    if (!v[array[i + 1][j]]) {
      filter.push(array[i + 2][j]);
    }
  }

  if (array[i - 2] && array[i - 2][j]) {
    if (!v[array[i - 1][j]]) {
      filter.push(array[i - 2][j]);
    }
  }

  if (!v["E"]) {
    if (at === "A") {
      filter.push("I");
    }
    if (at === "C") {
      filter.push("G");
    }
    if (at === "G") {
      filter.push("C");
    }
    if (at === "I") {
      filter.push("A");
    }
  }
  
  return filter;
}

const countPatternsFrom = (firstPoint, length) => {
  // setTimeout(() => console.log("16 seconds"), 16000)
  let count = 0;

  const adjacencyList = [
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["G", "H", "I"],
  ];

  const visited = {
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
    F: false,
    G: false,
    H: false,
    I: false,
  };

  const dfs = (at, numPoints, v) => {
    if (v[at]) {
      return;
    }

    if (numPoints === length) {
      count++;
      return;
    }

    v[at] = true;

    let neighbours = adjacencyList.slice();
    const filter = returnFilter(returnIndex(at, adjacencyList), at, neighbours, v);

    neighbours = neighbours
      .reduce((acc, curr) => acc.concat(curr), [])
      .filter((n) => !filter.includes(n));

    for (let i = 0; i < neighbours.length; i++) {
      dfs(neighbours[i], numPoints + 1, Object.assign({}, v));
    }
  };

  dfs(firstPoint, 1, visited);

  return count;
};

module.exports = countPatternsFrom;
