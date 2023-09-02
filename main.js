const playerFactory = function (playerMark) {
    const playerSign = playerMark;
    const getSign = () => playerSign;
    return { getSign }
}

const gameBoard = (() => {
    const boardSize = 3;
    const board = Array(boardSize * boardSize).fill("");

    const getBoard = () => board;

    const placeMarker = (index, marker) => {
        if (index >= 0 && index < board.length && board[index] === "") {
            board[index] = marker;
        }
    }

    const resetBoard = () => board.fill("");

    return { getBoard, placeMarker, resetBoard }
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
        return !gameBoard.getBoard().includes("");
    };

    const checkWin = (currentSign) => {
        return winCombos.some(combos => {
            return combos.every(index => {
                return gameBoard.getBoard()[index] === currentSign;
            });
        });
    };

    const makeAImove = () => {
        const board = gameBoard.getBoard();
        const blanks = [];
        board.forEach((element, index) => {
            if (element === '') {
                blanks.push(index);
            }
          });
        const random = Math.floor(Math.random() * blanks.length);
        return blanks[random];
    }

    return { checkSign, checkWin, checkDraw, makeAImove }
})();

const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const cellsArray = Array.from(cells);
    const gameBoardElement = document.getElementById("gameBoard");
    const startGame = document.querySelectorAll('.startGame');
    const container = document.getElementById('container');
    const modal = document.getElementById('modal');
    const messageDiv = document.getElementById('results');
    const messageElem = document.getElementById('resultsMessage');
    const resetButton = document.getElementById('reset');

    const playAgain = () => {
        gameOver = false;
        gameBoard.resetBoard();
        messageDiv.classList.toggle('active');
        updateBoard();
    }

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
    let aI = false;

    const placeMark = () => {
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (gameOver) return;
    
                let cellIndex = cell.getAttribute('data-index');
                let currentSign = gameController.checkSign();
                gameBoard.placeMarker(cellIndex, currentSign);
                updateBoard();
    
                if (gameController.checkWin(currentSign)) {
                    gameOver = true;
                    messageDiv.classList.toggle('active');
                    messageElem.textContent = `Player ${currentSign.toUpperCase()} wins!`;
                    return;
                }
    
                if (gameController.checkDraw()) {
                    gameOver = true;
                    messageDiv.classList.toggle('active');
                    messageElem.textContent = "Draw!";
                    return;
                }
    
                // After the player's move, check if the game is still ongoing
                if (!gameOver && aI) {
                    setTimeout(() => {
                        currentSign = gameController.checkSign();
                        gameBoard.placeMarker(gameController.makeAImove(), currentSign);
                        updateBoard();
    
                        if (gameController.checkWin(currentSign)) {
                            gameOver = true;
                            messageDiv.classList.toggle('active');
                            messageElem.textContent = `Player ${currentSign.toUpperCase()} wins!`;
                        }
                    }, 1000);
                }
            });
        });
    }

    const toggle = () => {
        container.classList.toggle('hidden');
        modal.classList.toggle('active');
    }

    const initializeGame = (e) => {
        toggle();
        placeMark();
        if (e.target.id === "vsAI") {
            aI = true;
        }
    };

    Array.from(startGame).forEach(startBtn => {
        startBtn.addEventListener('click', initializeGame)
    });
    resetButton.addEventListener('click', playAgain);
})();