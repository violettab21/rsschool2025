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
  });
}
