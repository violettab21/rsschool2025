import "../../index.html";
import "../sass/_style.scss";
import "../assets/close.svg";
import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";
import {
  changeLevelHandler,
  createGameElements,
  selectPictureHandler,
  createButtons,
} from "./elementsRendering";

import {
  gridHandler,
  checkSolution,
  getCurrentPicture,
  startTimer,
  buttonsHandler,
  randomButtonHandler,
} from "./game";
document.addEventListener("DOMContentLoaded", () => {
  createGameElements();
  changeLevelHandler();
  selectPictureHandler();
  let selectedNonogram = nonograms.find(
    (el) => el.name === getCurrentPicture()
  );
  createGrid(selectedNonogram);
  fillInGridWithHints(selectedNonogram);
  gridHandler();
  buttonsHandler();
  randomButtonHandler();
});
