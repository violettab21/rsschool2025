import "../../index.html";
import "../sass/_style.scss";
import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
} from "./nonograms";

document.addEventListener("DOMContentLoaded", () => {
  createGrid(nonograms[7]);
});
