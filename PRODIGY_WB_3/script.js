document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const restartBtn = document.getElementById("restartBtn");
    const gameBoard = document.getElementById("gameBoard");
    const message = document.getElementById("message");
    const playerToggle = document.getElementById("playerToggle");
    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let isPlayerVsAI = false;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (e) => {
        const cell = e.target;
        const index = cell.getAttribute("data-index");

        if (gameState[index] !== "" || !checkGameActive()) {
            return;
        }

        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(`player${currentPlayer}`);

        if (checkWinner()) {
            showMessage(`Player ${currentPlayer} wins!`);
            gameBoard.classList.add("game-over");
            return;
        }

        if (!gameState.includes("")) {
            showMessage("It's a draw!");
            gameBoard.classList.add("game-over");
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (isPlayerVsAI && currentPlayer === "O") {
            makeAIMove();
        }
    };

    const checkWinner = () => {
        return winningConditions.some((condition) => {
            const [a, b, c] = condition;
            return gameState[a] === currentPlayer &&
                   gameState[a] === gameState[b] &&
                   gameState[a] === gameState[c];
        });
    };

    const checkGameActive = () => {
        return !gameBoard.classList.contains("game-over");
    };

    const restartGame = () => {
        gameState = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("playerX", "playerO");
        });
        gameBoard.classList.remove("game-over");
        hideMessage();
    };

    const showMessage = (msg) => {
        message.textContent = msg;
        message.classList.add("show");
    };

    const hideMessage = () => {
        message.classList.remove("show");
        message.classList.add("hidden");
    };

    const makeAIMove = () => {
        let madeMove = false;

        const winOrBlock = (player) => {
            for (let [a, b, c] of winningConditions) {
                if (gameState[a] === player && gameState[b] === player && gameState[c] === "") {
                    gameState[c] = "O";
                    cells[c].textContent = "O";
                    cells[c].classList.add("playerO");
                    madeMove = true;
                    break;
                }
                if (gameState[a] === player && gameState[c] === player && gameState[b] === "") {
                    gameState[b] = "O";
                    cells[b].textContent = "O";
                    cells[b].classList.add("playerO");
                    madeMove = true;
                    break;
                }
                if (gameState[b] === player && gameState[c] === player && gameState[a] === "") {
                    gameState[a] = "O";
                    cells[a].textContent = "O";
                    cells[a].classList.add("playerO");
                    madeMove = true;
                    break;
                }
            }
        };

        winOrBlock("O");

        if (!madeMove) {
            winOrBlock("X");
        }

        if (!madeMove) {
            let emptyCells = [];
            gameState.forEach((cell, index) => {
                if (cell === "") {
                    emptyCells.push(index);
                }
            });
            if (emptyCells.length > 0) {
                let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                gameState[randomIndex] = "O";
                cells[randomIndex].textContent = "O";
                cells[randomIndex].classList.add("playerO");
            }
        }

        if (checkWinner()) {
            showMessage("Player O (AI) wins!");
            gameBoard.classList.add("game-over");
            return;
        }

        if (!gameState.includes("")) {
            showMessage("It's a draw!");
            gameBoard.classList.add("game-over");
            return;
        }

        currentPlayer = "X";
    };

    playerToggle.addEventListener("change", () => {
        isPlayerVsAI = playerToggle.checked;
        restartGame();
    });

    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });

    restartBtn.addEventListener("click", restartGame);
});
