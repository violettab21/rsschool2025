import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";
import { generateModal, createCross } from "./elementsRendering";

function gridHandler() {
  document.querySelector(".grid").addEventListener("click", (event) => {
    if (event.target.closest(".grid-item__game")) {
      event.target
        .closest(".grid-item__game")
        .classList.toggle("grid-item__game_colored");

      if (
        checkSolution(nonograms.find((el) => el.name === getCurrentPicture()))
      )
        generateModal("You solved the nonogram!");
    }
  });
  document.querySelector(".grid").addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (event.target.closest(".grid-item__game")) {
      if (event.target.closest(".grid-item__game").childElementCount !== 0) {
        event.target.closest(".grid-item__game").innerHTML = "";
      } else createCross(event.target);
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
