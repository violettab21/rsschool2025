import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";
import { gridHandler, getCurrentPicture } from "./game";
import image from "../assets/close.svg";

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
    .forEach((el, i) => {
      let picture = document.createElement("li");
      picture.className = "pictures__picture";
      picture.textContent = el.name;
      if (i === 0) picture.classList.add("pictures__picture_selected");
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
      let selectedNonogram = nonograms.find(
        (el) => el.name === getCurrentPicture()
      );
      if (document.querySelector(".grid"))
        document.querySelector(".grid").remove();
      createGrid(selectedNonogram);
      fillInGridWithHints(selectedNonogram);
      gridHandler();
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
function generateModal(text) {
  let divContainer;
  divContainer = document.createElement("div");
  divContainer.className = "dark-view";
  let divModal;
  divModal = document.createElement("div");
  divModal.className = "modal";
  let spanCross = document.createElement("span");
  spanCross.className = "icon-close";
  let crossImage = document.createElement("img");
  crossImage.src = image;
  spanCross.append(crossImage);
  let divModalContent;
  divModalContent = document.createElement("div");
  divModalContent.className = "modal__text-block";
  let modalMessage = document.createElement("p");
  modalMessage.textContent = `${text}`;
  modalMessage.className = "modal__text";
  let modalImage = document.createElement("img");
  modalImage.className = "modal-image";
  divModalContent.append(modalMessage, modalImage);
  divContainer.append(divModal);
  divModal.append(spanCross);
  divModal.append(divModalContent);
  document.querySelector("main").append(divContainer);
  closeModal();
}
function closeModal() {
  document.querySelector(".icon-close").addEventListener("click", () => {
    document.querySelector(".dark-view").remove();
  });
}

function createCross(div) {
  let cross = document.createElement("span");
  cross.className = "cross";
  let line1 = document.createElement("span");
  line1.className = "cross__line";
  line1.classList.add("cross__line_line1");
  let line2 = document.createElement("span");
  line2.className = "cross__line";
  line2.classList.add("cross__line_line2");
  cross.append(line1, line2);
  div.append(cross);
}
export {
  createGameElements,
  createPicturesList,
  changeLevelHandler,
  selectPictureHandler,
  generateModal,
  createCross,
};
