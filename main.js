const GameSells = document.getElementById('board')
const RestartButton = document.getElementById('restart')
const GameInfo = document.getElementById('info')
let SizeOfSell = 4
let AmountToWin = 3
let gameEnded = false
let matrix = Array.from({ length: SizeOfSell }, () => Array.from({ length: SizeOfSell }, () => ' '))
let players = ["X", "O"]
let attempts = 0

function CreateSell() {
  matrix.forEach(function (row, rowIndex) {
    const rowElement = document.createElement('div')
    rowElement.classList.add('row')
    row.forEach(function (cell, columnIndex) {
      const cellElement = document.createElement('div')
      cellElement.classList.add('cell')
      cellElement.addEventListener('click', function () {
        SetValue(rowIndex, columnIndex)
      })
      rowElement.appendChild(cellElement)
    })
    GameSells.appendChild(rowElement)
  })
}

function SetValue(rowIndex, columnIndex) {
  if (gameEnded) { return }
  const cellElement = document.querySelector(`.row:nth-child(${rowIndex + 1}) .cell:nth-child(${columnIndex + 1})`)
  const currentPlayer = players[attempts % players.length]

  if (matrix[rowIndex][columnIndex] === ' ') {
    matrix[rowIndex][columnIndex] = currentPlayer
    cellElement.textContent = currentPlayer
    attempts++

    GameInfo.innerHTML = "<p>Ход номер " + attempts + ". Следующий игрок " + players[attempts % players.length] + "</p>"

    if (checkMatrixDraw() && !CheckWin(currentPlayer)) {
      GameInfo.innerHTML = "<p>Ничья</p>"
    } else if (!checkMatrixDraw() && CheckWin(currentPlayer)) {
      GameInfo.innerHTML = "<p>Победил игрок " + currentPlayer + "</p>"
    }
  }
}

function checkMatrixDraw() {
  let allFilled = true

  matrix.forEach(row => {
    row.forEach(cell => {
      if (cell == ' ') {
        allFilled = false
      }
    })
  })

  return allFilled
}

function CheckWin(playerSymbol) {
  const symbol = playerSymbol.repeat(AmountToWin)

  if (SizeOfSell === 3) {
    if (matrix.some(row => row.join('').includes(symbol))) {
      gameEnded = true
      return true
    }

    const columns = matrix[0].map((_, i) => matrix.map(row => row[i]))
    if (columns.some(column => column.join('').includes(symbol))) {
      gameEnded = true
      return true
    }

    const diagonal1 = matrix.map((row, i) => row[i]).join('')
    if (diagonal1.includes(symbol)) {
      gameEnded = true
      return true
    }

    const diagonal2 = matrix.map((row, i) => row[SizeOfSell - 1 - i]).join('')
    if (diagonal2.includes(symbol)) {
      gameEnded = true
      return true
    }

    return false
  } else if (SizeOfSell >= 4) {

    for (let i = 0; i < SizeOfSell; i++) {
      for (let j = 0; j < SizeOfSell; j++) {

        if (i + AmountToWin - 1 < SizeOfSell && j + AmountToWin - 1 < SizeOfSell) {
          let submatrix = []
          for (let k = i; k < i + AmountToWin; k++) {
            submatrix.push(matrix[k].slice(j, j + AmountToWin))
          }

          if (CheckNxNWin(submatrix, playerSymbol)) {
            gameEnded = true
            return true
          }
        }
      }
    }
    return false
  }
}

function CheckNxNWin(submatrix, playerSymbol) {
  const symbol = playerSymbol.repeat(AmountToWin)
  if (submatrix.some(row => row.join('').includes(symbol))) {
    return true
  }
  const columns = submatrix[0].map((_, i) => submatrix.map(row => row[i]))
  if (columns.some(column => column.join('').includes(symbol))) {
    return true
  }
  const diagonal1 = submatrix.map((row, i) => row[i]).join('')
  if (diagonal1.includes(symbol)) {
    return true
  }
  const diagonal2 = submatrix.map((row, i) => row[submatrix.length - 1 - i]).join('')
  if (diagonal2.includes(symbol)) {
    return true
  }
  return false
}

function RestartGame() {
  matrix.forEach(function (row) {
    row.forEach(function (cell, columnIndex) {
      row[columnIndex] = ' '
    })
  })

  const cells = document.getElementsByClassName('cell')
  Array.from(cells).forEach(function (cell) {
    cell.textContent = ''
  })

  attempts = 0
  GameInfo.innerHTML = ''
  gameEnded = false
}

CreateSell()
RestartButton.addEventListener('click', RestartGame)
