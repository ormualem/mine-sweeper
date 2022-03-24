"uss strict"
// [{ minesAroundCount: 4, isShown: true, isMine: false, isMarked: true }]
var gBoard = []
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gDifficultyMap = new Map()
gDifficultyMap.set('easy', {numOfRows: 4, numOfCols: 4, numOfMines: 2})
gDifficultyMap.set('medium', {numOfRows: 8, numOfCols: 8, numOfMines: 12})
gDifficultyMap.set('hard', {numOfRows: 12, numOfCols: 12, numOfMines: 30})
var gCurrLevelId = ''

function init() {
  buildBoard('easy')
  //   renderBoard(gBoard)
}
function buildBoard(levelId) {
  gBoard = []
  gCurrLevelId = levelId
  var levelSettings = gDifficultyMap.get(levelId)
  for (var i = 0; i < levelSettings.numOfRows; i++) {
    var currRow = []
    for (var j = 0; j < levelSettings.numOfCols; j++) {
      currRow.push({
        minesAroundCount: 0,
        isShown: true,
        isMine: false,
        isMarked: true,
      })
    }
    gBoard.push(currRow)
  }
  var minesLocation = getMineLocation(levelSettings.numOfMines)

  for (var i = 0; i < minesLocation.length; i++) {
    // minesLocation [{row: 2, col: 4}, {row:0, col:3}]
    gBoard[minesLocation[i].row][minesLocation[i].col].isMine = true
  }
  updateNeighborsForBoard(gBoard)
  console.table(gBoard)
  render(gBoard)
}

function updateNeighborsForBoard(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var num = countNeighbors(board, { row: i, col: j })
      board[i][j].minesAroundCount = num
    }
  }
}

function getMineLocation(amountOfMines) {
  var mineLocations = []
  for (var i = 0; i < amountOfMines; i++) {
    var randLocation = getRandomLocation(gBoard)
    while (isLocationExists(mineLocations, randLocation.row, randLocation.col)) {
        console.log('there is alreay a mine in this location, get a new random location')
        randLocation = getRandomLocation(gBoard)
    }
    mineLocations.push({ row: randLocation.row, col: randLocation.col })
    console.log("mineLocation:", mineLocations)
   
  }
  return mineLocations
}

function getRandomLocation(array) {
    var randRow = getRandomInt(0, array.length - 1)
    var randCol = getRandomInt(0, array[0].length - 1)
    return {row: randRow, col:randCol}
}


function isLocationExists(arr, row, col) {
  var isExists = false
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].row === row && arr[i].col === col) {
      isExists = true
    }
  }
  return isExists
}

function getRandomInt(min, max) {
  var randIdx = Math.ceil(Math.random() * (max - min) + min)
  return randIdx
}


// function cellClicked(elCell, i, j) {}

// function cellMarked(elCell) {}


// function expandShown(board, elCell, i, j) {}

// set the function to curr game

function countNeighbors(board, location) {
  var amountOfMines = 0
  var rowLimit = board.length - 1
  var columnLimit = board[0].length - 1

  for (
    var x = Math.max(0, location.row - 1);
    x <= Math.min(location.row + 1, rowLimit);
    x++
  ) {
    for (
      var y = Math.max(0, location.col - 1);
      y <= Math.min(location.col + 1, columnLimit);
      y++
    ) {
      if (x !== location.row || y !== location.col) {
        //   console.log(board[x][y]); //neighbor
        if (board[x][y].isMine) {
          amountOfMines++
        }
      }
    }
  }
  return amountOfMines
}

function render(board) {
  var strHTML = ""
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>"
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j]
      if (cell.isMine)
        strHTML += `<td class="td-${i}-${j}" onclick="pressButton(${i}, ${j})"</td>`
      else
        strHTML += `<td class="td-${i}-${j}" onclick="pressButton(${i}, ${j})"</td>`
    }
    strHTML += "</tr>"
  }
  var elCell = document.querySelector(".game-board")
  elCell.innerHTML = strHTML
}

function pressButton(row, col) {
  var elCell = document.querySelector(`.td-${row}-${col}`)
  var cell = gBoard[row][col]
  if (cell.isMine) {
    elCell.innerHTML = "X"
    alert('its a mine! game over :(')
    buildBoard(gCurrLevelId)
  } else {
    elCell.innerHTML = cell.minesAroundCount
  }
  console.log(`cell ${row}-${col} was clicked`)
}

// function checkGameOver() {

// }
// cellMarked()

// function cellMarked() {
//     var noRightClick = document.querySelector('.game-board td');
//     noRightClick.addEventListener("contextmenu", e => e.preventDefault());
// }