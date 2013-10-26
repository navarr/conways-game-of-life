/**
 * Settings!
 * @type {{boardSize: number, loopInterval: number}}
 */
var settings = {
    boardSize: 25,
    loopInterval: 100,
    interactiveDuringLoop: false
};

var life = new LifeGameBoard(settings.boardSize);
var setupTable = function(containerId) {
    var container = document.getElementById(containerId);
    console.log(containerId, container);
    var table = document.createElement('table');
    table.setAttribute('id', 'life-table');

    var board = life.getBoard();
    for (var row = 0, rows = board.length; row < rows; ++row) {
        var tr = document.createElement('tr');
        tr.setAttribute('id', 'life-table-row-' + row);
        tr.setAttribute('class', 'life-table-row');

        for (var col = 0, cols = board[row].length; col < cols; ++col) {
            var td = document.createElement('td');
            td.setAttribute('id', 'life-table-cell-' + row + '-' + col);
            td.setAttribute('class', 'life-table-cell');
            td.dataset.row = row;
            td.dataset.col = col;
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
    container.appendChild(table);
};
var doRenderLoop = function() {
    var board = life.getBoard();
    // Render rows
    for (var row = 0, rows = board.length; row < rows; ++row) {
        for (var col = 0, cols = board[row].length; col < cols; ++col) {
            var ele = document.getElementById('life-table-cell-' + row + '-' + col);
            if (board[row][col]) {
                ele.style.backgroundColor = 'black';
            } else {
                ele.style.backgroundColor = 'white';
            }
        }
    }
};
var renderNextBoardDiff = function() {
    var board = life.getBoard();
    var nextBoard = life.getNextBoard();

    for (var row = 0, rows = board.length; row < rows; ++row) {
        for (var col = 0, cols = board[row].length; col < cols; ++col) {
            var ele = document.getElementById('life-table-cell-' + row + '-' + col);
            var currentBoardStatus = board[row][col];
            var nextBoardStatus = nextBoard[row][col];
            if (nextBoardStatus && !currentBoardStatus) {
                ele.style.backgroundColor = 'green';
            } else if(currentBoardStatus && !nextBoardStatus) {
                ele.style.backgroundColor = 'red';
            }
        }
    }
};
var loopTimeout;
var timeBetweenLoops = settings.loopInterval;
var doOneLoop = function() {
    life.iterate();
    life.commit();
    doRenderLoop();
};
var doOneDiffLoop = function() {
    life.commit();
    doRenderLoop();
    life.iterate();
    renderNextBoardDiff();
};
var clearLoop = function() {
    if (loopTimeout) {
        clearTimeout(loopTimeout);
    }
    loopTimeout = null;
};
var startLooping = function() {
    clearLoop();
    loopTimeout = setTimeout(function() {
        doOneLoop();
        startLooping();
    }, timeBetweenLoops);
};
var stopLooping = function() {
    clearLoop();
};

// End Library Functions

setupTable('lifeContainer');
var canPlace = true;
document.getElementById('startLoop').onclick = function() {
    var element = document.getElementById('startLoop');
    if (parseInt(element.dataset.running, 10)) {
        stopLooping();
        element.innerText = 'Start';
        element.dataset.running = 0;
        canPlace = true;
    } else {
        startLooping();
        element.innerText = 'Stop';
        element.dataset.running = 1;
        canPlace = false;
    }
};
document.getElementsByTagName('table')[0].addEventListener('click', function(event) {
    var elementClicked = event.toElement;
    if (canPlace || settings.interactiveDuringLoop) {
        var row = parseInt(elementClicked.dataset.row, 10);
        var col = parseInt(elementClicked.dataset.col, 10);
        if (life.getStatus(row, col)) {
            life.markDead(row, col);
        } else {
            life.markLiving(row, col);
        }
        life.commit();
        doRenderLoop();
    }
});