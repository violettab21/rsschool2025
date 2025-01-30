import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";

import {
  generateModal,
  generateModalContentMessage,
  generateModalContentTable,
  createCross,
  createPicturesList,
  selectPictureHandler,
} from "./elementsRendering";
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
      if (
        event.target
          .closest(".grid-item__game")
          .classList.contains("grid-item__game_colored")
      )
        audioBlackCell.play();
      else audioWhiteCell.play();
      if (timer.state === "clear") {
        let seconds = getTimerTimeSeconds();
        timer.timerId = startTimer(new Date(), seconds);
        console.log(timer.timerId);
        timer.state = "started";
      }

      if (
        checkSolution(nonograms.find((el) => el.name === getCurrentPicture()))
      ) {
        stopTimer(timer.timerId);
        audioWin.play();
        saveWinResults(nonograms.find((el) => el.name === getCurrentPicture()));
        generateModal();
        generateModalContentMessage(
          `Great! You have solved the nonogram in ${getTimerTimeSeconds()} seconds!`
        );
      }
    }
  });
  document.querySelector(".grid").addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (event.target.closest(".grid-item__game")) {
      if (event.target.closest(".grid-item__game").childElementCount !== 0) {
        event.target.closest(".grid-item__game").innerHTML = "";
        audioCrossOff.play();
      } else {
        createCross(event.target);
        if (timer.state === "clear") {
          let seconds = getTimerTimeSeconds();
          timer.timerId = startTimer(new Date(), seconds);
          console.log(timer.timerId);
          timer.state = "started";
        }
        audioCrossOn.play();
      }
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

function calculateTime(timeClick, currentSeconds) {
  let currentTime = new Date();
  let diff = currentTime - timeClick + currentSeconds * 1000;
  let minutes = Math.floor(diff / 1000 / 60);
  diff = (diff / 1000 / 60 - minutes) * 60;
  let seconds = Math.floor(diff);
  console.log(`${minutes} : ${seconds}`);

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
  console.log(timerId);
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
    }
    if (event.target.textContent === "Save Game") {
      saveGame();
    }
    if (event.target.textContent === "Continue Last Game") {
      timerReset();
      continueLastGame();
    }
    if (event.target.textContent === "Best Results") {
      generateModal();
      let currentTable = localStorage.winResults
        ? JSON.parse(localStorage.winResults)
        : "";
      generateModalContentTable(currentTable);
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
}

function continueLastGame() {
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
  if (document.querySelector(".grid")) document.querySelector(".grid").remove();
  createGrid(savedGame.nonogram);
  fillInGridWithHints(savedGame.nonogram);
  gridHandler();

  let solution = savedGame.solution;
  let gridItems = Array.from(document.querySelectorAll(".grid-item__game"));
  let matrixFromGrid = [];
  for (let i = 0; i < savedGame.nonogram.matrix.length; i += 1) {
    matrixFromGrid.push(
      gridItems.slice(
        i * savedGame.nonogram.matrix.length,
        i * savedGame.nonogram.matrix.length + savedGame.nonogram.matrix.length
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

export {
  gridHandler,
  checkSolution,
  getCurrentPicture,
  startTimer,
  timerReset,
  buttonsHandler,
  saveGame,
};
