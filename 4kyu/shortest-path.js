/*
  Path Finder #2: shortest path
  https://www.codewars.com/kata/57658bfa28ed87ecfa00058a
*/

function pathFinder(maze) {
  maze = maze.split("\n").map((str) => str.split(""));

  const targetNode = [maze.length - 1, maze.length - 1];
  const closed = [];
  let open = [
    {
      position: [0, 0],
      gCost: 0,
      hCost: Math.sqrt(
        Math.pow(targetNode[0] - 0, 2) + Math.pow(targetNode[1] - 0, 2)
      ),
      parent: null,
    },
  ];
  const numOfAvailablePositions = maze
    .reduce((acc, curr) => acc.concat(curr))
    .filter((el) => el === ".").length;

  const getNeighbour = (
    [a, b],
    {
      currentNode: {
        position: [c, d],
      },
      gCost,
    }
  ) => ({
    position: [c + a, d + b],
    gCost: gCost + 1,
    hCost: Math.sqrt(
      Math.pow(targetNode[0] - c + a, 2) + Math.pow(targetNode[1] - d + b, 2)
    ),
    parent: [c, d],
  });

  while (closed.length < numOfAvailablePositions) {
    let currentNode = open.shift();

    if (!currentNode) {
      return false;
    }

    closed.push(currentNode);

    const {
      position: [a, b],
    } = currentNode;
    maze[a][b] = "W";

    if (
      currentNode.position[0] === targetNode[0] &&
      currentNode.position[1] === targetNode[1]
    ) {
      let tally = 0;

      const findParent = (parent) => {
        // handles case of 1x1 maze, not sure how else to do this
        if (!parent.parent) {
          return;
        }

        tally++;

        const {
          parent: [a, b],
        } = parent;

        const newParent = closed.find(
          ({ position: [c, d] }) => a === c && b === d
        );

        if (!newParent.parent) {
          return;
        } else {
          findParent(newParent);
        }
      };

      findParent(closed[closed.length - 1]);
      return tally;
    }

    const neighbours = [
      getNeighbour([-1, 0], { currentNode }),
      getNeighbour([0, 1], { currentNode }),
      getNeighbour([1, 0], { currentNode }),
      getNeighbour([0, -1], { currentNode }),
    ];

    neighbours
      .sort((a, b) => b.gCost + b.hCost - (a.gCost + a.hCost))
      .forEach(({ position: [a, b], gCost, hCost, ...rest }) => {
        if (maze[a] && maze[a][b] === ".") {
          if (!open.find(({ position: [c, d] }) => a === c && b === d)) {
            const i = open.findIndex(
              ({ gCost: g, hCost: h }) => g + h >= gCost + hCost
            );
            const el = { position: [a, b], gCost, hCost, ...rest };

            i > -1 ? open.splice(i, 0, el) : open.push(el);
          }
        }
      });
  }

  return false;
}
