class Ball extends Element {
  isArrived = false;
  isPicked = false;

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
    if (this.isArrived || this.isPicked) return;

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
      holes[0].FilledBallObject = this
      holes[0].currentElement.style.borderColor = "#4caf50";
    }
  }

  randomThrow(){
    const agentLocations = AGENTS.map((item) => item.row+","+ item.column)
    const ballsLocations = BALLS.map((item) => item.row+","+ item.column)
    const holeLocations = HOLES.map((item) => item.row+","+ item.column)

    const busyLocations = [...agentLocations, ...ballsLocations, ...holeLocations]
    const freeLocations = []

    for (let i = 0; i < BOARD_SIZE_CELL; i++) {
      for (let j = 0; j < BOARD_SIZE_CELL; j++) {
        const loc = i+","+j;
        if(!busyLocations.includes(loc)){
          freeLocations.push([i,j])
        }
      }
    }

    const max = freeLocations.length
    const randomnumber = Math.floor(Math.random() * (max))

    const selectedLocation = freeLocations[randomnumber]

    const postionFromTop = Number(this.currentElement.style.top.slice(0, -2));
    const postionFromLeft = Number(this.currentElement.style.left.slice(0, -2));
    const cellSize = BOARD_SIZE_PX / BOARD_SIZE_CELL;

    this.currentElement.style.top = postionFromTop + (selectedLocation[0] - this.row) * cellSize + "px";
    this.currentElement.style.left = postionFromLeft + (selectedLocation[1] - this.column) * cellSize + "px";

    this.row = selectedLocation[0];
    this.column = selectedLocation[1];
  }

  generateElement() {
    const element = this.getElement();

    element.style.borderRadius = "999px";
    element.style.backgroundColor = "#4caf50";
    element.style.transition = "all 500ms linear";
    element.style.zIndex = 1

    return element;
  }
}
