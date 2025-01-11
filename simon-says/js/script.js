let generatedSequenceGlobal = "";
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
  easy.innerHTML = "Easy";
  let medium = document.createElement("li");
  medium.className = "levels__level";
  medium.innerHTML = "Medium";
  levels.append(medium);
  let hard = document.createElement("li");
  hard.className = "levels__level";
  hard.innerHTML = "Hard";
  levels.append(hard);
  let button = document.createElement("button");
  button.className = "button";
  button.classList.add("initial-screen__button");
  button.innerHTML = "Start";
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
      number.innerHTML = i;
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
      letter.innerHTML = String.fromCharCode(i).toUpperCase();
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
    generatedSequenceGlobal = generateRandomSequence(getCurrentRound());
    console.log(generatedSequenceGlobal);
    highlightKeyboardSymbols(generatedSequenceGlobal);
    keyboardHandler();
    physicalKeyboardHandler();
    nextRoundHandler();
  });
}

function addGameElements() {
  let elementsContainer = document.createElement("div");
  elementsContainer.className = "options";
  let roundsContainer = document.createElement("div");
  roundsContainer.className = "rounds";
  let roundsLabel = document.createElement("label");
  roundsLabel.className = "rounds__round-label";
  roundsLabel.innerHTML = `Round <input type="text" value="1" disabled/>`;
  roundsContainer.append(roundsLabel);
  let buttonsContainer = document.createElement("div");
  buttonsContainer.className = "buttons";
  let repeatSequence = document.createElement("button");
  repeatSequence.innerHTML = "Repeat The Sequence";
  repeatSequence.className = "buttons__button";
  let next = document.createElement("button");
  next.innerHTML = "Next";
  next.className = "buttons__button";
  next.classList.add("buttons__button_hidden");
  let newGame = document.createElement("button");
  newGame.innerHTML = "New Game";
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
  sequence.split("").forEach((el, i) => {
    document.querySelectorAll(".key").forEach((element) => {
      if (element.innerText === el) {
        setTimeout(highlightOneKey, (i + 1) * 2000, element);
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

function checkInputString(inputString, generatedSequence) {
  let inputStringLength = inputString.length;
  if (inputStringLength === generatedSequence.length) {
    if (inputString.toUpperCase() === generatedSequence.toUpperCase()) {
      if (getCurrentRound() !== "5") {
        showNextButton();
        generateModal("Correct, click Next to proceed!");
      } else generateModal("You won!");
    } else generateModal("OOps, wrong symbol, try again!");
  } else {
    if (
      inputString.toUpperCase() ===
      generatedSequence.slice(0, inputStringLength).toUpperCase()
    ) {
      console.log("Correct! Type next");
    } else generateModal("OOps, wrong symbol, try again!");
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

function nextRoundHandler() {
  document.querySelector(".buttons").addEventListener("click", (event) => {
    if (event.target.innerText === "Next") {
      document.querySelector(".rounds__round-label input").value =
        +getCurrentRound() + 1;
      document
        .querySelector(".buttons__button:first-child")
        .classList.remove("buttons__button_hidden");
      document
        .querySelector(".buttons__button:nth-child(2)")
        .classList.add("buttons__button_hidden");
      document.querySelector(".current-sequence").value = "";
      generatedSequenceGlobal = generateRandomSequence(getCurrentRound());
      console.log(generatedSequenceGlobal);
      highlightKeyboardSymbols(generatedSequenceGlobal);
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
  spanCross.innerHTML = `<img src="../assets/close.svg" alt="">`;
  let divModalText;
  divModalText = document.createElement("div");
  divModalText.className = "modal__text-block";
  divModalText.innerHTML = `
      <p class="modal__text">${text}</p>`;
  divContainer.append(divModal);
  divModal.append(spanCross);
  divModal.append(divModalText);
  document.querySelector(".initial-screen").append(divContainer);
  closeModal();
}

function closeModal() {
  document.querySelector(".icon-close").addEventListener("click", () => {
    document.querySelector(".dark-view").remove();
  });
}

function physicalKeyboardHandler() {
  document.addEventListener("keydown", (event) => {
    let possibleSymbols = getKeybordSymbols();
    let isValidSymbol = possibleSymbols.some(
      (el) => el === event.key.toUpperCase()
    );
    if (isValidSymbol) {
      document.querySelectorAll(".key").forEach((el) => {
        if (el.innerText.toUpperCase() === event.key.toUpperCase()) {
          highlightOneKey(el);
        }
      });
      document.querySelector(".current-sequence").value += event.key;
      checkInputString(
        document.querySelector(".current-sequence").value,
        generatedSequenceGlobal
      );
    }
  });
}
