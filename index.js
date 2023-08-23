const playerFactory = function (playerMark) {
    const playerSign = playerMark;
    const getSign = () => playerSign;
    return { getSign }
}

const gameBoard = (() => {
    // const boardSize = 3;
    // const board = new Array(boardSize * boardSize).fill(null);
    const board = 
    ["x", "o", "",
     "", "", "",
     "", "", ""]

    const getBoard = () => {
       return board;
    }

    const placeMarker = (index, marker) => {
        if (index >= 0 && index < board.length && board[index] === null) {
            board[index] = marker;
        }
    }

    const getMarker = (index) => {
        return index > board.length ? undefined : board[index];
    }

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    }

    return { getBoard, placeMarker, getMarker, resetBoard }
})();

const gameController = (() => {
    playerX = playerFactory('x');
    playerO = playerFactory('o');
    const cells = document.querySelectorAll(".cell");
    const cellsArray = Array.from(cells)

    const gameOver = () => {
        return gameBoard.getBoard().every(value => value !== null);
    };

    const updateBoard = () => {
        for (let i = 0; i < cellsArray.length; i++) {
            const marker = gameBoard.getBoard()[i]
            if (gameBoard.getBoard()[i] !== "") {
                cellsArray[i].classList.add(marker)
            }
        }
    }

    return { updateBoard }
})();

gameController.updateBoard()