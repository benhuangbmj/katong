const directionPrototype = [
  [-1, 0], // North
  [1, 0], // South
  [0, 1], // East
  [0, -1], // West
];

function generateLevelTemplate(size) {
  const output = Array.from(Array(2 * size + 1), (_, i) => {
    if (i % 2 == 0) {
      return Array(2 * size + 1).fill("-");
    } else {
      return Array.from(Array(2 * size + 1), (j, f) => {
        if (f % 2 == 0) {
          return "|";
        } else {
          return " ";
        }
      });
    }
  });
  return output;
}

function generateRawMaze(board) {
  const height = board.length;
  const width = board[0].length;

  const rows = Math.floor(height / 2);
  const cols = Math.floor(width / 2);

  const visited = Array.from(Array(rows), () => Array(cols).fill(false));

  const directions = [...directionPrototype];

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Recursive DFS function
  function dfs(row, col) {
    visited[row][col] = true;

    // Randomize direction order
    const randomDirections = shuffle(directions);

    let moved = false;
    for (const [dr, dc] of randomDirections) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if new position is valid and unvisited
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol]
      ) {
        moved = true;

        // Convert cell coordinates to board coordinates
        const currentCellRow = row * 2 + 1;
        const currentCellCol = col * 2 + 1;
        const nextCellRow = newRow * 2 + 1;
        const nextCellCol = newCol * 2 + 1;

        // Remove wall between current cell and next cell
        const wallRow = (currentCellRow + nextCellRow) / 2;
        const wallCol = (currentCellCol + nextCellCol) / 2;
        board[wallRow][wallCol] = " ";

        // Continue DFS from new cell
        dfs(newRow, newCol);
      }
    }

    // If we didn't move (dead end), break a random non-perimeter wall adjacent to this cell
    if (!moved) {
      const currentCellRow = row * 2 + 1;
      const currentCellCol = col * 2 + 1;
      const candidates = [];
      for (const [dr, dc] of directions) {
        const nbrRow = row + dr;
        const nbrCol = col + dc;

        // neighbor must be inside cell bounds
        if (nbrRow >= 0 && nbrRow < rows && nbrCol >= 0 && nbrCol < cols) {
          const nextCellRow = nbrRow * 2 + 1;
          const nextCellCol = nbrCol * 2 + 1;
          const wallRow = (currentCellRow + nextCellRow) / 2;
          const wallCol = (currentCellCol + nextCellCol) / 2;

          // ensure wall is not on the board perimeter and currently closed
          if (
            wallRow > 0 &&
            wallRow < height - 1 &&
            wallCol > 0 &&
            wallCol < width - 1 &&
            board[wallRow][wallCol] !== " "
          ) {
            candidates.push({ wallRow, wallCol });
          }
        }
      }
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        board[pick.wallRow][pick.wallCol] = " ";
      }
    }
  }

  // Start DFS from top-left corner (0, 0)
  dfs(0, 0);
  board[1][2] = " ";
  board[2][1] = " ";
  return board;
}

function outputMaze(size) {
  const rawMaze = generateRawMaze(generateLevelTemplate(size));
  rawMaze.pop();
  rawMaze.forEach((row) => row.pop());
  const output = rawMaze.map((row) => row.join(""));
  return output;
}
function outputRawMaze(size) {
  const rawMaze = generateRawMaze(generateLevelTemplate(size));
  const output = rawMaze.map((row) => row.join(""));
  return output;
}

export default {
  outputMaze,
  outputRawMaze,
};
