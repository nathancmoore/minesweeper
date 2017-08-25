'use strict';

var rows = 0;

var cols = 0;

var mines = 0;

var explored = 0;

var cells = ['party time'];

var mineLocations = [];

function Cell (id, mine) {
  this.id = id;
  this.mine = mine;
  this.adjacentMines = 0;
}

function createRow() {
  var table = document.getElementById('display');
  var tr = document.createElement('tr');
  tr.setAttribute('class', 'row');
  table.appendChild(tr);
  for (var i = 0; i < cols; i++) {
    var td = document.createElement('td');
    td.setAttribute('class', 'cell-container');
    tr.appendChild(td);
    var img = document.createElement('img');
    var newCell = new Cell (cells.length, false);
    cells.push(newCell);
    img.setAttribute('class', 'unexplored');
    img.setAttribute('src', 'img/unexplored.png');
    img.setAttribute('id', cells.length - 1);
    td.appendChild(img);
    img.addEventListener('click', handleClick);
  }
}

function layMines() {
  for (var i = 0; i < mines; i++) {
    var where = Math.floor(Math.random() * (cells.length - 1) + 1);
    if (mineLocations.includes(where)) {
      i--;
    }
    else {
      cells[where].mine = true;
      mineLocations.push(where);
    }
  }
}

function checkNeighbor(cellInQuestion, neighborToCheck) {
  if (neighborToCheck.mine === true) {
    cellInQuestion.adjacentMines ++;
  }
}

function assignAdj() {
  //top left corner
  checkNeighbor(cells[1], cells[2]);
  checkNeighbor(cells[1], cells[1 + cols]);
  checkNeighbor(cells[1], cells[1 + cols + 1]);
  //top right corner
  checkNeighbor(cells[cols], cells[cols - 1]);
  checkNeighbor(cells[cols], cells[cols * 2]);
  checkNeighbor(cells[cols], cells[cols * 2 - 1]);
  //bottom left corner
  checkNeighbor(cells[cols * rows - cols + 1], cells[cols * rows - cols - cols + 1]);
  checkNeighbor(cells[cols * rows - cols + 1], cells[cols * rows - cols - cols + 2]);
  checkNeighbor(cells[cols * rows - cols + 1], cells[cols * rows - cols + 2]);
  //bottom right corner
  checkNeighbor(cells[rows * cols], cells[rows * cols - 1]);
  checkNeighbor(cells[rows * cols], cells[rows * cols - cols]);
  checkNeighbor(cells[rows * cols], cells[rows * cols - cols - 1]);
  //top edge
  for (var i = 2; i < cols; i++) {
    checkNeighbor(cells[i], cells[i - 1]);
    checkNeighbor(cells[i], cells[i + 1]);
    checkNeighbor(cells[i], cells[i + cols]);
    checkNeighbor(cells[i], cells[i + cols + 1]);
    checkNeighbor(cells[i], cells[i + cols - 1]);
  }
  //left edge
  for (var i = (cols + 1); i < (cols * rows - cols); i += cols) {
    checkNeighbor(cells[i], cells[i - cols]);
    checkNeighbor(cells[i], cells[i - cols + 1]);
    checkNeighbor(cells[i], cells[i + 1]);
    checkNeighbor(cells[i], cells[i + cols]);
    checkNeighbor(cells[i], cells[i + cols + 1]);
  }
  //bottom edge
  for (var i = (cols * rows - cols + 2); i < (cols * rows); i++) {
    checkNeighbor(cells[i], cells[i - 1]);
    checkNeighbor(cells[i], cells[i - cols - 1]);
    checkNeighbor(cells[i], cells[i - cols]);
    checkNeighbor(cells[i], cells[i - cols + 1]);
    checkNeighbor(cells[i], cells[i + 1]);
  }
  //right edge
  for (var i = (cols * 2); i < (cols * rows); i += cols) {
    checkNeighbor(cells[i], cells[i - cols]);
    checkNeighbor(cells[i], cells[i - cols - 1]);
    checkNeighbor(cells[i], cells[i - 1]);
    checkNeighbor(cells[i], cells[i + cols]);
    checkNeighbor(cells[i], cells[i + cols - 1]);
  }
  //every other cell
  for (var i = (cols + 2); i < (cols * rows - cols + 2); i += cols) {
    var currentCell = i;
    for (var j = currentCell; j < (currentCell + cols - 2); j++) {
      checkNeighbor(cells[j], cells[j - cols - 1]);
      checkNeighbor(cells[j], cells[j - cols]);
      checkNeighbor(cells[j], cells[j - cols + 1]);
      checkNeighbor(cells[j], cells[j - 1]);
      checkNeighbor(cells[j], cells[j + 1]);
      checkNeighbor(cells[j], cells[j + cols - 1]);
      checkNeighbor(cells[j], cells[j + cols]);
      checkNeighbor(cells[j], cells[j + cols + 1]);
    }
  }
  for (var i = 1; i < cells.length; i++) {
    var vastum = document.getElementById(i);
    vastum.innerText = cells[i].adjacentMines;
  }
}

function createMinefield() {
  for (var i = 0; i < rows; i++) {
    createRow();
  }
  layMines();
  assignAdj();
}

function offerNewGame() {
  var newGame = document.getElementById('reset');
  var button = document.createElement('input');
  button.setAttribute('type', 'submit');
  button.setAttribute('value', 'Play Again!');
  newGame.appendChild(button);
  newGame.addEventListener('submit', location.reload);
}

function win() {
  for (var i = 0; i < mines; i++) {
    var locatedMine = document.getElementById(mineLocations[i]);
    locatedMine.setAttribute('src', 'img/happy.png');
  }
  for (var i = 1; i < cells.length; i++) {
    var necrophagist = document.getElementById(i);
    necrophagist.removeEventListener('click', handleClick);
  }
  offerNewGame();
}

function lose() {
  event.preventDefault();
  event.target.setAttribute('src', 'img/dead.png');
  for (var i = 1; i < cells.length; i++) {
    var necrophagist = document.getElementById(i);
    necrophagist.removeEventListener('click', handleClick);
  }
  offerNewGame();
}

function handleClick(event) {
  if(cells[event.target.id].mine === true) {
    lose();
  }
  else {
    event.target.setAttribute('src', 'img/' + cells[parseInt(event.target.id)].adjacentMines + '.svg');
    explored ++;
    if (explored + mines === rows * cols) {
      win();
    }
  }
}

var submit = document.getElementById('form');
submit.addEventListener('submit', startGame);

function startGame() {
  event.preventDefault();
  rows = rows += parseInt(event.target.rowsInput.value);
  cols = cols += parseInt(event.target.colsInput.value);
  mines = mines += parseInt(event.target.minesInput.value);
  if(rows < 3 || cols < 3 || mines < 1 || (rows * cols < mines || rows > 10 || cols > 10)) {
    alert('INVALID!');
    location.reload();
  } else {
    createMinefield();
    var remove = document.getElementById('remove');
    var submit = document.getElementById('submit');
    remove.removeChild(submit);
  }
}
