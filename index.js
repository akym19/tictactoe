const playerFactory = function (playerMark) {
    const playerSign = playerMark;
    const getSign = () => playerSign;
    return { getSign }
}

const gameBoard = (() => {
    const boardSize = 3;
    const board = new Array(boardSize * boardSize).fill("");
    // const board = 
    // ["x", "o", "x",
    //  "o", "", "",
    //  "", "", ""]

    const getBoard = () => {
       return board;
    }

    const placeMarker = (index, marker) => {
        if (index >= 0 && index < board.length && board[index] === "") {
            board[index] = marker;
        }
    }

    const getMarker = (index) => {
        return index > board.length ? undefined : board[index];
    }

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    return { getBoard, placeMarker, getMarker, resetBoard }
})();

const gameController = (() => {
    const playerX = playerFactory('x');
    const playerO = playerFactory('o');
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

    const checkSign = () => {
        const round = gameBoard.getBoard().reduce((count, value) => value === "" ? count + 1 : count, 0);
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    const checkDraw = () => {
        return gameBoard.getBoard().every(value => value !== "");
    };

    const checkWin = (currentSign) => {
        return winCombos.some(combos => {
            return combos.every(index => {
                return gameBoard.getBoard()[index] === currentSign;
            });
        });
    };

    return { checkSign, checkWin, checkDraw }
})();

const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const cellsArray = Array.from(cells);
    const gameBoardElement = document.getElementById("gameBoard");

    const updateBoard = () => {
        for (let i = 0; i < cellsArray.length; i++) {
            const marker = gameBoard.getBoard()[i];
            cellsArray[i].classList.remove('x', 'o'); // Remove existing classes
            if (marker !== "") {
                cellsArray[i].classList.add(marker);
            }
        }
        const currentSign = gameController.checkSign();
        gameBoardElement.classList.remove('x', 'o');
        gameBoardElement.classList.add(currentSign);
    }

    let gameOver = false;

    const placeMark = () => {
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (gameOver) return;

                let cellIndex = cell.getAttribute('data-index');
                let currentSign = gameController.checkSign()
                gameBoard.placeMarker(cellIndex, currentSign);
                updateBoard();
                if (gameController.checkWin(currentSign)) {
                    gameOver = true;
                    console.log (`Player ${currentSign.toUpperCase()} wins!`);
                    return;
                };
                if (gameController.checkDraw()){
                    gameOver = true;
                    console.log("Draw!");
                }
            })
        })
    }

    return { placeMark };
})();

displayController.placeMark();