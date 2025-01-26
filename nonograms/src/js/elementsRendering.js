import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";
import { gridHandler } from "./game";
function createGameElements() {
  let main = document.createElement("main");
  let container = document.createElement("div");
  container.className = "wrapper";
  let levelsContainer = document.createElement("div");
  levelsContainer.className = "levels";
  let levelsLabel = document.createElement("label");
  levelsLabel.className = "levels__label";
  levelsLabel.for = "levels";
  levelsLabel.textContent = "Choose a level";
  let levels = document.createElement("select");
  for (let i = 0; i < 3; i += 1) {
    let level = document.createElement("option");
    switch (i) {
      case 0: {
        level.value = "easy";
        level.textContent = "Easy";
        break;
      }
      case 1: {
        level.value = "medium";
        level.textContent = "Medium";
        break;
      }
      case 2: {
        level.value = "hard";
        level.textContent = "Hard";
        break;
      }
    }
    levels.append(level);
  }
  levels.name = "levels";
  levels.className = "levels__list";
  levelsContainer.append(levelsLabel);
  levelsContainer.append(levels);
  container.append(levelsContainer);
  main.append(container);
  document.querySelector("body").append(main);
  createPicturesList();
}

function createPicturesList(level = "easy") {
  let matrixSize = 0;
  switch (level) {
    case "easy":
      matrixSize = 5;
      break;
    case "medium":
      matrixSize = 10;
      break;
    case "hard":
      matrixSize = 15;
      break;
  }
  let pictures = document.createElement("ul");
  pictures.className = "pictures";
  nonograms
    .filter((el) => el.matrix.length === matrixSize)
    .forEach((el) => {
      let picture = document.createElement("li");
      picture.className = "pictures__picture";
      picture.textContent = el.name;
      pictures.append(picture);
    });
  document.querySelector(".levels").after(pictures);
}

function changeLevelHandler() {
  document.querySelector(".levels__list").addEventListener("change", () => {
    let currentLevel = document.querySelector(".levels__list").value;
    if (document.querySelector(".pictures")) {
      document.querySelector(".pictures").remove();
      createPicturesList(currentLevel);
      selectPictureHandler();
    } else createPicturesList(currentLevel);
  });
}

function selectPictureHandler() {
  document.querySelector(".pictures").addEventListener("click", (event) => {
    if (event.target.classList.contains("pictures__picture")) {
      document
        .querySelectorAll(".pictures__picture")
        .forEach((el) => el.classList.remove("pictures__picture_selected"));
      event.target.classList.add("pictures__picture_selected");
      let selectedNonogram = nonograms.find(
        (el) => el.name === event.target.textContent.toLowerCase()
      );
      if (document.querySelector(".grid"))
        document.querySelector(".grid").remove();
      createGrid(selectedNonogram);
      fillInGridWithHints(selectedNonogram);
      gridHandler();
    }
  });
}

export {
  createGameElements,
  createPicturesList,
  changeLevelHandler,
  selectPictureHandler,
};
