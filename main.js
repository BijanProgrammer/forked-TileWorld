const BOARD_SIZE_PX = 773;
let BOARD_SIZE_CELL = 0;

let AGENT = "";
let BALLS = "";
let HOLES = "";

let LOG = "";

const DISISIONS = {
  pickUp: "pickup",
  putDown: "putDown",
  right: "right",
  left: "left",
  top: "top",
  down: "down",
};

let agentTimeOut = undefined;

function readyGame() {
  const board = document.getElementById("board");
  document.getElementsByTagName("button")[2].disabled = true;
  document.getElementsByTagName("button")[1].disabled = false;
  board.innerHTML = "";
  LOG = "";
  clearTimeout(agentTimeOut);

  const form = document.forms[0];
  const startFule = Number(form[0].value);
  BOARD_SIZE_CELL = Number(form[1].value);
  const ballsCount = Number(form[2].value);

  if (ballsCount * 2 + 1 > BOARD_SIZE_CELL * BOARD_SIZE_CELL) {
    alert(
      `it is impossible to generate ${ballsCount} balls and ${ballsCount} holes and 1 agent in ${
        BOARD_SIZE_CELL * BOARD_SIZE_CELL
      } cell`
    );
    document.getElementsByTagName("button")[1].disabled = true;
    return;
  }

  const balls = [];
  const holes = [];

  const randomNumbers = generateRandomNumbers(
    2 * ballsCount + 1,
    1,
    BOARD_SIZE_CELL * BOARD_SIZE_CELL
  );

  const agent = new Agent(randomNumbers[randomNumbers.length - 1], startFule);
  board.appendChild(agent.generateElement());

  for (let i = 0; i < ballsCount; i++) {
    balls[i] = new Ball(randomNumbers[i]);
    board.appendChild(balls[i].generateElement());
  }
  for (let i = 0; i < ballsCount; i++) {
    holes[i] = new Hole(randomNumbers[i + ballsCount]);
    board.appendChild(holes[i].generateElement());
  }

  for (let i = 0; i < BOARD_SIZE_CELL; i++) {
    for (let j = 0; j < BOARD_SIZE_CELL; j++) {
      const child = document.createElement("div");
      child.style.width = BOARD_SIZE_PX / BOARD_SIZE_CELL + "px";
      child.style.height = BOARD_SIZE_PX / BOARD_SIZE_CELL + "px";
      board.appendChild(child);
    }
  }

  AGENT = agent;
  BALLS = balls;
  HOLES = holes;
}
function runGame() {
  AGENT.start();
}
class Element {
  SIZE_RATIO = 1;
  row = 0;
  column = 0;
  currentElement = null;

  constructor(cellNumber) {
    this.row = Math.floor(cellNumber / BOARD_SIZE_CELL);
    this.column = cellNumber - this.row * BOARD_SIZE_CELL - 1;

    if (this.column === -1) {
      this.row = this.row - 1;
      this.column = BOARD_SIZE_CELL - 1;
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
    element.style.top =
      (this.row + 1) * cellSize -
      (cellSize / 2 + cellSize / (this.SIZE_RATIO * 2)) +
      "px";
    element.style.left =
      (this.column + 1) * cellSize -
      (cellSize / 2 + cellSize / (this.SIZE_RATIO * 2)) +
      "px";

    this.currentElement = element;

    return element;
  }
}
class Ball extends Element {
  isArrived = false;

  constructor(cellNumber) {
    super(cellNumber);
    this.SIZE_RATIO = 4;
  }

  move(direction) {
    const cellSize = BOARD_SIZE_PX / BOARD_SIZE_CELL;
    const postionFromTop = Number(this.currentElement.style.top.slice(0, -2));
    const postionFromLeft = Number(this.currentElement.style.left.slice(0, -2));
    if (direction === DISISIONS.top) {
      this.currentElement.style.top = postionFromTop - cellSize + "px";
      this.row = this.row - 1;
    }
    if (direction === DISISIONS.right) {
      this.currentElement.style.left = postionFromLeft + cellSize + "px";
      this.column = this.column + 1;
    }
    if (direction === DISISIONS.left) {
      this.currentElement.style.left = postionFromLeft - cellSize + "px";
      this.column = this.column - 1;
    }
    if (direction === DISISIONS.down) {
      this.currentElement.style.top = postionFromTop + cellSize + "px";
      this.row = this.row + 1;
    }
  }

  randomMove() {
    if (this.isArrived) return;

    const isMove = Math.random() <= 0.1;

    if (!isMove) return;

    let directions = [
      [this.row + 1, this.column],
      [this.row, this.column + 1],
      [this.row - 1, this.column],
      [this.row, this.column - 1],
    ].filter(
      (item) =>
        item[0] >= 0 &&
        item[0] < BOARD_SIZE_CELL &&
        item[1] >= 0 &&
        item[1] < BOARD_SIZE_CELL
    );

    const closeBallsLocations = BALLS.filter((item) => {
      const location = item.rowCol;
      return (
        Math.abs(location[0] - this.row) +
          Math.abs(location[1] - this.column) ===
        1 && !this.isArrived
      );
    }).map((ball) => ball.rowCol);
    if (closeBallsLocations.length !== 0) {
      directions = directions.filter((direct) => {
        for (let index = 0; index < closeBallsLocations.length; index++) {
          const location = closeBallsLocations[index];
          if (location[0] === direct[0] && location[1] === direct[1])
            return false;
        }
        return true;
      });

      if (directions.length === 0) return;
    }

    let randomLocation =
      directions[Math.floor(Math.random() * directions.length)];

    if (randomLocation[0] < this.row) {
      this.move(DISISIONS.top);
    } else if (randomLocation[0] > this.row) {
      this.move(DISISIONS.down);
    } else if (randomLocation[1] > this.column) {
      this.move(DISISIONS.right);
    } else {
      this.move(DISISIONS.left);
    }

    const holes = HOLES.filter(
      (hole) =>
        hole.rowCol[0] === this.row &&
        hole.rowCol[1] === this.column &&
        !hole.isFill
    );
    if (holes.length !== 0) {
      holes[0].isFill = true;
      this.isArrived = true;
      holes[0].currentElement.style.borderColor = "#4caf50";
    }
  }

  generateElement() {
    const element = this.getElement();

    element.style.borderRadius = "999px";
    element.style.backgroundColor = "#4caf50";
    element.style.transition = "all 500ms linear";

    return element;
  }
}
class Hole extends Element {
  isFill = false;

  constructor(cellNumber) {
    super(cellNumber);
    this.SIZE_RATIO = 1.5;
  }

  generateElement() {
    const element = this.getElement();

    element.style.borderRadius = "4px";
    element.style.border = "2px solid red";

    return element;
  }
}
class Agent extends Element {
  direction = DISISIONS.top;
  fule = 30;
  pickedElement = null;
  currentLocation = [-1, -1];

  freeBallsLocationMemory = [];
  freeHolesLocationMemmory = [];

  constructor(cellNumber, fule) {
    super(cellNumber);
    this.SIZE_RATIO = 1.5;
    this.fule = fule;
    document.getElementById("fule").innerText = this.fule;
  }

  searchAround() {
    const closeBalls = BALLS.filter((item) => {
      const location = item.rowCol;

      return (
        location[0] <= this.row + 1 &&
        location[0] >= this.row - 1 &&
        location[1] <= this.column + 1 &&
        location[1] >= this.column - 1 &&
        !item.isArrived
      );
    });

    const closeHolls = HOLES.filter((item) => {
      const location = item.rowCol;

      return (
        location[0] <= this.row + 1 &&
        location[0] >= this.row - 1 &&
        location[1] <= this.column + 1 &&
        location[1] >= this.column - 1 &&
        !item.isFill
      );
    });

    return { closeBalls: closeBalls, closeHolls: closeHolls };
  }

  updateMemory(closeBalls, closeHolls) {
    const closeBallsLocations = closeBalls.map((item) => item.rowCol.join(","));
    const closeHolesLocations = closeHolls.map((item) => item.rowCol.join(","));

    const closeEmptyLocations = [];
    for (let i = this.row - 1; i <= this.row + 1; i++) {
      if (i > BOARD_SIZE_CELL || i < 0) continue;

      for (let j = this.column - 1; j <= this.column + 1; j++) {
        if (j > BOARD_SIZE_CELL || j < 0) continue;

        const location = i + "," + j;
        if (
          !closeBallsLocations.includes(location) &&
          !closeHolesLocations.includes(location)
        ) {
          closeEmptyLocations.push(location);
        }
      }
    }

    this.freeBallsLocationMemory = this.freeBallsLocationMemory.filter(
      (item) => !closeEmptyLocations.includes(item)
    );
    this.freeHolesLocationMemmory = this.freeHolesLocationMemmory.filter(
      (item) => !closeEmptyLocations.includes(item)
    );

    closeBallsLocations.map((item) => {
      if (!this.freeBallsLocationMemory.includes(item)) {
        this.freeBallsLocationMemory.push(item);
      }
    });
    closeHolesLocations.map((item) => {
      if (!this.freeHolesLocationMemmory.includes(item)) {
        this.freeHolesLocationMemmory.push(item);
      }
    });
  }

  chooseGoal(closeBalls, closeHolls) {
    let goalElement = null;
    let goalLocation = null;
    let minimumDistance = BOARD_SIZE_CELL * BOARD_SIZE_CELL;

    if (this.pickedElement === null) {
      closeBalls.map((item) => {
        const itemLocation = item.rowCol;
        const manhatanDistance =
          Math.abs(itemLocation[0] - this.row) +
          Math.abs(itemLocation[1] - this.column);

        if (manhatanDistance < minimumDistance) {
          goalElement = item;
          goalLocation = itemLocation;
          minimumDistance = manhatanDistance;
        }
      });

      if (goalLocation === null) {
        this.freeBallsLocationMemory.map((item) => {
          const itemLocation = item.split(",");
          const manhatanDistance =
            Math.abs(itemLocation[0] - this.row) +
            Math.abs(itemLocation[1] - this.column);

          if (manhatanDistance < minimumDistance) {
            goalElement = null;
            goalLocation = itemLocation;
            minimumDistance = manhatanDistance;
          }
        });
      }
    } else {
      closeHolls.map((item) => {
        const itemLocation = item.rowCol;
        const manhatanDistance =
          Math.abs(itemLocation[0] - this.row) +
          Math.abs(itemLocation[1] - this.column);

        if (manhatanDistance < minimumDistance) {
          goalElement = item;
          goalLocation = itemLocation;
          minimumDistance = manhatanDistance;
        }
      });

      if (goalLocation === null) {
        this.freeHolesLocationMemmory.map((item) => {
          const itemLocation = item.split(",");
          const manhatanDistance =
            Math.abs(itemLocation[0] - this.row) +
            Math.abs(itemLocation[1] - this.column);

          if (manhatanDistance < minimumDistance) {
            goalElement = null;
            goalLocation = itemLocation;
            minimumDistance = manhatanDistance;
          }
        });
      }
    }

    if (goalLocation === null) {
      const directions = [
        [this.row + 1, this.column],
        [this.row, this.column + 1],
        [this.row - 1, this.column],
        [this.row, this.column - 1],
      ].filter(
        (item) =>
          item[0] >= 0 &&
          item[0] < BOARD_SIZE_CELL &&
          item[1] >= 0 &&
          item[1] < BOARD_SIZE_CELL
      );

      let randomLocation = [this.currentLocation[0], this.currentLocation[1]];
      while (
        randomLocation[0] === this.currentLocation[0] &&
        randomLocation[1] === this.currentLocation[1]
      ) {
        randomLocation =
          directions[Math.floor(Math.random() * directions.length)];
      }

      goalLocation = randomLocation;
    }

    return { goalLocation: goalLocation, goalElement: goalElement };
  }

  makeDecision(goalLocation) {
    if (goalLocation[0] === this.row && goalLocation[1] === this.column) {
      if (this.pickedElement === null) {
        return DISISIONS.pickUp;
      } else {
        return DISISIONS.putDown;
      }
    } else {
      if (goalLocation[0] < this.row) {
        return DISISIONS.top;
      } else if (goalLocation[0] > this.row) {
        return DISISIONS.down;
      } else if (goalLocation[1] > this.column) {
        return DISISIONS.right;
      } else {
        return DISISIONS.left;
      }
    }
  }

  pickUp(goalElement) {
    this.pickedElement = goalElement;
  }

  putDown(goalElement) {
    this.pickedElement.isArrived = true;
    goalElement.isFill = true;
    this.pickedElement = null;
    goalElement.currentElement.style.borderColor = "#4caf50";
  }

  turn(direction) {
    if (direction === DISISIONS.top) {
      this.currentElement.style.transform = "rotate(0deg)";
    }
    if (direction === DISISIONS.right) {
      this.currentElement.style.transform = "rotate(90deg)";
    }
    if (direction === DISISIONS.left) {
      this.currentElement.style.transform = "rotate(270deg)";
    }
    if (direction === DISISIONS.down) {
      this.currentElement.style.transform = "rotate(180deg)";
    }

    this.direction = direction;
  }

  goForward() {
    const cellSize = BOARD_SIZE_PX / BOARD_SIZE_CELL;
    const postionFromTop = Number(this.currentElement.style.top.slice(0, -2));
    const postionFromLeft = Number(this.currentElement.style.left.slice(0, -2));
    this.currentLocation = [this.row, this.column];
    if (this.direction === DISISIONS.top) {
      this.currentElement.style.top = postionFromTop - cellSize + "px";
      this.row = this.row - 1;
    }
    if (this.direction === DISISIONS.right) {
      this.currentElement.style.left = postionFromLeft + cellSize + "px";
      this.column = this.column + 1;
    }
    if (this.direction === DISISIONS.left) {
      this.currentElement.style.left = postionFromLeft - cellSize + "px";
      this.column = this.column - 1;
    }
    if (this.direction === DISISIONS.down) {
      this.currentElement.style.top = postionFromTop + cellSize + "px";
      this.row = this.row + 1;
    }

    if (this.pickedElement) this.pickedElement.move(this.direction);
  }

  start() {
    const action = () => {
      agentTimeOut = setTimeout(() => {
        manageLogs();

        if (BALLS.filter((item) => !item.isArrived).length === 0) {
          alert("AGENT WOOON! The agent took all the balls into the holes");
          document.getElementsByTagName("button")[1].disabled = true;
          document.getElementsByTagName("button")[2].disabled = false;
          return;
        }

        const closeItems = this.searchAround();
        this.updateMemory(closeItems.closeBalls, closeItems.closeHolls);
        const goal = this.chooseGoal(
          closeItems.closeBalls,
          closeItems.closeHolls
        );
        const dicision = this.makeDecision(goal.goalLocation);

        if (dicision === DISISIONS.pickUp) {
          this.pickUp(goal.goalElement);
        } else if (dicision === DISISIONS.putDown) {
          this.putDown(goal.goalElement);
          for (const ball of BALLS) {
            ball.randomMove();
          }
        } else {
          if (this.fule === 0) {
            alert("the agent can not move all balls into holes");
            document.getElementsByTagName("button")[1].disabled = true;
            document.getElementsByTagName("button")[2].disabled = false;
            return;
          }

          if (this.direction !== dicision) {
            this.turn(dicision);
          }

          this.goForward();
          this.fule = this.fule - 1;
          document.getElementById("fule").innerText = this.fule;
        }
        action();
      }, 800);
    };
    action();
  }

  generateElement() {
    const element = this.getElement();

    element.style.borderRadius = "4px";
    element.style.clipPath = "polygon(0% 100%, 50% 0%, 100% 100%)";
    element.style.border = 0;
    element.style.backgroundColor = "blue";
    element.style.transition =
      "top 500ms linear, left 500ms linear, transform 100ms linear";

    this.currentElement = element;

    return element;
  }
}

function generateRandomNumbers(numberCount, min, max) {
  const numbers = new Set();

  while (numbers.size < numberCount) {
    const randomNumber = Math.floor(Math.random() * (max - min)) + min;
    numbers.add(randomNumber);
  }

  return [...numbers];
}

function manageLogs() {
  let step = "";

  const ballsLocationString = BALLS.map(
    (item) => `(${item.rowCol.join(", ")})`
  ).join(" ");
  const holesLocationString = HOLES.map(
    (item) => `(${item.rowCol.join(", ")})`
  ).join(" ");
  const agentsLocationString = `(${AGENT.rowCol.join(", ")})`;

  step = `balls: ${ballsLocationString} \n holes: ${holesLocationString} \n agent: ${agentsLocationString} \n agent fule: ${AGENT.fule} \n agent direction: ${AGENT.direction}`;
  console.log(step);

  const divider =
    "-------------------------------------------------------------------------------------------------";
  step += `\n ${divider} \n`;

  LOG += step;
}

function downloadLogsAsTXT() {
  let content = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(LOG);
  const link = document.createElement("a");
  link.setAttribute("href", content);
  link.setAttribute("download", "logs.txt");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
