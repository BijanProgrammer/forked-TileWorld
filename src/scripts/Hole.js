class Hole extends Element {
  isFill = false;
  FilledBallObject = '';

  FilledByTeamId = '';

  constructor(cellNumber) {
    super(cellNumber);
    this.SIZE_RATIO = 1.5;
  }

  generateElement() {
    const element = this.getElement();

    element.style.borderRadius = '4px';
    element.style.border = '2px solid purple';

    return element;
  }
}
