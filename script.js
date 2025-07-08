let gameMode = null;
let currentPlayer = "X";
let startingPlayer = "X"; 
let board = ["", "", "", "", "", "", "", "", ""];
let player1Name = "Player 1";
let player2Name = "Player 2";
let player1Score = 0;
let player2Score = 0;
let isVsComputer = false;
let timerInterval = null;
let timerStatus = "stopped";
let seconds = 0;
let minutes = 0;
let leadingSeconds = "0";
let leadingMinutes = "0";
let allowSound = true;

//all sounds are sourced from the internet, copyright free! -music by AGS_project
//audio files
const clickSound = new Audio('audio-files/mouse-click-290204.mp3');
const gameMusic = new Audio('audio-files/8-bit-219384.mp3');
const homeMusic = new Audio('audio-files/pixel-dreams-259187.mp3');
const audioPopup = document.getElementById("audio-popup");

gameMusic.loop = true;
gameMusic.volume = 0.6;
homeMusic.loop = true;
homeMusic.volume = 0.4;

document.querySelector("#sound-btn").addEventListener("click", () => {
    allowSound = !allowSound;
    soundHandler();
    const message = allowSound ? "🔊 Audio is ON" : "🔇 Audio is OFF";
    showAudioPopup(message);
})
function showAudioPopup(message) {
    audioPopup.textContent = message;
    audioPopup.classList.add("show");

    setTimeout(() => {
        audioPopup.classList.remove("show");
    }, 800);
}
const cells = document.querySelectorAll(".ttt-cell");
const turnIndicator = document.getElementById("turn-indicator");
const p1ScoreDisplay = document.getElementById("p1-score");
const p2ScoreDisplay = document.getElementById("p2-score");
const p1TableName = document.getElementById("tFirstP");
const p2TableName = document.getElementById("tSecondP");
const p1TableScore = document.getElementById("p1-total");
const p2TableScore = document.getElementById("p2-total");
const banner = document.getElementById("winner-banner");

//sound settings
function soundHandler() {
    if (allowSound) {
        gameMusic.play();
    } else {
        gameMusic.pause();
        homeMusic.pause();
    }
}
function playClickSound() {
    if (allowSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

// Go home button on the game page
function goHome() {
    //initializing audio
    if(allowSound){
        homeMusic.play();
        gameMusic.pause();
    }
    // Resetting UI
    document.getElementById("home-screen").style.display = "block";
    document.getElementById("name-input-screen").style.display = "none";
    document.getElementById("tic-grid").style.display = "none";
    document.getElementById("turn-indicator").style.display = "none";
    document.getElementById("p1-score").style.display = "none";
    document.getElementById("p2-score").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";
    document.getElementById("timer-container").style.display = "none";
    document.getElementById("score-tracker").style.display = "none";
    document.getElementById("game-options").style.display = "none";
    banner.style.display = "none";

    // Resetting game state
    player1Score = 0;
    player2Score = 0;
    player1Name = "Player 1";
    player2Name = "Player 2";
    startingPlayer = "X"; 
    updateScoreText();
    resetBoard();
    resetScoreboard();
}

//For the home page buttons, comp mode or pvp mode
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
        let namePrompt = document.querySelector("#prompt")
        namePrompt.textContent = "Enter player name"
        nameFields.innerHTML = `<input id="player1" placeholder="Your Name" />`;
        isVsComputer = true;
    }
}

// Game begins... setting up the board
function startGame() {
    soundHandler();
    timerInterval = window.setInterval(gameTimer,1000);
    const name1 = document.getElementById("player1").value || "Player 1";
    const name2 = isVsComputer ? "Computer" : (document.getElementById("player2")?.value || "Player 2");

    player1Name = name1;
    player2Name = name2;
    p1TableName.textContent = `${name1}`;
    p2TableName.textContent = `${name2}`;

    resetBoard();
    homeMusic.pause();
    document.getElementById("name-input-screen").style.display = "none";
    document.getElementById("tic-grid").style.display = "grid";
    document.getElementById("turn-indicator").style.display = "block";
    document.getElementById("p1-score").style.display = "block";
    document.getElementById("p2-score").style.display = "block";
    document.getElementById("restart-btn").style.display = "block";
    document.getElementById("timer-container").style.display = "flex";
    document.getElementById("score-tracker").style.display = "block";
    document.getElementById("game-options").style.display = "flex";

    updateTurnText();
    updateScoreText();
}

//game timer
function gameTimer(){
  seconds++;
  if(seconds==60)
  {
    minutes++;
    seconds = 0
  }
  seconds<10 ? leadingSeconds = "0" + seconds : leadingSeconds = seconds;
  minutes<10 ? leadingMinutes = "0" + minutes : leadingMinutes = minutes;

  let clock = document.getElementById("timer");
  clock.textContent = `${leadingMinutes}:${leadingSeconds}`;
}
//resetting game timer
function resetTimer(){
    seconds = 0;
    minutes = 0;
    document.getElementById("timer").textContent = "00:00";
}

//restarting the game
function restartGame(){
    currentPlayer = "X";
    updateTurnText();

    player1Score = 0;
    player2Score = 0;
    updateScoreText();

    resetBoard();
    resetScoreboard();
}
//Player turns updates
function updateTurnText() {
    turnIndicator.textContent = `${currentPlayer === "X" ? player1Name : player2Name}'s Turn`;
}

//Score updates
function updateScoreText() {
    p1ScoreDisplay.innerHTML = `<p>${player1Name} Score: ${player1Score}</p>`;
    p2ScoreDisplay.innerHTML = `<p>${player2Name} Score: ${player2Score}</p>`;
}

//Board resets after every round
function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = startingPlayer;

    cells.forEach(cell => {
        cell.textContent = "?";
        cell.classList.remove("played-x", "played-o");
        cell.disabled = false;
    });

    setTimeout(resetTimer,500);
    updateTurnText();

    if (isVsComputer && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

// checking for game outcome
function checkWinner() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            updateScoreboard(board[a]);
            return board[a];
        }
    }

    if (!board.includes(""))
        {
            updateScoreboard("draw");
            return "draw";
        } 
    return null;
}

//scoreboard update
let p1Win = 0;
let p1Loss = 0;
let p1Draw = 0;
let p2Win = 0;
let p2Loss = 0;
let p2Draw = 0;
function updateScoreboard(result){
    if (result === "X")
    {
        p1Win++;
        p2Loss++;
        p1TableScore.textContent = `W: ${p1Win} | D: ${p1Draw} | L: ${p1Loss}`
        p2TableScore.textContent = `W: ${p2Win} | D: ${p2Draw} | L: ${p2Loss}`
    }
    else if (result === "O")
    {
        p2Win++;
        p1Loss++;
        p1TableScore.textContent = `W: ${p1Win} | D: ${p1Draw} | L: ${p1Loss}`
        p2TableScore.textContent = `W: ${p2Win} | D: ${p2Draw} | L: ${p2Loss}`
    }
    else
    {
        p1Draw++;
        p2Draw++;
        p1TableScore.textContent = `W: ${p1Win} | D: ${p1Draw} | L: ${p1Loss}`
        p2TableScore.textContent = `W: ${p2Win} | D: ${p2Draw} | L: ${p2Loss}`
    }
}
//resetting scoreboard
function resetScoreboard(){
    p1Win = 0;
    p1Loss = 0;
    p1Draw = 0;
    p2Win = 0;
    p2Loss = 0;
    p2Draw = 0;

    p1TableScore.textContent = `W: ${p1Win} | D: ${p1Draw} | L: ${p1Loss}`
    p2TableScore.textContent = `W: ${p2Win} | D: ${p2Draw} | L: ${p2Loss}`
}

// Banner for game outcome
function showWinnerBanner(message) {
    window.clearInterval(timerInterval);
    banner.textContent = message;
    banner.style.display = "block";
    banner.classList.remove("fade-in");
    void banner.offsetWidth;
    banner.classList.add("fade-in");

    setTimeout(() => {
        banner.style.display = "none";
    }, 1800);

    setTimeout(()=>{
        timerInterval = window.setInterval(gameTimer,1000);
    },2500);
}

function setBoardInteractivity(enabled) {
    cells.forEach(cell => {
        cell.disabled = !enabled || cell.textContent !== "?";
    });
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
        setBoardInteractivity(false);
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let available = board
        .map((val, idx) => val === "" ? idx : null)
        .filter(v => v !== null);

    let move = available[Math.floor(Math.random() * available.length)];
    handleClick(move);
    setBoardInteractivity(true);
}


cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        handleClick(index);
        playClickSound();
    });
});

document.getElementById("btn-restart").addEventListener("click", resetBoard);

//Initializing
goHome();
