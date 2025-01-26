const nonograms = [
  {
    name: "snake",
    matrix: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
  },
  {
    name: "dog",
    matrix: [
      [0, 0, 0, 1, 0],
      [1, 0, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
    ],
  },
  {
    name: "smile",
    matrix: [
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
  },
  {
    name: "snowflake",
    matrix: [
      [1, 0, 1, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
    ],
  },
  {
    name: "airplane",
    matrix: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ],
  },
  {
    name: "mouse",
    matrix: [
      [0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
      [0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
      [0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [0, 0, 1, 1, 0, 1, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 1, 1, 1, 0],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
  },
  {
    name: "music",
    matrix: [
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
      [0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 1, 1, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    name: "wakeUp",
    matrix: [
      [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
      [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    ],
  },
  {
    name: "leaf",
    matrix: [
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 1, 1, 0, 1, 0, 1, 1, 0],
      [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 0, 1, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    name: "football",
    matrix: [
      [1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 0, 1, 1, 1, 1, 0, 0, 0],
    ],
  },
  {
    name: "savanna",
    matrix: [
      [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],

      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1],

      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
      [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1],
      [0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1],
    ],
  },
  {
    name: "duck",
    matrix: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],

      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],

      [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    ],
  },
  {
    name: "dolphin",
    matrix: [
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],

      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    ],
  },
  {
    name: "clover",
    matrix: [
      [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],

      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1],

      [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    name: "flower",
    matrix: [
      [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
      [1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0],

      [1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
      [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],

      [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    ],
  },
];

function generateHints(matrix) {
  let hints = {
    rowsHints: [],
    columnsHints: [],
  };
  for (let i = 0; i < matrix.length; i += 1) {
    let count = 0;
    let rowHints = [];
    for (let j = 0; j < matrix[i].length; j += 1) {
      if (matrix[i][j] === 1) {
        count += 1;
      } else {
        if (count !== 0) {
          rowHints.push(count);
          count = 0;
        }
      }
    }
    if (rowHints.length === 0 && count === 0) rowHints.push(count);
    else if (count !== 0) rowHints.push(count);
    hints.rowsHints.push(rowHints);
  }
  for (let i = 0; i < matrix[0].length; i += 1) {
    let count = 0;
    let colHints = [];
    for (let j = 0; j < matrix.length; j += 1) {
      if (matrix[j][i] === 1) {
        count += 1;
      } else {
        if (count !== 0) {
          colHints.push(count);
          count = 0;
        }
      }
    }
    if (colHints.length === 0 && count === 0) colHints.push(count);
    else if (count !== 0) colHints.push(count);
    hints.columnsHints.push(colHints);
  }
  return hints;
}

function calculateGridSize(nanogram) {
  let gameSize = nanogram.matrix.length; // game grid size (row x col)
  let gridSize = {
    colCount: gameSize,
    rowCount: gameSize,
  };
  let rowsHintsCount, colsHintsCount;
  let hints = generateHints(nanogram.matrix);
  colsHintsCount = Math.max(...hints.rowsHints.map((el) => el.length));
  rowsHintsCount = Math.max(...hints.columnsHints.map((el) => el.length));
  gridSize.colCount += colsHintsCount;
  gridSize.rowCount += rowsHintsCount;
  return gridSize;
}

function createGrid(nanogram) {
  let grid = document.createElement("div");
  grid.className = "grid";
  let gridSize = calculateGridSize(nanogram);
  let gridItemsCount = gridSize.colCount * gridSize.rowCount;
  for (let i = 0; i < gridItemsCount; i += 1) {
    let gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    grid.append(gridItem);
  }
  grid.style.gridTemplateColumns = `repeat(${gridSize.colCount}, 30px)`;
  document.querySelector("body").append(grid);
}

function fillInGridWithHints(nanogram) {
  let gridSize = calculateGridSize(nanogram);
  let colCount = gridSize.colCount;
  let rowCount = gridSize.rowCount;
  let gridItems = Array.from(document.querySelectorAll(".grid-item"));
  let matrixFromGrid = [];
  console.log(gridItems);
  for (let i = 0; i <= rowCount; i += 1) {
    matrixFromGrid.push(gridItems.slice(i * colCount, i * colCount + colCount));
  }
  let hints = generateHints(nanogram.matrix);
  let colsHintsCount = Math.max(...hints.rowsHints.map((el) => el.length));
  let rowsHintsCount = Math.max(...hints.columnsHints.map((el) => el.length));

  //area for columns hints

  for (let j = colsHintsCount; j < colCount; j += 1) {
    for (let i = rowsHintsCount - 1; i >= 0; i -= 1) {
      matrixFromGrid[i][j].style.backgroundColor = "red";
      matrixFromGrid[i][j].textContent = hints.columnsHints[
        j - colsHintsCount
      ].toReversed()[Math.abs(i - rowsHintsCount + 1)]
        ? hints.columnsHints[j - colsHintsCount].toReversed()[
            Math.abs(i - rowsHintsCount + 1)
          ]
        : "";
    }
  }
  //area for rows hints
  for (let i = rowsHintsCount; i < rowCount; i += 1) {
    for (let j = colsHintsCount - 1; j >= 0; j -= 1) {
      matrixFromGrid[i][j].style.backgroundColor = "red";
      matrixFromGrid[i][j].textContent = hints.rowsHints[
        i - rowsHintsCount
      ].toReversed()[Math.abs(j - colsHintsCount + 1)]
        ? hints.rowsHints[i - rowsHintsCount].toReversed()[
            Math.abs(j - colsHintsCount + 1)
          ]
        : "";
    }
  }
}

export {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
};
