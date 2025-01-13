let generatedSequenceGlobal = "";
let currentClickedKeys = [];
let incorrectAttemps = 0;
window.addEventListener("load", (event) => {
  createInitialScreenElements();
  levelSelection();
  startHandler();
});

function createInitialScreenElements() {
  let main = document.createElement("main");
  main.className = "initial-screen";
  let levels = document.createElement("ul");
  levels.className = "levels";
  let easy = document.createElement("li");
  easy.className = "levels__level";
  easy.classList.add("levels__level_selected");
  levels.append(easy);
  easy.textContent = "Easy";
  let medium = document.createElement("li");
  medium.className = "levels__level";
  medium.textContent = "Medium";
  levels.append(medium);
  let hard = document.createElement("li");
  hard.className = "levels__level";
  hard.textContent = "Hard";
  levels.append(hard);
  let button = document.createElement("button");
  button.className = "button";
  button.classList.add("initial-screen__button");
  button.textContent = "Start";
  document.querySelector("body").prepend(main);

  main.append(levels);
  main.append(button);
  addKeyboard(defineCurrentLevel());
}

function levelSelection() {
  document.querySelector(".levels").addEventListener("click", (event) => {
    if (event.target.classList.contains("levels__level")) {
      let level = event.target.innerText;
      addKeyboard(level);
      highlightSelectedLevel(event.target);
    }
  });
}
function highlightSelectedLevel(level) {
  let listOfLevels = document.querySelectorAll(".levels__level");
  listOfLevels.forEach((element) => {
    element.classList.remove("levels__level_selected");
  });
  level.classList.add("levels__level_selected");
}
function defineCurrentLevel() {
  let level = document.querySelector(".levels__level_selected");
  return level.innerText;
}

function addKeyboard(level) {
  let keyboardSection = document.createElement("section");
  keyboardSection.className = "keyboard";
  if (level === "Easy" || level === "Hard") {
    let numbers = document.createElement("ul");
    numbers.className = "keyboard-keys__numbers";
    for (let i = 0; i <= 9; i += 1) {
      let number = document.createElement("li");
      number.className = "key";
      number.textContent = i;
      numbers.append(number);
    }
    keyboardSection.append(numbers);
  }
  if (level === "Medium" || level === "Hard") {
    let letters = document.createElement("ul");
    letters.className = "keyboard-keys__letters";
    for (let i = 65; i <= 90; i += 1) {
      let letter = document.createElement("li");
      letter.className = "key";
      letter.textContent = String.fromCharCode(i).toUpperCase();
      letters.append(letter);
    }
    keyboardSection.append(letters);
  }
  if (document.querySelector(".keyboard"))
    document.querySelector(".keyboard").replaceWith(keyboardSection);
  else document.querySelector(".levels").after(keyboardSection);
}

function startHandler() {
  document.querySelector(".button").addEventListener("click", (event) => {
    document.querySelector(".button").style.display = "none";
    document.querySelector(".levels").style.pointerEvents = "none";

    addGameElements();
    document
      .querySelector(".keyboard")
      .addEventListener("click", keyboardHandler);
    physicalKeyboard();
    buttonsHandler();

    generatedSequenceGlobal = generateRandomSequence(getCurrentRound());
    highlightKeyboardSymbols(generatedSequenceGlobal);
  });
}

function physicalKeyboard() {
  document.addEventListener("keydown", physicalKeyboardHandler);
  document.addEventListener("keyup", (event) => {
    if (currentClickedKeys.length !== 0) currentClickedKeys.length = 0;
  });
}

function addGameElements() {
  let elementsContainer = document.createElement("div");
  elementsContainer.className = "options";
  let roundsContainer = document.createElement("div");
  roundsContainer.className = "rounds";
  let roundsLabel = document.createElement("label");
  roundsLabel.className = "rounds__round-label";
  roundsLabel.textContent = `Round`;
  let roundsInput = document.createElement("input");
  roundsInput.type = "text";
  roundsInput.disabled = "true";
  roundsInput.value = "1";
  roundsLabel.append(roundsInput);
  roundsContainer.append(roundsLabel);
  let buttonsContainer = document.createElement("div");
  buttonsContainer.className = "buttons";
  let repeatSequence = document.createElement("button");
  repeatSequence.textContent = "Repeat The Sequence";
  repeatSequence.className = "buttons__button";
  let next = document.createElement("button");
  next.textContent = "Next";
  next.className = "buttons__button";
  next.classList.add("buttons__button_hidden");
  let newGame = document.createElement("button");
  newGame.textContent = "New Game";
  newGame.className = "buttons__button";
  buttonsContainer.append(repeatSequence, next, newGame);
  elementsContainer.append(roundsContainer, buttonsContainer);
  document.querySelector(".levels").after(elementsContainer);
  let stringInput = document.createElement("input");
  stringInput.disabled = true;
  stringInput.type = "text";
  stringInput.className = "current-sequence";
  document.querySelector(".options").after(stringInput);
}

function generateRandomSequence(round) {
  let randomSequence = "";
  let symbols = getKeybordSymbols();
  let randomSequenceLength = round * 2;
  let randomNumbers = [];
  for (let i = 0; i < randomSequenceLength; i += 1) {
    randomNumbers.push(Math.floor(Math.random() * (symbols.length - 1)));
  }
  randomSequence = randomNumbers.map((el) => symbols[el]).join("");
  return randomSequence;
}

function getKeybordSymbols() {
  let symbols = [];
  document.querySelectorAll(".key").forEach((el) => symbols.push(el.innerText));
  return symbols;
}

function getCurrentRound() {
  let round = document.querySelector(".rounds__round-label input");
  return round.value;
}

function highlightKeyboardSymbols(sequence) {
  let isRepeatClicked;
  if (
    document.querySelector(".buttons__button:first-child").disabled === true
  ) {
    isRepeatClicked = true;
  } else isRepeatClicked = false;
  disableAllControls();
  sequence.split("").forEach((el, i) => {
    document.querySelectorAll(".key").forEach((element) => {
      if (element.innerText === el && i !== sequence.length - 1) {
        setTimeout(highlightOneKey, (i + 1) * 1500, element);
      } else if (element.innerText === el && i == sequence.length - 1) {
        setTimeout(highlightOneKey, (i + 1) * 1500, element);
        setTimeout(enableAllControls, (i + 1) * 1700, isRepeatClicked);
      }
    });
  });
}

function highlightOneKey(key) {
  key.classList.add("key_highlighted");
  setTimeout(removeHighlightFromKey, 1000, key);
}
function removeHighlightFromKey(key) {
  key.classList.remove("key_highlighted");
}

function keyboardHandler() {
  document.querySelector(".keyboard").addEventListener("click", (event) => {
    if (event.target.classList.contains("key")) {
      document.querySelector(".current-sequence").value +=
        event.target.innerText;
      checkInputString(
        document.querySelector(".current-sequence").value,
        generatedSequenceGlobal
      );
    }
  });
}

function keyboardHandler(event) {
  if (event.target.classList.contains("key")) {
    document.querySelector(".current-sequence").value += event.target.innerText;
    checkInputString(
      document.querySelector(".current-sequence").value,
      generatedSequenceGlobal
    );
  }
}

function checkInputString(inputString, generatedSequence) {
  let youWonMessage = "Congratulations! You won the game!";
  let incorrectMessage = "Oops, wrong symbol:(";
  let successMessage = "Correct! Click 'Next' to proceed!";
  let inputStringLength = inputString.length;
  if (inputStringLength === generatedSequence.length) {
    if (inputString.toUpperCase() === generatedSequence.toUpperCase()) {
      if (getCurrentRound() !== "5") {
        showNextButton();
        generateModal(successMessage, "correct");
        disableKeyboardInput();
      } else {
        generateModal(youWonMessage, "win");
        disableKeyboardInput();
        document.querySelector(".buttons__button:first-child").disabled = true;
      }
    } else {
      incorrectAttemps += 1;
      if (incorrectAttemps <= 1) generateModal(incorrectMessage, "incorrect");
      else generateModal(incorrectMessage, "game over");
      disableKeyboardInput();
    }
  } else {
    if (
      inputString.toUpperCase() !==
      generatedSequence.slice(0, inputStringLength).toUpperCase()
    ) {
      incorrectAttemps += 1;
      if (incorrectAttemps <= 1) generateModal(incorrectMessage, "incorrect");
      else generateModal(incorrectMessage, "game over");
      disableKeyboardInput();
    }
  }
}

function showNextButton() {
  document
    .querySelector(".buttons__button:first-child")
    .classList.add("buttons__button_hidden");
  document
    .querySelector(".buttons__button:nth-child(2)")
    .classList.remove("buttons__button_hidden");
}

function buttonsHandler() {
  document.querySelector(".buttons").addEventListener("click", (event) => {
    if (event.target.innerText === "Next") {
      goToNextRound();
    } else if (event.target.innerText === "Repeat The Sequence") {
      event.target.disabled = true;
      repeatSequence();
    } else if (event.target.innerText === "New Game") {
      newGameHandler();
    }
  });
}
function goToNextRound() {
  incorrectAttemps = 0;
  document.querySelector(".rounds__round-label input").value =
    +getCurrentRound() + 1;
  document
    .querySelector(".buttons__button:first-child")
    .classList.remove("buttons__button_hidden");
  document.querySelector(".buttons__button:first-child").disabled = false;
  document
    .querySelector(".buttons__button:nth-child(2)")
    .classList.add("buttons__button_hidden");
  document.querySelector(".current-sequence").value = "";
  generatedSequenceGlobal = generateRandomSequence(getCurrentRound());
  highlightKeyboardSymbols(generatedSequenceGlobal);
}
function generateModal(text, status) {
  let divContainer;
  divContainer = document.createElement("div");
  divContainer.className = "dark-view";
  let divModal;
  divModal = document.createElement("div");
  divModal.className = "modal";
  let spanCross = document.createElement("span");
  spanCross.className = "icon-close";
  let crossImage = document.createElement("img");
  crossImage.src = "../assets/close.svg";
  spanCross.append(crossImage);
  let divModalContent;
  divModalContent = document.createElement("div");
  divModalContent.className = "modal__text-block";
  let modalMessage = document.createElement("p");
  modalMessage.textContent = `${text}`;
  modalMessage.className = "modal__text";
  let modalImage = document.createElement("img");
  modalImage.className = "modal-image";
  if (status === "win") {
    modalImage.src = "../assets/win.png";
  } else if (status === "correct") {
    modalImage.src = "../assets/correct.png";
    modalImage.classList.add("modal-image_correct");
  } else if (status === "incorrect") {
    modalImage.src = "../assets/incorrect.png";
    modalImage.classList.add("modal-image_incorrect");
  } else if (status === "game over") {
    modalImage.src = "../assets/game-over.png";
  }
  divModalContent.append(modalMessage, modalImage);
  divContainer.append(divModal);
  divModal.append(spanCross);
  divModal.append(divModalContent);
  document.querySelector(".initial-screen").append(divContainer);
  closeModal();
}

function closeModal() {
  document.querySelector(".icon-close").addEventListener("click", () => {
    document.querySelector(".dark-view").remove();
  });
}

function physicalKeyboardHandler(event) {
  let possibleSymbols = getKeybordSymbols();
  let isValidSymbol = possibleSymbols.some(
    (el) => el === event.key.toUpperCase()
  );
  if (isValidSymbol) {
    currentClickedKeys.push(event.key);
    if (currentClickedKeys.length <= 1) {
      document.querySelector(".current-sequence").value += event.key;
      document.querySelectorAll(".key").forEach((el) => {
        if (el.innerText.toUpperCase() === event.key.toUpperCase()) {
          highlightOneKey(el);
        }
      });
    }
    checkInputString(
      document.querySelector(".current-sequence").value,
      generatedSequenceGlobal
    );
  }
}

function repeatSequence() {
  highlightKeyboardSymbols(generatedSequenceGlobal);
  document.querySelector(".current-sequence").value = "";
  incorrectAttemps += 1;
}

function disableKeyboardInput() {
  document.removeEventListener("keydown", physicalKeyboardHandler);
  document.querySelector(".keyboard").style.pointerEvents = "none";
}

function enableKeyboardInput() {
  document.addEventListener("keydown", physicalKeyboardHandler);
  document.querySelector(".keyboard").style.pointerEvents = "auto";
}

function disableAllControls() {
  document.removeEventListener("keydown", physicalKeyboardHandler);
  document.querySelector(".keyboard").style.pointerEvents = "none";
  document
    .querySelectorAll(".buttons__button")
    .forEach((el) => (el.disabled = true));
}

function enableAllControls(isRepeatClicked) {
  document.addEventListener("keydown", physicalKeyboardHandler);
  document.querySelector(".keyboard").style.pointerEvents = "auto";

  document.querySelectorAll(".buttons__button").forEach((el) => {
    if (el.innerText === "Repeat The Sequence") el.disabled = isRepeatClicked;
    else el.disabled = false;
  });
}

function newGameHandler() {
  incorrectAttemps = 0;
  document.querySelector(".button").style.display = "block";
  document.querySelector(".levels").style.pointerEvents = "auto";
  document.querySelector(".current-sequence").remove();
  document.querySelector(".options").remove();

  enableKeyboardInput();
}
