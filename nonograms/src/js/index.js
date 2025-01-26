import "../../index.html";
import "../sass/_style.scss";
import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";

document.addEventListener("DOMContentLoaded", () => {
  createGrid(nonograms[9]);
  fillInGridWithHints(nonograms[9]);
});
