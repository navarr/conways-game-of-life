LifeGameBoard = function(size) {
    /**
     * An array containing the rows and columns.
     * A zero in a space indicates a non-living cell.
     * A one i a space indiciates a living cell.
     * @type {Array}
     */
    this.board = [];

    /**
     * NextBoard is a copy of board, represeting the next
     * state of the LifeGameBoard.  This board will replace this.board
     * when .commit is called.
     * @type {Array}
     */
    this.nextBoard = null;

    for (var i = 0;i < size; ++i) {
        this.board[i] = [];
        for (var j = 0; j < size; ++j) {
            this.board[i][j] = 0;
        }
    }

    this.populateNextBoard();
};
LifeGameBoard.prototype.populateNextBoard = function() {
    this.nextBoard = [];
    for(var i = 0, l = this.board.length; i < l; ++i) {
        this.nextBoard[i] = [];
        for (var j = 0, m = this.board.length; j < m; ++j) {
            this.nextBoard[i][j] = this.board[i][j];
        }
    }
};
LifeGameBoard.prototype.iterate = function() {
    this.populateNextBoard();

    var lifeGameBoard = this;
    var getLivingNeighbors = function(x, y) {
        var livingNeighbors = 0;
        var neighbors = [
            [x-1, y-1],
            [x, y-1],
            [x+1, y-1],
            [x-1, y],
            [x+1, y],
            [x-1, y+1],
            [x, y+1],
            [x+1, y+1]
        ];
        neighbors.forEach(function(value, index, ra) {
            // Detect if its a valid coordinate first
            if (value[0] < 0 || value[1] < 0) {
                // Continue to next value if either coordinate is less than zero
                return;
            }
            if (value[0] >= lifeGameBoard.board.length || value[1] >= lifeGameBoard.board.length) {
                // Continue if the coordinate is greater than the board size
                return;
            }
            if (lifeGameBoard.getStatus(value[0], value[1])) {
                livingNeighbors++;
            }
        });
        return livingNeighbors;
    };
    for (var row = 0, rows = lifeGameBoard.board.length; row < rows; ++row) {
        for (var col = 0, cols = lifeGameBoard.board[row].length; col < cols; ++col) {
            var neighbors = getLivingNeighbors(row, col);

            switch (true) {
                case (lifeGameBoard.getStatus(row, col) && (neighbors < 2 || neighbors > 3)):
                    // If Alive and has less than two neighbors, kill from starvation
                    // If Alive and has three neighbors, kill from overcrowding
                    lifeGameBoard.markDead(row, col);
                    break;
                // status true and neighbors is 2 or 3, stays alive
                case (!lifeGameBoard.getStatus(row, col) && neighbors == 3):
                    // If Dead and has three neighbors, bring to life via reproduction
                    lifeGameBoard.markLiving(row, col);
                    break;
            }
        }
    }
};
LifeGameBoard.prototype.markLiving = function(x, y) {
    this.nextBoard[x][y] = 1;
};
LifeGameBoard.prototype.markDead = function(x, y) {
    this.nextBoard[x][y] = 0;
};
LifeGameBoard.prototype.getStatus = function(x, y) {
    return this.board[x][y];
}
LifeGameBoard.prototype.commit = function() {
    delete this.board;
    this.board = this.nextBoard;
    this.populateNextBoard();
};
LifeGameBoard.prototype.getBoard = function() {
    var tempBoard = [];
    for (var i = 0, l = this.board.length; i < l; ++i) {
        tempBoard[i] = [];
        for (var j = 0, m = this.board[i].length; j < m; ++j) {
            tempBoard[i][j] = this.board[i][j];
        }
    }
    return tempBoard;
};
LifeGameBoard.prototype.getNextBoard = function() {
    var tempBoard = [];
    for (var row = 0, rows = this.nextBoard.length; row < rows; ++row) {
        tempBoard[row] = [];
        for (var col = 0, cols = this.board[row].length; col < cols; ++col) {
            tempBoard[row][col] = this.nextBoard[row][col];
        }
    }
    return tempBoard;
};