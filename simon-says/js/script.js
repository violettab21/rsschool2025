window.addEventListener("load", (event) => {
  createInitialScreenElements();
  levelSelection();
  startHandler();
  console.log(getKeybordSymbols());
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
    let generatedString = generateRandomSequence(getCurrentRound());
    console.log(generatedString);
    highlightKeyboardSymbols(generatedString);
  });
}

function addGameElements() {
  let elementsContainer = document.createElement("div");
  elementsContainer.className = "options";
  let roundsContainer = document.createElement("div");
  roundsContainer.className = "rounds";
  let roundsLabel = document.createElement("label");
  roundsLabel.className = "rounds__round-label";
  roundsLabel.innerHTML = `Round <input type="text" value="3" disabled/>`;
  roundsContainer.append(roundsLabel);
  let buttonsContainer = document.createElement("div");
  let repeatSequence = document.createElement("button");
  repeatSequence.innerHTML = "Repeat The Sequence";
  repeatSequence.className = "button__opt";
  let newGame = document.createElement("button");
  newGame.innerHTML = "New Game";
  newGame.className = "button__opt";
  buttonsContainer.append(repeatSequence, newGame);
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
