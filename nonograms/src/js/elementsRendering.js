import {
  nonograms,
  generateHints,
  calculateGridSize,
  createGrid,
  fillInGridWithHints,
} from "./nonograms";
import {
  gridHandler,
  getCurrentPicture,
  timerReset,
  enableSaveGame,
  getCurrentSchema,
  setDarkColorSchema,
  setLightColorSchema,
} from "./game";
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
  let menuButtons = document.createElement("div");
  let randomGame = document.createElement("button");
  randomGame.className = "menu__button";
  randomGame.textContent = "Random Game";
  menuButtons.append(randomGame);
  document.querySelector(".pictures").after(menuButtons);

  createButtons(container);
  createLightSchemeElement();
  createSoundElement();
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
      enableSaveGame();
      let scheme = getCurrentSchema();
      if (scheme === "light") setLightColorSchema();
      else if (scheme === "dark") setDarkColorSchema();
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
      enableSaveGame();
      if (document.querySelector(".grid"))
        document.querySelector(".grid").remove();
      createGrid(selectedNonogram);
      fillInGridWithHints(selectedNonogram);
      gridHandler();
      timerReset();
      let scheme = getCurrentSchema();
      if (scheme === "light") setLightColorSchema();
      else if (scheme === "dark") setDarkColorSchema();
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
    modalMessage.textContent =
      "Currently there is no history of solved nonograms. Try to solve one and TOP 5 results will be shown here. Good Luck!";
    document.querySelector(".modal__text-block").append(modalMessage);
  } else {
    modalMessage.textContent = "TOP 5 Best Results:";
    document.querySelector(".modal__text-block").append(modalMessage);
    let table = document.createElement("div");

    table.className = "results";
    let levelName = document.createElement("p");
    levelName.className = "results__header";
    levelName.textContent = "Level";
    let pictureName = document.createElement("p");
    pictureName.className = "results__header";
    pictureName.textContent = "Picture";
    let timeName = document.createElement("p");
    timeName.className = "results__header";
    timeName.textContent = "Time";
    table.append(pictureName, levelName, timeName);

    data.forEach((el) => {
      let level = document.createElement("p");
      level.className = "results__data";
      level.textContent = el.level;
      let picture = document.createElement("p");
      picture.className = "results__data";
      picture.textContent = el.nonogram;
      let time = document.createElement("p");
      time.className = "results__data";
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

  let solution = document.createElement("button");
  solution.className = "buttons__button";
  solution.textContent = "Solution";

  containerButtons.append(solution);
  containerButtons.append(resetGame);
  containerButtons.append(saveGame);
  containerButtons.append(proceedGame);
  containerButtons.append(bestResults);

  div.append(containerButtons);
}

function createLightSchemeElement() {
  let span = document.createElement("span");
  span.className = "theme";
  span.classList.add("theme_light");
  span.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
  <g id="Lager_93" data-name="Lager 93" transform="translate(2 2)">
    <g id="Sun_3_Brightness_3" data-name="Sun 3, Brightness 3">
      <path id="Path_68" data-name="Path 68" d="M32,14H27.033c-2,1.769-.779,4,.967,4h4.967C34.966,16.231,33.746,14,32,14Z" fill="#84A59D"/>
      <g id="Path_69" data-name="Path 69" fill="none" stroke-miterlimit="10">
        <path d="M17.172,10.111a6,6,0,1,0,4.715,4.715A6.01,6.01,0,0,0,17.172,10.111Z" stroke="none"/>
        <path d="M 15.99852275848389 13.99979972839355 C 15.40029907226563 13.99979972839355 14.83786392211914 14.26465797424316 14.45541763305664 14.72645950317383 C 14.18128776550293 15.05748176574707 13.88667678833008 15.62165832519531 14.04035758972168 16.43178939819336 C 14.1787109375 17.16349411010742 14.83581733703613 17.82003402709961 15.56771087646484 17.958740234375 C 15.71307563781738 17.98624801635742 15.85765266418457 18.00020027160645 15.99740505218506 18.00020027160645 C 16.59555816650391 18.00020027160645 17.15798187255859 17.73542404174805 17.54046440124512 17.27376556396484 C 17.81481742858887 16.94261169433594 18.1097583770752 16.37818908691406 17.95689964294434 15.57052993774414 C 17.81802749633789 14.83748245239258 17.1605224609375 14.17996406555176 16.42829895019531 14.041259765625 C 16.28293609619141 14.01375389099121 16.13835906982422 13.99979972839355 15.99860572814941 13.99979972839355 L 15.99852275848389 13.99979972839355 M 15.99860000610352 9.999795913696289 C 16.38235282897949 9.999801635742188 16.77459716796875 10.03580474853516 17.17200469970703 10.11100006103516 C 19.52100563049316 10.55599975585938 21.44199371337891 12.47699928283691 21.88699340820313 14.82600021362305 C 22.61180877685547 18.65568542480469 19.69624137878418 22.00020408630371 15.99740028381348 22.00020408630371 C 15.61366271972656 22.00020408630371 15.22141265869141 21.96419525146484 14.82400512695313 21.88899993896484 C 12.47600555419922 21.44400024414063 10.55400466918945 19.52299880981445 10.11000442504883 17.17499923706055 C 9.383377075195313 13.34440803527832 12.29961967468262 9.999755859375 15.99860000610352 9.999795913696289 Z" stroke="none" fill="#84A59D"/>
      </g>
      <rect id="Rectangle_26" data-name="Rectangle 26" width="8" height="4" rx="1.993" transform="translate(26 14)" fill="#84A59D"/>
      <rect id="Rectangle_27" data-name="Rectangle 27" width="8" height="4" rx="1.993" transform="translate(18 26) rotate(90)" fill="#84A59D"/>
      <rect id="Rectangle_28" data-name="Rectangle 28" width="8" height="4" rx="1.993" transform="translate(18 -2) rotate(90)" fill="#84A59D"/>
      <rect id="Rectangle_29" data-name="Rectangle 29" width="8" height="4" rx="1.993" transform="translate(-2 14)" fill="#84A59D"/>
      <g id="Group_22" data-name="Group 22">
        <rect id="Rectangle_30" data-name="Rectangle 30" width="6.925" height="3.766" rx="1.883" transform="translate(23.22 6.117) rotate(-45)" fill="#84A59D"/>
      </g>
      <g id="Group_23" data-name="Group 23">
        <rect id="Rectangle_31" data-name="Rectangle 31" width="3.766" height="6.925" rx="1.883" transform="matrix(0.707, -0.707, 0.707, 0.707, 23.22, 25.883)" fill="#84A59D"/>
      </g>
      <g id="Group_24" data-name="Group 24">
        <rect id="Rectangle_32" data-name="Rectangle 32" width="3.766" height="6.925" rx="1.883" transform="translate(1.22 3.883) rotate(-45)" fill="#84A59D"/>
      </g>
      <g id="Group_25" data-name="Group 25">
        <rect id="Rectangle_33" data-name="Rectangle 33" width="6.925" height="3.766" rx="1.883" transform="translate(1.22 28.117) rotate(-45)" fill="#84A59D"/>
      </g>
    </g>
  </g>
</svg>`;

  document.querySelector(".wrapper").append(span);
}

function addLightSchemeElement() {
  document.querySelector(
    ".theme"
  ).innerHTML = `<svg width="30px" height="30px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
  <g id="Lager_93" data-name="Lager 93" transform="translate(2 2)">
    <g id="Sun_3_Brightness_3" data-name="Sun 3, Brightness 3">
      <path id="Path_68" data-name="Path 68" d="M32,14H27.033c-2,1.769-.779,4,.967,4h4.967C34.966,16.231,33.746,14,32,14Z" fill="#84A59D"/>
      <g id="Path_69" data-name="Path 69" fill="none" stroke-miterlimit="10">
        <path d="M17.172,10.111a6,6,0,1,0,4.715,4.715A6.01,6.01,0,0,0,17.172,10.111Z" stroke="none"/>
        <path d="M 15.99852275848389 13.99979972839355 C 15.40029907226563 13.99979972839355 14.83786392211914 14.26465797424316 14.45541763305664 14.72645950317383 C 14.18128776550293 15.05748176574707 13.88667678833008 15.62165832519531 14.04035758972168 16.43178939819336 C 14.1787109375 17.16349411010742 14.83581733703613 17.82003402709961 15.56771087646484 17.958740234375 C 15.71307563781738 17.98624801635742 15.85765266418457 18.00020027160645 15.99740505218506 18.00020027160645 C 16.59555816650391 18.00020027160645 17.15798187255859 17.73542404174805 17.54046440124512 17.27376556396484 C 17.81481742858887 16.94261169433594 18.1097583770752 16.37818908691406 17.95689964294434 15.57052993774414 C 17.81802749633789 14.83748245239258 17.1605224609375 14.17996406555176 16.42829895019531 14.041259765625 C 16.28293609619141 14.01375389099121 16.13835906982422 13.99979972839355 15.99860572814941 13.99979972839355 L 15.99852275848389 13.99979972839355 M 15.99860000610352 9.999795913696289 C 16.38235282897949 9.999801635742188 16.77459716796875 10.03580474853516 17.17200469970703 10.11100006103516 C 19.52100563049316 10.55599975585938 21.44199371337891 12.47699928283691 21.88699340820313 14.82600021362305 C 22.61180877685547 18.65568542480469 19.69624137878418 22.00020408630371 15.99740028381348 22.00020408630371 C 15.61366271972656 22.00020408630371 15.22141265869141 21.96419525146484 14.82400512695313 21.88899993896484 C 12.47600555419922 21.44400024414063 10.55400466918945 19.52299880981445 10.11000442504883 17.17499923706055 C 9.383377075195313 13.34440803527832 12.29961967468262 9.999755859375 15.99860000610352 9.999795913696289 Z" stroke="none" fill="#84A59D"/>
      </g>
      <rect id="Rectangle_26" data-name="Rectangle 26" width="8" height="4" rx="1.993" transform="translate(26 14)" fill="#84A59D"/>
      <rect id="Rectangle_27" data-name="Rectangle 27" width="8" height="4" rx="1.993" transform="translate(18 26) rotate(90)" fill="#84A59D"/>
      <rect id="Rectangle_28" data-name="Rectangle 28" width="8" height="4" rx="1.993" transform="translate(18 -2) rotate(90)" fill="#84A59D"/>
      <rect id="Rectangle_29" data-name="Rectangle 29" width="8" height="4" rx="1.993" transform="translate(-2 14)" fill="#84A59D"/>
      <g id="Group_22" data-name="Group 22">
        <rect id="Rectangle_30" data-name="Rectangle 30" width="6.925" height="3.766" rx="1.883" transform="translate(23.22 6.117) rotate(-45)" fill="#84A59D"/>
      </g>
      <g id="Group_23" data-name="Group 23">
        <rect id="Rectangle_31" data-name="Rectangle 31" width="3.766" height="6.925" rx="1.883" transform="matrix(0.707, -0.707, 0.707, 0.707, 23.22, 25.883)" fill="#84A59D"/>
      </g>
      <g id="Group_24" data-name="Group 24">
        <rect id="Rectangle_32" data-name="Rectangle 32" width="3.766" height="6.925" rx="1.883" transform="translate(1.22 3.883) rotate(-45)" fill="#84A59D"/>
      </g>
      <g id="Group_25" data-name="Group 25">
        <rect id="Rectangle_33" data-name="Rectangle 33" width="6.925" height="3.766" rx="1.883" transform="translate(1.22 28.117) rotate(-45)" fill="#84A59D"/>
      </g>
    </g>
  </g>
</svg>`;
  document.querySelector(".theme").classList.remove("theme_dark");
  document.querySelector(".theme").classList.add("theme_light");
}

function addDarkSchemeElement() {
  document.querySelector(
    ".theme"
  ).innerHTML = `<svg width="30px" height="30px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g id="Lager_94" data-name="Lager 94" transform="translate(0)">
    <path id="Path_70" data-name="Path 70" d="M12.516,4.509A12,12,0,0,0,22.3,19.881,12.317,12.317,0,0,0,24,20a11.984,11.984,0,0,0,3.49-.514,12.1,12.1,0,0,1-9.963,8.421A12.679,12.679,0,0,1,16,28,12,12,0,0,1,12.516,4.509M16,0a16.5,16.5,0,0,0-2.212.15A16,16,0,0,0,16,32a16.526,16.526,0,0,0,2.01-.123A16.04,16.04,0,0,0,31.85,18.212,16.516,16.516,0,0,0,32,15.944,1.957,1.957,0,0,0,30,14a2.046,2.046,0,0,0-1.23.413A7.942,7.942,0,0,1,24,16a8.35,8.35,0,0,1-1.15-.08,7.995,7.995,0,0,1-5.264-12.7A2.064,2.064,0,0,0,16.056,0Z" fill="#84A59D"/>
  </g>
</svg>`;
  document.querySelector(".theme").classList.remove("theme_light");
  document.querySelector(".theme").classList.add("theme_dark");
}

function createSoundElement() {
  let span = document.createElement("span");
  span.className = "sound";
  span.classList.add("sound_on");
  span.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="icon" fill="#84A59D" transform="translate(42.666667, 85.333333)">
            <path d="M361.299413,341.610667 L328.014293,314.98176 C402.206933,233.906133 402.206933,109.96608 328.013013,28.8906667 L361.298133,2.26304 C447.910187,98.97536 447.908907,244.898347 361.299413,341.610667 Z M276.912853,69.77216 L243.588693,96.4309333 C283.38432,138.998613 283.38304,204.87488 243.589973,247.44256 L276.914133,274.101333 C329.118507,215.880107 329.118507,127.992107 276.912853,69.77216 Z M191.749973,1.42108547e-14 L80.8957867,87.2292267 L7.10542736e-15,87.2292267 L7.10542736e-15,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,1.42108547e-14 L191.749973,1.42108547e-14 Z" id="Shape">

</path>
        </g>
    </g>
</svg>`;

  document.querySelector(".wrapper").append(span);
}

function addSoundOffElement() {
  document.querySelector(
    ".sound"
  ).innerHTML = `<svg width="30px" height="30px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="icon" fill="#84A59D" transform="translate(42.666667, 59.581722)">
            <path d="M47.0849493,-1.42108547e-14 L298.668,251.583611 L304.101001,257.015597 L304.101,257.016 L353.573532,306.488791 C353.573732,306.488458 353.573933,306.488124 353.574133,306.48779 L384.435257,337.348961 L384.434,337.349 L409.751616,362.666662 L379.581717,392.836561 L191.749,205.003 L191.749973,369.105851 L81.0208,283.647505 L7.10542736e-15,283.647505 L7.10542736e-15,112.980838 L80.8957867,112.980838 L91.433,104.688 L16.9150553,30.169894 L47.0849493,-1.42108547e-14 Z M361.298133,28.0146513 C429.037729,103.653701 443.797162,209.394226 405.578884,298.151284 L372.628394,265.201173 C396.498256,194.197542 381.626623,113.228555 328.013013,54.642278 L361.298133,28.0146513 Z M276.912853,95.5237713 C305.539387,127.448193 318.4688,168.293162 315.701304,208.275874 L266.464558,159.040303 C261.641821,146.125608 254.316511,133.919279 244.488548,123.156461 L243.588693,122.182545 L276.912853,95.5237713 Z M191.749973,25.7516113 L191.749,84.3256113 L158.969,51.5456113 L191.749973,25.7516113 Z" id="Combined-Shape">

</path>
        </g>
    </g>
</svg>`;
  document.querySelector(".sound").classList.remove("sound_on");
  document.querySelector(".sound").classList.add("sound_off");
}

function addSoundOnElement() {
  document.querySelector(
    ".sound"
  ).innerHTML = `<svg width="30px" height="30px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="icon" fill="#84A59D" transform="translate(42.666667, 85.333333)">
            <path d="M361.299413,341.610667 L328.014293,314.98176 C402.206933,233.906133 402.206933,109.96608 328.013013,28.8906667 L361.298133,2.26304 C447.910187,98.97536 447.908907,244.898347 361.299413,341.610667 Z M276.912853,69.77216 L243.588693,96.4309333 C283.38432,138.998613 283.38304,204.87488 243.589973,247.44256 L276.914133,274.101333 C329.118507,215.880107 329.118507,127.992107 276.912853,69.77216 Z M191.749973,1.42108547e-14 L80.8957867,87.2292267 L7.10542736e-15,87.2292267 L7.10542736e-15,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,1.42108547e-14 L191.749973,1.42108547e-14 Z" id="Shape">

</path>
        </g>
    </g>
</svg>`;
  document.querySelector(".sound").classList.remove("sound_off");
  document.querySelector(".sound").classList.add("sound_on");
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
  createLightSchemeElement,
  addDarkSchemeElement,
  addLightSchemeElement,
  addSoundOffElement,
  addSoundOnElement,
};
