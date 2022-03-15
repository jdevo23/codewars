/*
  Battleship field validator
  https://www.codewars.com/kata/52bb6539a4cf1b12d90005b7
*/

function validateBattlefield(field) {
  const fleet = {
    battleship: {
      length: 4,
      required: 1,
    },
    cruiser: {
      length: 3,
      required: 2,
    },
    destroyer: {
      length: 2,
      required: 3,
    },
    submarine: {
      length: 1,
      required: 4,
    },
  };

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field.length; j++) {
      // found part of a ship
      if (field[i][j] === 1) {
        // find end of ship across
        const rowIndex = field[i].slice(j + 1).findIndex((el) => el === 0);

        const yCoords = [j, rowIndex + j];
        const yLen = yCoords[1] - yCoords[0] + 1;

        // find first zero vertically
        let foundZero = false;
        let xIndex = i;
        while (!foundZero) {
          if (field[xIndex][j] === 0) {
            foundZero = true;
            break;
          }
          xIndex++;
        }
        const xCoords = [i, xIndex - 1];
        const xLen = xCoords[1] - xCoords[0] + 1;

        if (yLen > 4 || xLen > 4 || (yLen > 1 && xLen > 1)) {
          return false;
        }

        // check edges & corners for any 1s
        for (let m = yCoords[0] - 1; m <= yCoords[1] + 1; m++) {
          if (m >= 0 && m <= 9 && m !== j) {
            if (
              (field[i - 1] && field[i - 1][m]) ||
              (field[i + 1] && field[i + 1][m])
            ) {
              return false;
            }
          }
        }

        for (let m = xCoords[0] - 1; m <= xCoords[1] + 1; m++) {
          if (m >= 0 && m <= 9 && m !== i) {
            if (field[m][j - 1] || field[m][j + 1]) {
              return false;
            }
          }
        }

        let len = 1;

        if (xLen > yLen) {
          len = xLen;
        } else if (yLen > xLen) {
          len = yLen;
        }

        for (const value in fleet) {
          if (fleet[value].length === len) {
            const x = fleet[value].required;
            x = x - 1;
            if (x < 0) {
              return false;
            } else {
              fleet[value].required = x;
            }
          }
        }

        // clean up by setting values to 0
        for (let n = yCoords[0]; n <= yCoords[1]; n++) {
          field[i][n] = 0;
        }

        for (let n = xCoords[0]; n <= xCoords[1]; n++) {
          field[n][j] = 0;
        }
      }
    }
  }

  // loop over fleet to check all values are 0
  for (const value in fleet) {
    if (fleet[value].required > 0) {
      return false;
    }
  }

  return true;
}

const battlefield = [
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

validateBattlefield(battlefield);
