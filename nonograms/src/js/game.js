import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";
import { generateModal, createCross } from "./elementsRendering";
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
        timer.timerId = startTimer(new Date());
        console.log(timer.timerId);
        timer.state = "started";
      }

      if (
        checkSolution(nonograms.find((el) => el.name === getCurrentPicture()))
      ) {
        console.log(`timer id ${timer}`);
        stopTimer(timer.timerId);
        audioWin.play();
        generateModal(
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

function calculateTime(timeClick) {
  let currentTime = new Date();
  let diff = currentTime - timeClick;
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

function startTimer(timeClicked) {
  let timerId = setInterval(calculateTime, 1000, timeClicked);
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
  });
}

export {
  gridHandler,
  checkSolution,
  getCurrentPicture,
  startTimer,
  timerReset,
  buttonsHandler,
};
