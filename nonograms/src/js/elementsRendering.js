import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";
import { gridHandler, getCurrentPicture, timerReset } from "./game";
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
  let timerContainer = document.createElement("div");
  timerContainer.className = "timer-block";
  let timer = document.createElement("p");
  timer.className = "timer";
  timer.textContent = "00:00";
  timerContainer.append(timer);
  container.append(timerContainer);
  createButtons(container);
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
      timerReset();
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
      timerReset();
    }
  });
}
function generateModal() {
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

  divContainer.append(divModal);
  divModal.append(spanCross);
  divModal.append(divModalContent);
  document.querySelector("main").append(divContainer);
  closeModal();
}

function generateModalContentMessage(text) {
  let modalMessage = document.createElement("p");
  modalMessage.textContent = `${text}`;
  modalMessage.className = "modal__text";
  document.querySelector(".modal__text-block").append(modalMessage);
}

function generateModalContentTable(data) {
  let modalMessage = document.createElement("p");
  modalMessage.className = "modal__text";

  if (!data) {
    modalMessage.textContent = "No History of Games";
    document.querySelector(".modal__text-block").append(modalMessage);
  } else {
    modalMessage.textContent = "5 Best Results:";
    document.querySelector(".modal__text-block").append(modalMessage);
    let table = document.createElement("div");

    table.className = "results";
    let levelName = document.createElement("p");
    levelName.textContent = "Level";
    let pictureName = document.createElement("p");
    pictureName.textContent = "Picture";
    let timeName = document.createElement("p");
    timeName.textContent = "Time";
    table.append(pictureName, levelName, timeName);

    data.forEach((el) => {
      let level = document.createElement("p");
      level.textContent = el.level;
      let picture = document.createElement("p");
      picture.textContent = el.nonogram;
      let time = document.createElement("p");
      let timeMinutes = Math.floor(el.time / 60);
      let timeSeconds = el.time - timeMinutes * 60;
      let additionalZeroMin = "";
      let additionalZeroSec = "";
      if (timeMinutes < 10) additionalZeroMin = 0;
      if (timeSeconds < 10) additionalZeroSec = 0;
      time.textContent = `${additionalZeroMin}${timeMinutes}:${additionalZeroSec}${timeSeconds}`;
      table.append(picture, level, time);
    });

    document.querySelector(".modal").append(table);
  }
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

function createButtons(div) {
  let containerButtons = document.createElement("div");
  containerButtons.className = "buttons";

  let resetGame = document.createElement("button");
  resetGame.className = "buttons__button";
  resetGame.textContent = "Reset Game";

  let saveGame = document.createElement("button");
  saveGame.className = "buttons__button";
  saveGame.textContent = "Save Game";

  let proceedGame = document.createElement("button");
  proceedGame.className = "buttons__button";
  proceedGame.textContent = "Continue Last Game";

  let bestResults = document.createElement("button");
  bestResults.className = "buttons__button";
  bestResults.textContent = "Best Results";

  containerButtons.append(resetGame);
  containerButtons.append(saveGame);
  containerButtons.append(proceedGame);
  containerButtons.append(bestResults);
  div.append(containerButtons);
}

export {
  createGameElements,
  createPicturesList,
  changeLevelHandler,
  selectPictureHandler,
  generateModal,
  createCross,
  createButtons,
  generateModalContentMessage,
  generateModalContentTable,
};
