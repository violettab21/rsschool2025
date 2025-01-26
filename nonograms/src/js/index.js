import "../../index.html";
import "../sass/_style.scss";
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
} from "./elementsRendering";
document.addEventListener("DOMContentLoaded", () => {
  createGameElements();
  createGrid(nonograms[9]);
  fillInGridWithHints(nonograms[9]);
  changeLevelHandler();
  selectPictureHandler();
});
