// --- Logik Mini Game Tic-Tac-Toe (Versi AI & Efek Menang) ---
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function toggleMode() {
    let mode = document.getElementById("modeSelect").value;
    let diffSelect = document.getElementById("diffSelect");
    if (mode === "pve") {
        diffSelect.style.display = "block";
    } else {
        diffSelect.style.display = "none";
    }
    resetGame();
}

function makeMove(index) {
    if (board[index] === "" && gameActive) {
        // Gerakan Pemain
        executeMove(index, currentPlayer);
        
        let winResult = checkWin(board);
        if (winResult) {
            handleWin(winResult.winner, winResult.combo);
            return;
        }
        if (!board.includes("")) {
            handleDraw();
            return;
        }

        // Tukar Giliran
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        document.getElementById("statusText").innerText = "Giliran: Pemain " + currentPlayer;

        // Gerakan AI (Kalau mode PvE dan giliran O)
        let mode = document.getElementById("modeSelect").value;
        if (mode === "pve" && currentPlayer === "O" && gameActive) {
            setTimeout(aiMove, 400); // Delay sikit nampak macam AI tengah fikir
        }
    }
}

function executeMove(index, player) {
    board[index] = player;
    let cell = document.getElementsByClassName("cell")[index];
    cell.innerText = player;
    cell.classList.add(player === "X" ? "x-mark" : "o-mark");
}

function aiMove() {
    let diff = document.getElementById("diffSelect").value;
    let moveIndex;

    if (diff === "easy") {
        // Easy: Pilih kotak kosong secara rawak
        let emptyCells = [];
        for (let i = 0; i < board.length; i++) if (board[i] === "") emptyCells.push(i);
        moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } 
    else if (diff === "medium") {
        // Medium: Cuba menang atau block player, kalau takde, gerak rawak
        moveIndex = getMediumMove();
    } 
    else {
        // Hard: Algoritma Minimax (Mesti seri atau AI menang)
        moveIndex = getBestMove();
    }

    makeMove(moveIndex);
}

// Logik AI Sederhana
function getMediumMove() {
    for (let i = 0; i < winConditions.length; i++) {
        let [a, b, c] = winConditions[i];
        // Check kalau boleh menang
        if (board[a] === "O" && board[b] === "O" && board[c] === "") return c;
        if (board[a] === "O" && board[c] === "O" && board[b] === "") return b;
        if (board[b] === "O" && board[c] === "O" && board[a] === "") return a;
    }
    for (let i = 0; i < winConditions.length; i++) {
        let [a, b, c] = winConditions[i];
        // Check kalau kena block player X
        if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
        if (board[a] === "X" && board[c] === "X" && board[b] === "") return b;
        if (board[b] === "X" && board[c] === "X" && board[a] === "") return a;
    }
    // Kalau takde ancaman, gerak random
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) if (board[i] === "") emptyCells.push(i);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Logik AI Susah (Minimax)
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

let scores = { "O": 10, "X": -10, "tie": 0 };

function minimax(newBoard, depth, isMaximizing) {
    let result = checkWin(newBoard);
    if (result) return scores[result.winner];
    if (!newBoard.includes("")) return scores["tie"];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "O";
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === "") {
                newBoard[i] = "X";
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(currentBoard) {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
            return { winner: currentBoard[a], combo: [a, b, c] };
        }
    }
    return null;
}

function handleWin(winner, combo) {
    document.getElementById("statusText").innerText = "Pemain " + winner + " Menang!";
    document.getElementById("statusText").style.color = "#22c55e"; // Warna hijau
    gameActive = false;
    
    let cells = document.getElementsByClassName("cell");
    combo.forEach(index => {
        cells[index].classList.add("win-circle");
    });
}

function handleDraw() {
    document.getElementById("statusText").innerText = "Game Seri!";
    document.getElementById("statusText").style.color = "#e67e22";
    gameActive = false;
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    document.getElementById("statusText").innerText = "Giliran: Pemain X";
    document.getElementById("statusText").style.color = "#1e293b";
    
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].classList.remove("x-mark", "o-mark", "win-circle");
    }
}

// --- Logik Form Validation (Kekalkan yang ni) ---
function validateForm() {
    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let dob = document.getElementById("dob").value;
    let gender = document.getElementById("gender").value;
    let photo = document.getElementById("photo").value;
    let terms = document.getElementById("terms").checked;
    let errorMsg = document.getElementById("error-message");

    if (fullname === "" || email === "" || password === "" || dob === "" || gender === "" || photo === "") {
        errorMsg.innerHTML = "Sila isikan semua maklumat yang wajib!";
        return false;
    }

    if (!terms) {
        errorMsg.innerHTML = "Anda mesti bersetuju dengan terma dan syarat!";
        return false;
    }

    alert("Terima kasih " + fullname + "! Mesej anda berjaya dihantar.");
    return true; 
}