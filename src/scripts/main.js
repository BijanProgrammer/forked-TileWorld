const BOARD_SIZE_PX = 773;
let BOARD_SIZE_CELL = 0;

let AGENTS = "";
let BALLS = "";
let HOLES = "";
let TEAMS = "";

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
let isGameAlert = false

function readyGame() {
  const board = document.getElementById("board");
  document.getElementsByTagName("button")[2].disabled = true;
  document.getElementsByTagName("button")[1].disabled = false;
  board.innerHTML = "";
  LOG = "";
  isGameAlert = false;
  clearTimeout(agentTimeOut);

  const form = document.forms[0];
  const startFule = Number(form[0].value);
  BOARD_SIZE_CELL = Number(form[1].value);
  const ballsCount = Number(form[2].value);
  const team1PlayerCount = Number(form[3].value);
  const team2PlayerCount = Number(form[4].value);


  if (ballsCount * 2 + team1PlayerCount + team2PlayerCount > BOARD_SIZE_CELL * BOARD_SIZE_CELL) {
    alert(
      `it is impossible to generate ${ballsCount} balls and ${ballsCount} holes and ${team1PlayerCount + team2PlayerCount} agents in ${
        BOARD_SIZE_CELL * BOARD_SIZE_CELL
      } cell`
    );
    document.getElementsByTagName("button")[1].disabled = true;
    return;
  }

  const balls = [];
  const holes = [];
  const agents = []

  const randomNumbers = generateRandomNumbers(
    2 * ballsCount + team1PlayerCount + team2PlayerCount,
    1,
    BOARD_SIZE_CELL * BOARD_SIZE_CELL
  );

  for (let i = 0; i < ballsCount; i++) {
    balls[i] = new Ball(randomNumbers[i]);
    board.appendChild(balls[i].generateElement());
  }
  for (let i = 0; i < ballsCount; i++) {
    holes[i] = new Hole(randomNumbers[i + ballsCount]);
    board.appendChild(holes[i].generateElement());
  }
  const firstTeam = new TeamInfo("blue","team_blue");
  const secondTeam = new TeamInfo("red","team_red");
  for (let i = 0; i < team1PlayerCount + team2PlayerCount; i++) {
    const team = i < team1PlayerCount ? firstTeam : secondTeam
    agents[i] =  new Agent(
      randomNumbers[i + 2 * ballsCount],
      startFule,
      team
    );
    board.appendChild(agents[i].generateElement());
  }

  for (let i = 0; i < BOARD_SIZE_CELL; i++) {
    for (let j = 0; j < BOARD_SIZE_CELL; j++) {
      const child = document.createElement("div");
      child.style.width = BOARD_SIZE_PX / BOARD_SIZE_CELL + "px";
      child.style.height = BOARD_SIZE_PX / BOARD_SIZE_CELL + "px";
      board.appendChild(child);
    }
  }

  TEAMS = [firstTeam, secondTeam]
  AGENTS = agents;
  BALLS = balls;
  HOLES = holes;
}
function runGame() {
  AGENTS.map((item) => item.start());
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
  const agentsLocationString = AGENTS.map(
    (item) =>
      `((${item.rowCol.join(", ")}), fule: ${item.fule} , direction: ${
        item.direction
      })`
  ).join(" ");
  const teams = TEAMS.map((team) => "(" + team.id + "---> score:" + team.score + ")")

  step = `balls: ${ballsLocationString} \n holes: ${holesLocationString} \n agent: ${agentsLocationString} \n teams: ${teams}`;
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
