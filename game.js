const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnDown = document.querySelector("#down");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

let elementsSize;
let canvasSize;

const playerPosition = {
  x: undefined,
  y: undefined,
};

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10.9;

  startGame();
}

function startGame() {
  game.font = elementsSize + "px Verdana";
  game.textAlign = "center";

  const map = maps[0];
  const mapRows = map.trim().split("\n");
  const mapRCols = mapRows.map((row) => row.trim().split(""));

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
          console.log(playerPosition);
        }
      }

      game.fillText(emoji, positionX, positionY);
    });
  });

  movePlayer();
}

function movePlayer() {
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
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

  if ((playerPosition.y - elementsSize) < 0) {
    console.log("OUT");
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}

function moveDown() {
  console.log("DOWN!");

  if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}

function moveLeft() {
  console.log("LEFT!");

  if ((playerPosition.x - elementsSize) < canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}

function moveRight() {
  console.log("RIGHT!");

  if ((playerPosition.x + elementsSize) > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }

}
