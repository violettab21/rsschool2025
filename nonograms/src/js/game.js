import { nonograms, createGrid, fillInGridWithHints } from "./nonograms";

import {
  generateModal,
  generateModalContentMessage,
  generateModalContentTable,
  createCross,
  createPicturesList,
  selectPictureHandler,
  addDarkSchemeElement,
  addLightSchemeElement,
  createLightSchemeElement,
  addSoundOffElement,
  addSoundOnElement,
} from "./elementsRendering";

import {
  colorbackgroundbodydark,
  colorbackgroundmaindark,
  colorbackgroundhintdark,
  colorbackgroundbuttonsdark,
  colorbackgroundtopdark,
  colorbackgroundselecteddark,
  colorbackgroundrandomdark,
  colorbackgroundmodaldark,
  colortextmaindark,
  colortextbuttonsdark,
  colorborderdark,
  colorcoloredcelldark,
  colorbackgroundbodylight,
  colorbackgroundmainlight,
  colorbackgroundhintlight,
  colorbackgroundbuttonslight,
  colorbackgroundtoplight,
  colorbackgroundselectedlight,
  colorbackgroundrandomlight,
  colorbackgroundmodallight,
  colortextmainlight,
  colortextbuttonslight,
  colorborderlight,
  colorcoloredcelllight,
  colorbackgroundmodaltablelight,
  colorbackgroundmodaltabledark,
  colorbackgroundbtnhoverlight,
  colorbackgroundbtnhoverdark,
  colorbackgroundpicturehoverlight,
  colorbackgroundpicturehoverdark,
} from "../sass/abstracts/colors.scss";

import blackCell from "../assets/pop-1.mp3";
import whiteCell from "../assets/pop-2.mp3";
import win from "../assets/game-bonus.mp3";
import crossOn from "../assets/pop-on-cross.mp3";
import crossOff from "../assets/pop-off-cross.mp3";

const timer = {
  timerId: 0,
  state: "clear",
  defaultValue: "00:00",
};

const audioBlackCell = new Audio(blackCell);
const audioWhiteCell = new Audio(whiteCell);
const audioWin = new Audio(win);
const audioCrossOn = new Audio(crossOn);
const audioCrossOff = new Audio(crossOff);

function gridHandler() {
  document.querySelector(".grid").addEventListener("click", (event) => {
    if (event.target.closest(".grid-item__game")) {
      event.target
        .closest(".grid-item__game")
        .classList.toggle("grid-item__game_colored");

      console.log(event.target.closest(".grid-item__game"));
      let sound = getSoundState();
      if (sound === "on") {
        if (
          event.target
            .closest(".grid-item__game")
            .classList.contains("grid-item__game_colored")
        )
          audioBlackCell.play();
        else audioWhiteCell.play();
      }
      if (event.target.closest(".grid-item__game").childElementCount !== 0) {
        event.target.closest(".grid-item__game").innerHTML = "";
      }
      if (timer.state === "clear") {
        let seconds = getTimerTimeSeconds();
        timer.timerId = startTimer(new Date(), seconds);

        timer.state = "started";
      }

      if (
        checkSolution(nonograms.find((el) => el.name === getCurrentPicture()))
      ) {
        stopTimer(timer.timerId);
        disableSaveGame();
        disableGrid();
        let sound = getSoundState();
        if (sound === "on") audioWin.play();
        saveWinResults(nonograms.find((el) => el.name === getCurrentPicture()));
        generateModal();

        generateModalContentMessage(
          `Great! You have solved the nonogram in ${getTimerTimeSeconds()} seconds!`
        );
        let scheme = getCurrentSchema();
        if (scheme === "light") setLightColorSchemaModal();
        else setDarkColorSchemaModal();
      }
    }
  });
  document.querySelector(".grid").addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (event.target.closest(".grid-item__game")) {
      console.log(event.target.closest(".grid-item__game"));
      if (event.target.closest(".grid-item__game").childElementCount !== 0) {
        event.target.closest(".grid-item__game").innerHTML = "";
        let sound = getSoundState();
        if (sound === "on") {
          audioCrossOff.play();
        }
      } else {
        createCross(event.target);
        console.log(event.target.closest(".grid-item__game"));
        if (
          event.target
            .closest(".grid-item__game")
            .classList.contains("grid-item__game_colored")
        )
          event.target
            .closest(".grid-item__game")
            .classList.remove("grid-item__game_colored");
        if (timer.state === "clear") {
          let seconds = getTimerTimeSeconds();
          timer.timerId = startTimer(new Date(), seconds);

          timer.state = "started";
        }
        let sound = getSoundState();
        if (sound === "on") audioCrossOn.play();
      }
    }
  });
}

function checkSolution(nonogram) {
  let gridItems = Array.from(document.querySelectorAll(".grid-item__game"));
  let matrixFromGrid = [];

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

        return isCorrect;
      }
    }
  }

  return isCorrect;
}

function getCurrentPicture() {
  return document
    .querySelector(".pictures__picture_selected")
    .textContent.toLocaleLowerCase();
}

function calculateTime(timeClick, currentSeconds) {
  let currentTime = new Date();
  let diff = currentTime - timeClick + currentSeconds * 1000;
  let minutes = Math.floor(diff / 1000 / 60);
  diff = (diff / 1000 / 60 - minutes) * 60;
  let seconds = Math.floor(diff);

  let additionalZeroMin = "";
  let additionalZeroSec = "";
  if (minutes < 10) additionalZeroMin = 0;
  if (seconds < 10) additionalZeroSec = 0;
  document.querySelector(
    ".timer"
  ).textContent = `${additionalZeroMin}${minutes}:${additionalZeroSec}${seconds}`;
}

function startTimer(timeClicked, seconds) {
  let timerId = setInterval(calculateTime, 1000, timeClicked, seconds);

  return timerId;
}

function stopTimer(timerId) {
  clearInterval(timerId);
  timer.state = "stopped";
}

function getTimerTimeSeconds() {
  let timerContent = document.querySelector(".timer").textContent;
  let time = timerContent.split(":");
  let minutes = time[0].trim();
  let seconds = time[1].trim();
  return +minutes * 60 + +seconds;
}

function timerReset() {
  if (timer.state === "stopped")
    document.querySelector(".timer").textContent = timer.defaultValue;
  else if (timer.state === "started") {
    stopTimer(timer.timerId);
    document.querySelector(".timer").textContent = timer.defaultValue;
  }
  timer.state = "clear";
}

function resetGame() {
  let currentNonogram = nonograms.find((el) => el.name === getCurrentPicture());
  let gridItems = Array.from(document.querySelectorAll(".grid-item__game"));
  let matrixFromGrid = [];
  for (let i = 0; i < currentNonogram.matrix.length; i += 1) {
    matrixFromGrid.push(
      gridItems.slice(
        i * currentNonogram.matrix.length,
        i * currentNonogram.matrix.length + currentNonogram.matrix.length
      )
    );
  }

  for (let i = 0; i < currentNonogram.matrix.length; i += 1) {
    for (let j = 0; j < currentNonogram.matrix.length; j += 1) {
      matrixFromGrid[i][j].innerHTML = "";
      if (matrixFromGrid[i][j].classList.contains("grid-item__game_colored"))
        matrixFromGrid[i][j].classList.remove("grid-item__game_colored");
    }
  }
  timerReset();
}

function buttonsHandler() {
  document.querySelector(".buttons").addEventListener("click", (event) => {
    if (event.target.textContent === "Reset Game") {
      resetGame();
      enableSaveGame();
      enableGrid();
    }
    if (event.target.textContent === "Save Game") {
      saveGame();
    }
    if (event.target.textContent === "Continue Last Game") {
      timerReset();
      continueLastGame();
      enableSaveGame();
    }
    if (event.target.textContent === "Best Results") {
      generateModal();
      let currentTable = localStorage.winResults
        ? JSON.parse(localStorage.winResults)
        : "";
      generateModalContentTable(currentTable);
      let scheme = getCurrentSchema();
      if (scheme === "light") setLightColorSchemaModal();
      else setDarkColorSchemaModal();
    }
    if (event.target.textContent === "Solution") {
      showSolution();
      disableGrid();
      timerReset();
      disableSaveGame();
    }
  });
}

function getCurrentGameMatrix(nonogram) {
  let gridItems = Array.from(document.querySelectorAll(".grid-item__game"));
  let matrixFromGrid = [];
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
      else if (matrixFromGrid[i][j].childElementCount !== 0)
        matrixFromGrid[i][j] = 2;
      else matrixFromGrid[i][j] = 0;
    }
  }

  return matrixFromGrid;
}

function saveGame() {
  let currentLevel = document.querySelector(".levels__list").value;
  let currentPicture = getCurrentPicture();
  let currentNonogram = nonograms.find((el) => el.name === currentPicture);

  let currentSolution = getCurrentGameMatrix(currentNonogram);

  let currentTime = document.querySelector(".timer").textContent;

  let objectForSaving = {
    level: currentLevel,
    nonogram: currentNonogram,
    solution: currentSolution,
    time: currentTime,
  };
  localStorage.savedGame = JSON.stringify(objectForSaving);
  generateModal();
  generateModalContentMessage(
    `The game is saved. Use Continue Last Game button whenever you would like to proceed.`
  );
}

function continueLastGame() {
  if (localStorage.savedGame) {
    let savedGame = JSON.parse(localStorage.savedGame);
    document.querySelector(".levels__list").value = savedGame.level;

    if (document.querySelector(".pictures")) {
      document.querySelector(".pictures").remove();
      createPicturesList(savedGame.level);
      selectPictureHandler();
      document.querySelectorAll(".pictures__picture").forEach((el) => {
        el.classList.remove("pictures__picture_selected");
        if (el.textContent.toLowerCase() === savedGame.nonogram.name)
          el.classList.add("pictures__picture_selected");
      });
    } else createPicturesList(savedGame.level);
    if (document.querySelector(".grid"))
      document.querySelector(".grid").remove();
    createGrid(savedGame.nonogram);
    fillInGridWithHints(savedGame.nonogram);
    gridHandler();
    let scheme = getCurrentSchema();
    if (scheme === "light") setLightColorSchema();
    else if (scheme === "dark") setDarkColorSchema();

    let solution = savedGame.solution;
    let gridItems = Array.from(document.querySelectorAll(".grid-item__game"));
    let matrixFromGrid = [];
    for (let i = 0; i < savedGame.nonogram.matrix.length; i += 1) {
      matrixFromGrid.push(
        gridItems.slice(
          i * savedGame.nonogram.matrix.length,
          i * savedGame.nonogram.matrix.length +
            savedGame.nonogram.matrix.length
        )
      );
    }

    for (let i = 0; i < savedGame.nonogram.matrix.length; i += 1) {
      for (let j = 0; j < savedGame.nonogram.matrix.length; j += 1) {
        if (solution[i][j] === 1)
          matrixFromGrid[i][j].classList.add("grid-item__game_colored");
        else if (solution[i][j] === 2) createCross(matrixFromGrid[i][j]);
      }
    }
    document.querySelector(".timer").textContent = savedGame.time;
  } else {
    generateModal();
    generateModalContentMessage(`You haven't saved any game yet...`);
  }
}

function saveWinResults(solvedNonogram) {
  let currentLevel = document.querySelector(".levels__list").value;
  let currentPicture = solvedNonogram.name;
  let time = getTimerTimeSeconds();
  let objectForSaving = {
    level: currentLevel,
    nonogram: currentPicture,
    time: time,
  };
  let bestResults = [];

  if (!localStorage.winResults) {
    bestResults.push(objectForSaving);
    localStorage.winResults = JSON.stringify(bestResults);
  } else {
    let currentBestResult = JSON.parse(localStorage.winResults);
    if (currentBestResult.length < 5) {
      currentBestResult.push(objectForSaving);
      bestResults = currentBestResult.sort((a, b) => a.time - b.time);
    } else {
      if (objectForSaving.time < currentBestResult[4].time) {
        currentBestResult[4] = objectForSaving;
        bestResults = currentBestResult.sort((a, b) => a.time - b.time);
      } else bestResults = currentBestResult;
    }
    localStorage.winResults = JSON.stringify(bestResults);
  }
}

function randomGame() {
  let randomNumber = Math.floor(Math.random() * 14);
  let randomNonogram = nonograms[randomNumber];
  let matrixSize = randomNonogram.matrix.length;
  let level;
  switch (matrixSize) {
    case 5:
      level = "easy";
      break;
    case 10:
      level = "medium";
      break;
    case 15:
      level = "hard";
      break;
  }
  document.querySelector(".levels__list").value = level;

  if (document.querySelector(".pictures")) {
    document.querySelector(".pictures").remove();
    createPicturesList(level);
    selectPictureHandler();
    document.querySelectorAll(".pictures__picture").forEach((el) => {
      el.classList.remove("pictures__picture_selected");
      if (el.textContent.toLowerCase() === randomNonogram.name)
        el.classList.add("pictures__picture_selected");
    });
  } else createPicturesList(level);

  if (document.querySelector(".grid")) document.querySelector(".grid").remove();
  createGrid(randomNonogram);
  fillInGridWithHints(randomNonogram);
  gridHandler();
  let scheme = getCurrentSchema();
  if (scheme === "light") setLightColorSchema();
  else if (scheme === "dark") setDarkColorSchema();
}

function randomButtonHandler() {
  document.querySelector(".menu__button").addEventListener("click", () => {
    timerReset();
    enableSaveGame();
    randomGame();
  });
}

function showSolution() {
  let currentPicture = getCurrentPicture();
  let currentNonogram = nonograms.find((el) => el.name === currentPicture);

  //clear current

  let solution = currentNonogram.matrix;
  let gridItems = Array.from(document.querySelectorAll(".grid-item__game"));
  let matrixFromGrid = [];
  for (let i = 0; i < solution.length; i += 1) {
    matrixFromGrid.push(
      gridItems.slice(
        i * solution.length,
        i * solution.length + solution.length
      )
    );
  }

  for (let i = 0; i < solution.length; i += 1) {
    for (let j = 0; j < solution.length; j += 1) {
      if (solution[i][j] === 1) {
        if (!matrixFromGrid[i][j].classList.contains("grid-item__game_colored"))
          matrixFromGrid[i][j].classList.add("grid-item__game_colored");
        matrixFromGrid[i][j].classList.add("grid-item__game_solution");
        matrixFromGrid[i][j].innerHTML = "";
      } else {
        matrixFromGrid[i][j].classList.remove("grid-item__game_colored");
        matrixFromGrid[i][j].innerHTML = "";
      }
    }
  }
}

function disableGrid() {
  document.querySelector(".grid").style.pointerEvents = "none";
}

function enableGrid() {
  document.querySelector(".grid").style.pointerEvents = "auto";
}

function disableSaveGame() {
  document.querySelectorAll(".buttons__button").forEach((btn) => {
    if (btn.textContent === "Save Game") {
      btn.disabled = true;
    }
  });
}

function enableSaveGame() {
  document.querySelectorAll(".buttons__button").forEach((btn) => {
    if (btn.textContent === "Save Game") {
      btn.disabled = false;
    }
  });
}

function setDarkColorSchema() {
  document.querySelector("main").style.backgroundColor =
    colorbackgroundbodydark;
  document.querySelector(".wrapper").style.backgroundColor =
    colorbackgroundmaindark;
  document.querySelectorAll(".pictures__picture").forEach((el) => {
    el.style.backgroundColor = colorbackgroundtopdark;
    el.style.color = colortextbuttonsdark;
  });
  document.querySelector(".pictures__picture_selected").style.backgroundColor =
    colorbackgroundselecteddark;
  document.querySelector(".pictures__picture_selected").style.color =
    colortextmaindark;
  document
    .querySelectorAll(".buttons__button")
    .forEach((el) => (el.style.backgroundColor = colorbackgroundbuttonsdark));
  document.querySelector(".menu__button").style.backgroundColor =
    colorbackgroundrandomdark;
  document.querySelectorAll(".grid-item__hint").forEach((el) => {
    el.style.backgroundColor = colorbackgroundhintdark;
    el.style.color = colortextbuttonsdark;
  });
  document.querySelectorAll(".grid-item__empty").forEach((el) => {
    el.style.backgroundColor = colorbackgroundhintdark;
  });
  document.querySelector(".levels__label").style.color = colortextbuttonsdark;

  document.querySelectorAll(".grid-item__empty").forEach((el) => {
    el.style.backgroundColor = colorbackgroundhintdark;
  });

  document
    .querySelectorAll(
      `.grid-item_border-vertical,
      .grid-item_border-horizontal`
    )
    .forEach((el) => {
      el.style.borderColor = colorborderdark;
    });
  document.querySelector(".grid").style.backgroundColor = colorborderdark;
}

function setLightColorSchema() {
  document.querySelector("main").style.backgroundColor =
    colorbackgroundbodylight;
  document.querySelector(".wrapper").style.backgroundColor =
    colorbackgroundmainlight;
  document.querySelectorAll(".pictures__picture").forEach((el) => {
    el.style.backgroundColor = colorbackgroundtoplight;
    el.style.color = colortextmainlight;
  });
  document.querySelector(".pictures__picture_selected").style.backgroundColor =
    colorbackgroundselectedlight;
  document.querySelector(".pictures__picture_selected").style.color =
    colortextmainlight;
  document
    .querySelectorAll(".buttons__button")
    .forEach((el) => (el.style.backgroundColor = colorbackgroundbuttonslight));
  document.querySelector(".menu__button").style.backgroundColor =
    colorbackgroundrandomlight;
  document.querySelectorAll(".grid-item__hint").forEach((el) => {
    el.style.backgroundColor = colorbackgroundhintlight;
    el.style.color = colortextmainlight;
  });

  document.querySelector(".levels__label").style.color = colortextmainlight;

  document.querySelectorAll(".grid-item__empty").forEach((el) => {
    el.style.backgroundColor = colorbackgroundhintlight;
  });

  document
    .querySelectorAll(
      `.grid-item_border-vertical,
      .grid-item_border-horizontal`
    )
    .forEach((el) => {
      el.style.borderColor = colorborderlight;
    });
  document.querySelector(".grid").style.backgroundColor = colorborderlight;
}

function setLightColorSchemaModal() {
  document.querySelector(".modal").style.backgroundColor =
    colorbackgroundmodallight;
  if (
    document.querySelector(".results__header") &&
    document.querySelector(".results__data")
  ) {
    document
      .querySelectorAll(".results__header")
      .forEach(
        (cell) => (cell.style.backgroundColor = colorbackgroundmodaltablelight)
      );
    document
      .querySelectorAll(".results__data")
      .forEach(
        (cell) => (cell.style.backgroundColor = colorbackgroundmodallight)
      );
  }
}
function setDarkColorSchemaModal() {
  document.querySelector(".modal").style.backgroundColor =
    colorbackgroundmodaldark;
  if (
    document.querySelector(".results__header") &&
    document.querySelector(".results__data")
  ) {
    document
      .querySelectorAll(".results__header")
      .forEach(
        (cell) => (cell.style.backgroundColor = colorbackgroundmodaltabledark)
      );
    document
      .querySelectorAll(".results__data")
      .forEach(
        (cell) => (cell.style.backgroundColor = colorbackgroundmodaldark)
      );
  }
}

function themeHandler() {
  document.querySelector(".theme").addEventListener("click", (event) => {
    if (event.target.closest(".theme_light")) {
      setDarkColorSchema();
      addDarkSchemeElement();
    } else if (event.target.closest(".theme_dark")) {
      setLightColorSchema();
      addLightSchemeElement();
    }
  });
}

function getCurrentSchema() {
  if (document.querySelector(".theme_light")) return "light";
  else if (document.querySelector(".theme_dark")) return "dark";
}

function getSoundState() {
  if (document.querySelector(".sound_on")) return "on";
  else if (document.querySelector(".sound_off")) return "off";
}

function soundHandler() {
  document.querySelector(".sound").addEventListener("click", (event) => {
    if (event.target.closest(".sound_on")) {
      addSoundOffElement();
    } else if (event.target.closest(".sound_off")) {
      addSoundOnElement();
    }
  });
}

export {
  gridHandler,
  checkSolution,
  getCurrentPicture,
  startTimer,
  timerReset,
  buttonsHandler,
  saveGame,
  randomButtonHandler,
  enableSaveGame,
  themeHandler,
  getCurrentSchema,
  setDarkColorSchema,
  setLightColorSchema,
  soundHandler,
  setLightColorSchemaModal,
  setDarkColorSchemaModal,
};
