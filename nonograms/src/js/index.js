import "../../index.html";
import "../sass/_style.scss";
import "../assets/close.svg";
import "../sass/abstracts/colors.scss";
import {
  nonograms,
  createGrid,
  fillInGridWithHints,
  defineNavigationStyleOnScreenSizeChange,
} from "./nonograms";
import {
  changeLevelHandler,
  createGameElements,
  selectPictureHandler,
} from "./elementsRendering";

import {
  gridHandler,
  getCurrentPicture,
  buttonsHandler,
  randomButtonHandler,
  themeHandler,
  soundHandler,
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
  themeHandler();
  soundHandler();
  defineNavigationStyleOnScreenSizeChange();
});
