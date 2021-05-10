class Cell {
    constructor(isOpen, val) {
        this.isOpen = isOpen;
        this.val = val;
    }
    toString() {
        return this.val;
    }
    valueOf() {
        return this.val;
    }

}


const generateBoard = (rows, cols, mines) => {
    let board = [...new Array(rows)].map(_ => new Array(cols).fill(undefined));
    board = board.map(arr => {
        return arr.map(el => new Cell(false, 0))
    });
    while (mines > 0) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (board[row][col].val !== -1) {
            board[row][col].val = -1;

            if (row > 0 && board[row - 1][col].val !== -1) {
                board[row - 1][col].val++;
            }
            if (col > 0 && board[row][col - 1].val !== -1) {
                board[row][col - 1].val++;
            }

            if (row < rows - 1 && board[row + 1][col].val !== -1) {
                board[row + 1][col].val++;
            }
            if (col < cols - 1 && board[row][col + 1].val !== -1) {
                board[row][col + 1].val++;
            }


            if (row > 0 && col > 0 && board[row - 1][col - 1].val !== -1) {
                board[row - 1][col - 1].val++;
            }
            if (row < rows - 1 && col < cols - 1 && board[row + 1][col + 1].val !== -1) {
                board[row + 1][col + 1].val++;
            }

            if (row > 0 && col < cols - 1 && board[row - 1][col + 1].val !== -1) {
                board[row - 1][col + 1].val++;
            }
            if (row < rows - 1 && col > 0 && board[row + 1][col - 1].val !== -1) {
                board[row + 1][col - 1].val++;
            }

            mines -= 1;
        }
    }

    return board;
}

exports.generateBoard = generateBoard;