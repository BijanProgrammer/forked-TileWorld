# from tkinter import Canvas


# BOARD_SIZE_PX = 770
# BOARD_SIZE_CELL = 0
# AGENT = ""
# BALLS = ""
# HOLES = ""
# GAME_BOARD = []
# DISISIONS = {
#     "pickUp": "pickup",
#     "putDown": "putDown",
#     "right": "right",
#     "left": "left",
#     "top": "top",
#     "down": "down"
# }

# def readyGame():
#     global BOARD_SIZE_CELL, AGENT, BALLS, HOLES
#     board = document.getElementById("board")
#     board.innerHTML = ""
#     form = document.forms[0]
#     startFule = int(form[0].value)
#     BOARD_SIZE_CELL = int(form[1].value)
#     ballsCount = int(form[2].value)
#     document.getElementsByTagName("button")[1].disabled = False
#     balls = []
#     holes = []
#     randomNumbers = generateRandomNumbers(2 * ballsCount, 1, BOARD_SIZE_CELL * BOARD_SIZE_CELL)
#     agentCellNumber = generateRandomNumbers(1, 1, BOARD_SIZE_CELL * BOARD_SIZE_CELL)
#     agent = Agent(agentCellNumber[0], startFule)
#     board.appendChild(agent.generateElement())
#     for i in range(ballsCount):
#         balls.append(Ball(randomNumbers[i]))
#         board.appendChild(balls[i].generateElement())
#     for i in range(ballsCount):
#         holes.append(Hole(randomNumbers[i + ballsCount]))
#         board.appendChild(holes[i].generateElement())
#     for i in range(BOARD_SIZE_CELL):
#         for j in range(BOARD_SIZE_CELL):
#             child = document.createElement("div")
#             child.style.width = BOARD_SIZE_PX / BOARD_SIZE_CELL + "px"
#             child.style.height = BOARD_SIZE_PX / BOARD_SIZE_CELL + "px"
#             board.appendChild(child)
#     for i in range(BOARD_SIZE_CELL):
#         for j in range(BOARD_SIZE_CELL):
#             array = []
#     AGENT = agent
#     BALLS = balls
#     HOLES = holes

# def runGame():
#     AGENT.start()

# class Element:
#     SIZE_RATIO = 1
#     cellNumber = 0
#     row = 0
#     column = 0
#     ballElement = None

#     def __init__(self, cellNumber):
#         self.cellNumber = cellNumber
#         self.row = self.cellNumber // BOARD_SIZE_CELL
#         self.column = self.cellNumber - self.row * BOARD_SIZE_CELL - 1
#         if self.column == -1:
#             self.row -= 1
#             self.column = BOARD_SIZE_CELL - 1

#     @property
#     def rowCol(self):
#         return [self.row, self.column]

#     def getElement(self):
#         cellSize = BOARD_SIZE_PX / BOARD_SIZE_CELL
#         element = Canvas(width=cellSize / self.SIZE_RATIO, height=cellSize / self.SIZE_RATIO)
#         top = (self.row + 1) * cellSize - (cellSize / 2 + cellSize / (self.SIZE_RATIO * 2))
#         left = (self.column + 1) * cellSize - (cellSize / 2 + cellSize / (self.SIZE_RATIO * 2))
#         # Note: The positioning part needs to be handled according to your GUI framework's requirements
#         self.ballElement = element
#         return element


# class Ball(Element):
#     isArrived = False

#     def __init__(self, cellNumber):
#         super().__init__(cellNumber)
#         self.SIZE_RATIO = 4

#     def move(self, direction):
#         cellSize = BOARD_SIZE_PX / BOARD_SIZE_CELL
#         postionFromTop = int(self.ballElement.style.top[:-2])
#         postionFromLeft = int(self.ballElement.style.left[:-2])
#         if direction == DISISIONS["top"]:
#             self.ballElement.style.top = str(postionFromTop - (cellSize - 2)) + "px"
#             self.row = self.row - 1
#         if direction == DISISIONS["right"]:
#             self.ballElement.style.left = str(postionFromLeft + (cellSize - 2)) + "px"
#             self.row = self.column + 1
#         if direction == DISISIONS["left"]:
#             self.ballElement.style.left = str(postionFromLeft - (cellSize - 2)) + "px"
#             self.row = self.column - 1
#         if direction == DISISIONS["down"]:
#             self.ballElement.style.top = str(postionFromTop + (cellSize - 2)) + "px"
#             self.row = self.row + 1

#     def generateElement(self):
#         element = self.getElement()
#         element.style.borderRadius = "999px"
#         element.style.backgroundColor = "#4caf50"
#         element.style.transition = "all 300ms linear"
#         return element

# class Hole(Element):
#     isFill = False

#     def __init__(self, cellNumber):
#         super().__init__(cellNumber)
#         self.SIZE_RATIO = 1.5

#     def fill(self):
#         self.isFill = True

#     def generateElement(self):
#         element = self.getElement()
#         element.style.borderRadius = "4px"
#         element.style.border = "2px solid red"
#         return element

# class Agent(Element):
#     direction = DISISIONS["top"]
#     fule = 30
#     agentElement = None
#     pickedElement = None
#     currentLocation = [-1, -1]

#     def __init__(self, cellNumber, fule):
#         super().__init__(cellNumber)
#         self.SIZE_RATIO = 1.5
#         self.fule = fule
#         document.getElementById("fule").innerText = self.fule

#     def searchAround(self):
#         closeBalls = list(filter(lambda item: item.rowCol[0] <= self.row + 1 and item.rowCol[0] >= self.row - 1 and item.rowCol[1] <= self.column + 1 and item.rowCol[1] >= self.column - 1 and not item.isArrived, BALLS))
#         closeHolls = list(filter(lambda item: item.rowCol[0] <= self.row + 1 and item.rowCol[0] >= self.row - 1 and item.rowCol[1] <= self.column + 1 and item.rowCol[1] >= self.column - 1 and not item.isFill, HOLES))
#         return {"closeBalls": closeBalls, "closeHolls": closeHolls}

#     def chooseGoal(self, closeBalls, closeHolls):
#         goalElement = None
#         goalLocation = None
#         minimumDistance = BOARD_SIZE_CELL * BOARD_SIZE_CELL
#         if self.pickedElement == None:
#             for item in closeBalls:
#                 itemLocation = item.rowCol
#                 manhatanDistance = abs(itemLocation[0] - self.row) + abs(itemLocation[1] - self.column)
#                 if manhatanDistance < minimumDistance:
#                     goalElement = item
#                     goalLocation = itemLocation
#                     minimumDistance = manhatanDistance
#         else:
#             for item in closeHolls:
#                 itemLocation = item.rowCol
#                 manhatanDistance = abs(itemLocation[0] - self.row) + abs(itemLocation[1] - self.column)
#                 if manhatanDistance < minimumDistance:
#                     goalElement = item
#                     goalLocation = itemLocation
#                     minimumDistance = manhatanDistance
#         if goalLocation == None:
#             directions = list(filter(lambda item: item[0] >= 0 and item[0] < BOARD_SIZE_CELL and item[1] >= 0 and item[1] < BOARD_SIZE_CELL, [[self.row + 1, self.column], [self.row, self.column + 1], [self.row - 1, self.column], [self.row, self.column - 1]]))
#             randomLocation = [self.currentLocation[0], self.currentLocation[1]]
#             while randomLocation[0] == self.currentLocation[0] and randomLocation[1] == self.currentLocation[1]:
#                 randomLocation = directions[Math.floor(Math.random() * len(directions))]
#             goalLocation = randomLocation
#         return {"goalLocation": goalLocation, "goalElement": goalElement}

#     def makeDicision(self, goalLocation):
#         if goalLocation[0] == self.row and goalLocation[1] == self.column:
#             if self.pickedElement == None:
#                 return DISISIONS["pickUp"]
#             else:
#                 return DISISIONS["putDown"]
#         else:
#             if goalLocation[0] < self.row:
#                 return DISISIONS["top"]
#             elif goalLocation[0] > self.row:
#                 return DISISIONS["down"]
#             elif goalLocation[1] > self.column:
#                 return DISISIONS["right"]
#             else:
#                 return DISISIONS["left"]

#     def pickUp(self, goalElement):
#         self.pickedElement = goalElement

#     def putDown(self, goalElement):
#         self.pickedElement.isArrived = True
#         goalElement.isFill = True
#         self.pickedElement = None

#     def turn(self, direction):
#         if direction == DISISIONS["top"]:
#             self.agentElement.style.transform = "rotate(0deg)"
#         if direction == DISISIONS["right"]:
#             self.agentElement.style.transform = "rotate(90deg)"
#         if direction == DISISIONS["left"]:
#             self.agentElement.style.transform = "rotate(270deg)"
#         if direction == DISISIONS["down"]:
#             self.agentElement.style.transform = "rotate(180deg)"
#         self.direction = direction

#     def goForward(self):
#         cellSize = BOARD_SIZE_PX / BOARD_SIZE_CELL
#         postionFromTop = int(self.agentElement.style.top[:-2])
#         postionFromLeft = int(self.agentElement.style.left[:-2])
#         self.currentLocation = [self.row, self.column]
#         if self.direction == DISISIONS["top"]:
#             self.agentElement.style.top = str(postionFromTop - (cellSize - 2)) + "px"
#             self.row = self.row - 1
#         if self.direction == DISISIONS["right"]:
#             self.agentElement.style.left = str(postionFromLeft + (cellSize - 2)) + "px"
#             self.column = self.column + 1
#         if self.direction == DISISIONS["left"]:
#             self.agentElement.style.left = str(postionFromLeft - (cellSize - 2)) + "px"
#             self.column = self.column - 1
#         if self.direction == DISISIONS["down"]:
#             self.agentElement.style.top = str(postionFromTop + (cellSize - 2)) + "px"
#             self.row = self.row + 1
#         if self.pickedElement:
#             self.pickedElement.move(self.direction)

#     def start(self):
#         def action():
#             if self.fule == 0:
#                 alert("the agent can not move all balls into holes")
#                 document.getElementsByTagName("button")[1].disabled = True
#                 return
#             if len(list(filter(lambda item: not item.isArrived, BALLS))) == 0:
#                 alert("AGENT WOOON! The agent took all the balls into the holes")
#                 document.getElementsByTagName("button")[1].disabled = True
#                 return
#             closeItems = self.searchAround()
#             goal = self.chooseGoal(closeItems["closeBalls"], closeItems["closeHolls"])
#             dicision = self.makeDicision(goal["goalLocation"])
#             if dicision == DISISIONS["pickUp"]:
#                 self.pickUp(goal["goalElement"])
#             elif dicision == DISISIONS["putDown"]:
#                 self.putDown(goal["goalElement"])
#             else:
#                 if self.direction != dicision:
#                     self.turn(dicision)
#                 self.goForward()
#                 self.fule = self.fule - 1
#                 document.getElementById("fule").innerText = self.fule
#             action()
#         action()

#     def generateElement(self):
#         element = self.getElement()
#         element.style.borderRadius = "4px"
#         element.style.clipPath = "polygon(0% 100%, 50% 0%, 100% 100%)"
#         element.style.border = 0
#         element.style.backgroundColor = "blue"
#         element.style.transition = "all 400ms linear"
#         self.agentElement = element
#         return element

# def generateRandomNumbers(numberCount, min, max):
#     numbers = set()
#     while len(numbers) < numberCount:
#         randomNumber = random.randint(min, max - 1)
#         numbers.add(randomNumber)
#     return list(numbers)


