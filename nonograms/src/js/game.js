import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";

function gridHandler() {
  document.querySelector(".grid").addEventListener("click", (event) => {
    if (event.target.classList.contains("grid-item__game")) {
      event.target.classList.toggle("grid-item__game_colored");

      console.log(
        checkSolution(nonograms.find((el) => el.name === getCurrentPicture()))
      );
    }
  });
  document.querySelector(".grid").addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("grid-item__game")) {
      event.target.style.backgroundColor = "grey";
    }
  });
}

function checkSolution(nonogram) {
  let gridItems = Array.from(document.querySelectorAll(".grid-item__game"));
  let matrixFromGrid = [];
  console.log(gridItems);
  for (let i = 0; i < nonogram.matrix.length; i += 1) {
    matrixFromGrid.push(
      gridItems.slice(
        i * nonogram.matrix.length,
        i * nonogram.matrix.length + nonogram.matrix.length
      )
    );
  }

  for (let i = 0; i < nonogram.matrix.length; i += 1) {
    for (let j = 0; j < nonogram.matrix.length; j += 1) {
      if (matrixFromGrid[i][j].classList.contains("grid-item__game_colored"))
        matrixFromGrid[i][j] = 1;
      else matrixFromGrid[i][j] = 0;
    }
  }
  let isCorrect;
  for (let i = 0; i < nonogram.matrix.length; i += 1) {
    for (let j = 0; j < nonogram.matrix.length; j += 1) {
      if (matrixFromGrid[i][j] === nonogram.matrix[i][j]) isCorrect = true;
      else {
        isCorrect = false;
        console.log(nonogram.matrix);
        console.log(matrixFromGrid);
        return isCorrect;
      }
    }
  }
  console.log(nonogram.matrix);
  console.log(matrixFromGrid);
  return isCorrect;
}

function getCurrentPicture() {
  return document
    .querySelector(".pictures__picture_selected")
    .textContent.toLocaleLowerCase();
}
export { gridHandler, checkSolution };
