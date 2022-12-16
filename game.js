const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnDown = document.querySelector("#down");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const countLives = document.querySelector("#lives");
const timeRemaining = document.querySelector("#time");
const timeRecord = document.querySelector("#record");
const timeResult = document.querySelector("#result");
const reset_button = document.querySelector('#reset_button');


window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
reset_button.addEventListener('click', resetGame);

let elementsSize;
let canvasSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const arrivalPosition = {
  x: undefined,
  y: undefined,
};

let gameOverPosition = [];

function resetGame() {
  location.reload();
}

function fixNumber(n) {
  return Number(n.toFixed(1));
}

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10.9;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {
  game.font = elementsSize + "px Verdana";
  game.textAlign = "center";

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  function gameWin() {
    timeResult.innerHTML = "You won!";
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem("record_time");
    const playerTime = Date.now() - timeStart;

    if (recordTime) {
      if (recordTime >= playerTime) {
        localStorage.setItem("record_time", playerTime);
        timeResult.innerHTML = "new record!";
      } else {
        timeResult.innerHTML = "no record";
      }
    } else {
      localStorage.setItem("record_time", playerTime);
      timeResult.innerHTML = "first record!";
    }

    console.log(recordTime, playerTime);
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split("\n");
  const mapRCols = mapRows.map((row) => row.trim().split(""));

  showLives();

  gameOverPosition = [];
  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const emoji = emojis[col];
      const positionX = elementsSize * (colIndex + 1);
      const positionY = elementsSize * (rowIndex + 1);

      if (col == "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = positionX;
          playerPosition.y = positionY;
        }
      } else if (col == "I") {
        arrivalPosition.x = positionX;
        arrivalPosition.y = positionY;
      } else if (col == "X") {
        gameOverPosition.push({
          x: positionX,
          y: positionY,
        });
      }

      game.fillText(emoji, positionX, positionY);
    });
  });

  movePlayer();
}

function movePlayer() {
  const arrivalOkX =
    playerPosition.x.toFixed(3) == arrivalPosition.x.toFixed(3);
  const arrivalOkY =
    playerPosition.y.toFixed(3) == arrivalPosition.y.toFixed(3);
  const arrivalOk = arrivalOkX && arrivalOkY;

  if (arrivalOk) {
    levelWin();
  }

  function levelWin() {
    console.log("Nuevo nivel");
    level++;
    startGame();
  }

  const gameOverOk = gameOverPosition.find((e) => {
    const gameOverOkX = e.x.toFixed(3) == playerPosition.x.toFixed(3);
    const gameOverOkY = e.y.toFixed(3) == playerPosition.y.toFixed(3);
    return gameOverOkX && gameOverOkY;
  });

  if (gameOverOk) {
    levelFail();
  }

  function levelFail() {
    if (lives <= 1) {
      level = 0;
      lives = 4;
      timeStart = undefined;
    }

    lives--;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function showLives() {
  const heartsArray = Array(lives).fill(emojis["HEART"]);

  countLives.innerHTML = `${heartsArray.join("")}`;
}

function showTime() {
  timeRemaining.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  timeRecord.innerHTML = localStorage.getItem("record_time");
}

window.addEventListener("keydown", moveByKeys);

btnUp.addEventListener("click", moveUp);
btnDown.addEventListener("click", moveDown);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);

function moveByKeys(param) {
  if (param.key == "ArrowUp") {
    moveUp();
  } else if (param.key == "ArrowDown") {
    moveDown();
  } else if (param.key == "ArrowLeft") {
    moveLeft();
  } else if (param.key == "ArrowRight") {
    moveRight();
  }
}

function moveUp() {
  console.log("UP!");

  if (playerPosition.y - elementsSize < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}

function moveLeft() {
  console.log("LEFT!");

  if (playerPosition.x - elementsSize < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}

function moveDown() {
  console.log("DOWN!");

  if (playerPosition.y + elementsSize > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}

function moveRight() {
  console.log("RIGHT!");

  if (playerPosition.x + elementsSize > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
