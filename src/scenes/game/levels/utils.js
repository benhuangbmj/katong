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

  const directions = [
    [-1, 0], // North
    [1, 0], // South
    [0, 1], // East
    [0, -1], // West
  ];

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function dfs(row, col) {
    visited[row][col] = true;

    const randomDirections = shuffle(directions);

    for (const [dr, dc] of randomDirections) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol]
      ) {
        const currentCellRow = row * 2 + 1;
        const currentCellCol = col * 2 + 1;
        const nextCellRow = newRow * 2 + 1;
        const nextCellCol = newCol * 2 + 1;

        const wallRow = (currentCellRow + nextCellRow) / 2;
        const wallCol = (currentCellCol + nextCellCol) / 2;
        board[wallRow][wallCol] = " ";

        dfs(newRow, newCol);
      }
    }
  }

  // 1. Standard DFS maze
  dfs(0, 0);

  // 2. Post-process: remove all dead ends (no cell with degree 1)
  function isInside(r, c) {
    return r > 0 && r < height - 1 && c > 0 && c < width - 1;
  }

  function getCorridorNeighbors(r, c) {
    const result = [];
    const steps = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of steps) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < height &&
        nc >= 0 &&
        nc < width &&
        board[nr][nc] === " "
      ) {
        result.push([nr, nc]);
      }
    }
    return result;
  }

  function breakRandomInternalWallAround(r, c) {
    const wallCandidates = [];
    const steps = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of steps) {
      const wr = r + dr;
      const wc = c + dc;
      if (isInside(wr, wc) && board[wr][wc] !== " ") {
        wallCandidates.push([wr, wc]);
      }
    }
    if (wallCandidates.length === 0) return false;
    const [wr, wc] =
      wallCandidates[Math.floor(Math.random() * wallCandidates.length)];
    board[wr][wc] = " ";
    return true;
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 1; r < height - 1; r += 2) {
      for (let c = 1; c < width - 1; c += 2) {
        if (board[r][c] !== " ") continue;
        const neighbors = getCorridorNeighbors(r, c);
        if (neighbors.length === 1) {
          // dead end: open one more wall
          const opened = breakRandomInternalWallAround(r, c);
          if (opened) {
            changed = true;
          }
        }
      }
    }
  }

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
  console.log(rawMaze);
  const output = rawMaze.map((row) => row.join(""));
  return output;
}

export default {
  outputMaze,
  outputRawMaze,
};
