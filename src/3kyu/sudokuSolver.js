/*
  Sudoku Solver
  https://www.codewars.com/kata/5296bc77afba8baa690002d7
*/

// returns true if number can be entered into a position, false if not
const checkPossibility = (num, coords, puzzle) => {
  const [row, col] = coords;

  // check rows
  if (puzzle[row].includes(num)) {
    return false;
  }

  // check columns
  for (let i = 0; i < 9; i++) {
    if (puzzle[i][col] === num) {
      return false;
    }
  }

  const row0 = Math.floor(row / 3) * 3;
  const col0 = Math.floor(col / 3) * 3;

  // check boxes
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (puzzle[row0 + i][col0 + j] === num) {
        return false;
      }
    }
  }

  return true;
};

function sudoku(puzzle) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] === 0) {
        for (let k = 1; k <= 9; k++) {
          if (checkPossibility(k, [i, j], puzzle)) {
            puzzle[i][j] = k;
            if (sudoku(puzzle)) {
              return puzzle;
            } else {
              puzzle[i][j] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return puzzle;
}

var p = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

console.table(sudoku(p));
