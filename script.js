let gameMode = null;
let currentPlayer = "X";
let startingPlayer = "X"; 
let board = ["", "", "", "", "", "", "", "", ""];
let player1Name = "Player 1";
let player2Name = "Player 2";
let player1Score = 0;
let player2Score = 0;
let isVsComputer = false;

const cells = document.querySelectorAll(".ttt-cell");
const turnIndicator = document.getElementById("turn-indicator");
const p1ScoreDisplay = document.getElementById("p1-score");
const p2ScoreDisplay = document.getElementById("p2-score");
const banner = document.getElementById("winner-banner");

// Go home button
function goHome() {
    // Resetting UI
    document.getElementById("home-screen").style.display = "block";
    document.getElementById("name-input-screen").style.display = "none";
    document.getElementById("tic-grid").style.display = "none";
    document.getElementById("turn-indicator").style.display = "none";
    document.getElementById("p1-score").style.display = "none";
    document.getElementById("p2-score").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";
    document.getElementById("back-home").style.display = "none";
    banner.style.display = "none";

    // Resetting game state
    player1Score = 0;
    player2Score = 0;
    player1Name = "Player 1";
    player2Name = "Player 2";
    startingPlayer = "X"; 
    updateScoreText();
    resetBoard();
}

function selectMode(mode) {
    gameMode = mode;
    document.getElementById("home-screen").style.display = "none";
    document.getElementById("name-input-screen").style.display = "block";

    const nameFields = document.getElementById("name-fields");
    nameFields.innerHTML = "";

    if (mode === "pvp") {
        nameFields.innerHTML = `
            <input id="player1" placeholder="Player X Name" style="border-color: #ff4ced;" />
            <input id="player2" placeholder="Player O Name" />
        `;
        isVsComputer = false;
    } else {
        nameFields.innerHTML = `<input id="player1" placeholder="Your Name" />`;
        isVsComputer = true;
    }
}

function startGame() {
    const name1 = document.getElementById("player1").value || "Player 1";
    const name2 = isVsComputer ? "Computer" : (document.getElementById("player2")?.value || "Player 2");

    player1Name = name1;
    player2Name = name2;

    resetBoard();

    document.getElementById("name-input-screen").style.display = "none";
    document.getElementById("tic-grid").style.display = "grid";
    document.getElementById("turn-indicator").style.display = "block";
    document.getElementById("p1-score").style.display = "block";
    document.getElementById("p2-score").style.display = "block";
    document.getElementById("restart-btn").style.display = "block";
    document.getElementById("back-home").style.display = "inline-block";

    updateTurnText();
    updateScoreText();
}

function updateTurnText() {
    turnIndicator.textContent = `${currentPlayer === "X" ? player1Name : player2Name}'s Turn`;
}

function updateScoreText() {
    p1ScoreDisplay.innerHTML = `<p>${player1Name} Score: ${player1Score}</p>`;
    p2ScoreDisplay.innerHTML = `<p>${player2Name} Score: ${player2Score}</p>`;
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = startingPlayer;

    cells.forEach(cell => {
        cell.textContent = "?";
        cell.classList.remove("played-x", "played-o");
        cell.disabled = false;
    });

    updateTurnText();
}

function checkWinner() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes("")) return "draw";
    return null;
}

function showWinnerBanner(message) {
    banner.textContent = message;
    banner.style.display = "block";
    banner.classList.remove("fade-in");
    void banner.offsetWidth;
    banner.classList.add("fade-in");

    setTimeout(() => {
        banner.style.display = "none";
    }, 1800);
}

function handleClick(index) {
    if (board[index] !== "") return;

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer === "X" ? "played-x" : "played-o");
    cells[index].disabled = true;

    const result = checkWinner();
    if (result) {
        if (result === "draw") {
            showWinnerBanner("🤝 It's a Draw!");
        } else {
            if (result === "X") player1Score++;
            else player2Score++;

            const winnerName = result === "X" ? player1Name : player2Name;
            showWinnerBanner(`🎉 ${winnerName} Wins! 🎉`);
        }

        updateScoreText();
        startingPlayer = startingPlayer === "X" ? "O" : "X"; // 
        setTimeout(resetBoard, 2000);
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnText();

    if (isVsComputer && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let available = board
        .map((val, idx) => val === "" ? idx : null)
        .filter(v => v !== null);

    let move = available[Math.floor(Math.random() * available.length)];
    handleClick(move);
}

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleClick(index));
});

document.getElementById("btn-restart").addEventListener("click", resetBoard);

//Initializing
goHome();
