class TeamInfo {
  id = ""
  freeBallsLocationMemory = [];
  freeHolesLocationMemmory = [];

  agentsGoalLocation = {};
  teamColor = ""

  score = 0

  constructor(teamColor, elementID) {
    this.teamColor = teamColor
    this.id = elementID
  }

  scoreCalculator(){
    const score = HOLES.filter((item) => item.FilledByTeamId === this.id).length
    document.getElementById(this.id).innerText = score
    this.score = score
  }
}
