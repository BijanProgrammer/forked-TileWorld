const BOARD_SIZE_PX = 770;
let BOARD_SIZE_CELL = 0;

function readyGame() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  const form = document.forms[0];
  BOARD_SIZE_CELL = Number(form[0].value);
  const ballsCount = Number(form[1].value);

  const balls = [];
  const holes = [];
  const randomNumbers = generateRandomNumbers(
    2 * ballsCount,
    1,
    BOARD_SIZE_CELL * BOARD_SIZE_CELL
  );
  for (let i = 0; i < ballsCount; i++) {
    balls[i] = new Ball(randomNumbers[i]);
    board.appendChild(balls[i].getElement());
  }
  for (let i = 0; i < ballsCount; i++) {
    holes[i] = new Hole(randomNumbers[i + ballsCount]);
    board.appendChild(holes[i ].getElement());
  }

  for (let i = 0; i < BOARD_SIZE_CELL; i++) {
    for (let j = 0; j < BOARD_SIZE_CELL; j++) {
      const child = document.createElement("div");
      child.style.width = BOARD_SIZE_PX / BOARD_SIZE_CELL + "px";
      child.style.height = BOARD_SIZE_PX / BOARD_SIZE_CELL + "px";
      board.appendChild(child);
    }
  }
}

class Ball {
  SIZE_RATIO = 4;

  constructor(cellNumber) {
    this.cellNumber = cellNumber;
    this.row = Math.floor(cellNumber / BOARD_SIZE_CELL) + 1;
    this.column = cellNumber - (this.row - 1) * BOARD_SIZE_CELL;

    if (this.column === 0) {
      this.row = this.row - 1;
      this.column = BOARD_SIZE_CELL;
    }
  }

  get rowCol() {
    return [this.row, this.column];
  }

  getElement() {
    const element = document.createElement("div");
    const cellSize = BOARD_SIZE_PX / BOARD_SIZE_CELL;

    element.style.position = "absolute";
    element.style.width = cellSize / this.SIZE_RATIO + "px";
    element.style.height = cellSize / this.SIZE_RATIO + "px";
    element.style.borderRadius = "999px";
    element.style.top =
      this.row * cellSize -
      (cellSize / 2 + cellSize / (this.SIZE_RATIO * 2)) +
      "px";
    element.style.left =
      this.column * cellSize -
      (cellSize / 2 + cellSize / (this.SIZE_RATIO * 2)) +
      "px";
    element.style.backgroundColor = "#4caf50";

    return element;
  }
}

class Hole {
  SIZE_RATIO = 1.5;

  constructor(cellNumber) {
    this.cellNumber = cellNumber;
    this.row = Math.floor(cellNumber / BOARD_SIZE_CELL) + 1;
    this.column = cellNumber - (this.row - 1) * BOARD_SIZE_CELL;

    if (this.column === 0) {
      this.row = this.row - 1;
      this.column = BOARD_SIZE_CELL;
    }
  }

  get rowCol() {
    return [this.row, this.column];
  }

  getElement() {
    const element = document.createElement("div");
    const cellSize = BOARD_SIZE_PX / BOARD_SIZE_CELL;

    element.style.position = "absolute";
    element.style.width = cellSize / this.SIZE_RATIO + "px";
    element.style.height = cellSize / this.SIZE_RATIO + "px";
    element.style.borderRadius = "4px";
    element.style.top =
      this.row * cellSize -
      (cellSize / 2 + cellSize / (this.SIZE_RATIO * 2)) +
      "px";
    element.style.left =
      this.column * cellSize -
      (cellSize / 2 + cellSize / (this.SIZE_RATIO * 2)) +
      "px";
    element.style.border = "2px solid red";

    return element;
  }
}

class Agent {}

function generateRandomNumbers(numberCount, min, max) {
  const numbers = new Set();

  while (numbers.size < numberCount) {
    const randomNumber = Math.floor(Math.random() * (max - min)) + min;
    numbers.add(randomNumber);
  }

  return [...numbers];
}
