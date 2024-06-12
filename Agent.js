class Agent extends Element {
  direction = DISISIONS.top;
  fule = 30;
  pickedElement = null;
  currentLocation = [-1, -1];
  unSuccessfullAttemptCount = 0;
  name = "";
  teamInfo = ""; // team info object

  constructor(cellNumber, fule, teamInfo) {
    super(cellNumber);
    this.SIZE_RATIO = 1.5;
    this.fule = fule;
    this.teamInfo = teamInfo;
    this.name = Math.random().toString();
  }

  searchAround() {
    const closeBalls = BALLS.filter((item) => {
      const location = item.rowCol;

      return (
        location[0] <= this.row + 1 &&
        location[0] >= this.row - 1 &&
        location[1] <= this.column + 1 &&
        location[1] >= this.column - 1 &&
        !item.isArrived &&
        !item.isPicked
      );
    });

    const closeHolls = HOLES.filter((item) => {
      const location = item.rowCol;

      return (
        location[0] <= this.row + 1 &&
        location[0] >= this.row - 1 &&
        location[1] <= this.column + 1 &&
        location[1] >= this.column - 1 &&
        (!item.isFill ||
          (item.isFill && item.FilledByTeamId !== this.teamInfo.id))
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

    this.teamInfo.freeBallsLocationMemory =
      this.teamInfo.freeBallsLocationMemory.filter(
        (item) => !closeEmptyLocations.includes(item)
      );
    this.teamInfo.freeHolesLocationMemmory =
      this.teamInfo.freeHolesLocationMemmory.filter(
        (item) => !closeEmptyLocations.includes(item)
      );

    closeBallsLocations.map((item) => {
      if (!this.teamInfo.freeBallsLocationMemory.includes(item)) {
        this.teamInfo.freeBallsLocationMemory.push(item);
      }
    });
    closeHolesLocations.map((item) => {
      if (!this.teamInfo.freeHolesLocationMemmory.includes(item)) {
        this.teamInfo.freeHolesLocationMemmory.push(item);
      }
    });
  }
  chooseGoal(closeBalls, closeHolls) {
    let goalElement = null;
    let goalLocation = null;
    let minimumDistance = BOARD_SIZE_CELL * BOARD_SIZE_CELL;

    const otherGoalLocationObject = { ...this.teamInfo.agentsGoalLocation };
    delete otherGoalLocationObject[this.name];
    const otherGoalLocation = Object.values(otherGoalLocationObject);

    if (this.pickedElement === null) {
      closeBalls.map((item) => {
        const itemLocation = item.rowCol;
        const manhatanDistance =
          Math.abs(itemLocation[0] - this.row) +
          Math.abs(itemLocation[1] - this.column);

        if (
          manhatanDistance < minimumDistance &&
          !otherGoalLocation.includes(itemLocation[0] + "," + itemLocation[1])
        ) {
          goalElement = item;
          goalLocation = itemLocation;
          minimumDistance = manhatanDistance;
        }
      });

      if (goalLocation === null) {
        this.teamInfo.freeBallsLocationMemory.map((item) => {
          const itemLocation = item.split(",");
          const manhatanDistance =
            Math.abs(itemLocation[0] - this.row) +
            Math.abs(itemLocation[1] - this.column);

          if (
            manhatanDistance < minimumDistance &&
            !otherGoalLocation.includes(item)
          ) {
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

        if (
          manhatanDistance < minimumDistance &&
          !otherGoalLocation.includes(itemLocation[0] + "," + itemLocation[1])
        ) {
          goalElement = item;
          goalLocation = itemLocation;
          minimumDistance = manhatanDistance;
        }
      });

      if (goalLocation === null) {
        this.teamInfo.freeHolesLocationMemmory.map((item) => {
          const itemLocation = item.split(",");
          const manhatanDistance =
            Math.abs(itemLocation[0] - this.row) +
            Math.abs(itemLocation[1] - this.column);

          if (
            manhatanDistance < minimumDistance &&
            !otherGoalLocation.includes(item)
          ) {
            goalElement = null;
            goalLocation = itemLocation;
            minimumDistance = manhatanDistance;
          }
        });
      }
    }

    const findRandomLocation = (emergence) => {
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

      if (emergence) {
        directions[Math.floor(Math.random() * directions.length)];
      } else {
        while (
          randomLocation[0] === this.currentLocation[0] &&
          randomLocation[1] === this.currentLocation[1]
        ) {
          randomLocation =
            directions[Math.floor(Math.random() * directions.length)];
        }
      }

      return randomLocation;
    };

    if (goalLocation === null && this.unSuccessfullAttemptCount <= 3) {
      goalLocation = findRandomLocation(false);
    }

    if (this.unSuccessfullAttemptCount > 3) {
      goalLocation = findRandomLocation(true);
    }

    return { goalLocation: goalLocation, goalElement: goalElement };
  }
  updateGoalLocationInMemory(goalLocation) {
    this.teamInfo.agentsGoalLocation[this.name] =
      goalLocation[0] + "," + goalLocation[1];
  }
  makeDecision(goalLocation) {
    if (goalLocation[0] === this.row && goalLocation[1] === this.column) {
      if (this.pickedElement === null) {
        return DISISIONS.pickUp;
      } else {
        return DISISIONS.putDown;
      }
    } else {
      const topLocation = `${this.row - 1},${this.column}`;
      const rightLocation = `${this.row},${this.column + 1}`;
      const downLocation = `${this.row + 1},${this.column}`;
      const leftLocation = `${this.row},${this.column - 1}`;

      const locationsArr = AGENTS.filter((item) => item.fule > 0).map(
        (item) => item.row + "," + item.column
      );

      if (goalLocation[0] < this.row && !locationsArr.includes(topLocation)) {
        this.unSuccessfullAttemptCount = 0;
        return DISISIONS.top;
      } else if (
        goalLocation[0] > this.row &&
        !locationsArr.includes(downLocation)
      ) {
        this.unSuccessfullAttemptCount = 0;
        return DISISIONS.down;
      } else if (
        goalLocation[1] > this.column &&
        !locationsArr.includes(rightLocation)
      ) {
        this.unSuccessfullAttemptCount = 0;
        return DISISIONS.right;
      } else if (
        goalLocation[1] < this.column &&
        !locationsArr.includes(leftLocation)
      ) {
        this.unSuccessfullAttemptCount = 0;
        return DISISIONS.left;
      }

      this.unSuccessfullAttemptCount += 1;
      return "";
    }
  }
  pickUp(goalElement) {
    if (!goalElement.isPicked && !goalElement.isArrived) {
      this.pickedElement = goalElement;
      goalElement.isPicked = true;
    }
  }
  putDown(goalElement) {
    if (goalElement.isFill) {
      const ball = goalElement.FilledBallObject;
      ball.isArrived = false;
      ball.randomThrow();
    }

    this.pickedElement.isArrived = true;
    this.pickedElement.isPicked = false;

    goalElement.isFill = true;
    goalElement.FilledByTeamId = this.teamInfo.id;
    goalElement.FilledBallObject = this.pickedElement;
    goalElement.currentElement.style.borderColor = this.teamInfo.teamColor;

    this.pickedElement = null;

    TEAMS.map((team) => team.scoreCalculator());
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

    this.fule = this.fule - 1;
    this.currentElement.innerText = this.fule;
  }
  start() {
    const action = () => {
      agentTimeOut = setTimeout(() => {
        manageLogs();

        if (BALLS.filter((item) => !item.isArrived).length === 0) {
          const teamsSortByScore = TEAMS.sort((a, b) => b.score - a.score);
          const winner = teamsSortByScore[0];
          const losser = teamsSortByScore[1];
          if (!isGameAlert) {
            isGameAlert = true;
            const text =
              winner.score > losser.score
                ? winner.id + " wins the game"
                : "The game equalised";
            alert("The game is over, " + text);
          }
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

        this.updateGoalLocationInMemory(goal.goalLocation);
        const dicision = this.makeDecision(goal.goalLocation);

        if (dicision === DISISIONS.pickUp) {
          this.pickUp(goal.goalElement);
        } else if (dicision === DISISIONS.putDown) {
          this.putDown(goal.goalElement);
          for (const ball of BALLS) {
            ball.randomMove();
          }
        } else if (!!dicision) {
          if (this.fule === 0) {
            this.powerOff();

            if (AGENTS.every((item) => item.fule === 0)) {
              document.getElementsByTagName("button")[1].disabled = true;
              document.getElementsByTagName("button")[2].disabled = false;
              const teamsSortByScore = TEAMS.sort((a, b) => b.score - a.score);
              const winner = teamsSortByScore[0];
              const losser = teamsSortByScore[1];
              if (!isGameAlert) {
                isGameAlert = true;
                const text =
                  winner.score > losser.score
                    ? winner.id + " wins the game"
                    : "The game equalised";
                alert("The game is over, " + text);
              }
            }
            return;
          }
          if (this.direction !== dicision) {
            this.turn(dicision);
          }
          this.goForward();
        }
        action();
      }, 800);
    };
    action();
  }
  powerOff() {
    if (this.pickedElement) {
      this.pickedElement.isPicked = false;
      this.teamInfo.freeBallsLocationMemory.push(this.rowCol.join(","));
      delete this.teamInfo.agentsGoalLocation[this.name];
    }
    this.currentElement.style.backgroundColor = "gray";
  }
  generateElement() {
    const element = this.getElement();

    element.style.borderRadius = "4px";
    element.style.clipPath = "polygon(0% 100%, 50% 0%, 100% 100%)";
    element.style.border = 0;
    element.style.display = "flex";
    element.style.alignItems = "flex-end";
    element.style.justifyContent = "center";
    element.style.color = "#fff";
    element.style.backgroundColor = this.teamInfo.teamColor;
    element.style.transition =
      "top 500ms linear, left 500ms linear, transform 100ms linear";

    element.innerText = this.fule;

    this.currentElement = element;

    return element;
  }
}
