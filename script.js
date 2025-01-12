let clickCount = 0;
let playerName = '';
let playerNameSet = false;
let numberToGuess = Math.floor(Math.random() * 100) + 1;
let guessAttempts = 0;

// Load click count from localStorage
function loadClickCount() {
    const savedClickCount = localStorage.getItem('clickCount');
    if (savedClickCount !== null) {
        clickCount = parseInt(savedClickCount, 10);
        if (isNaN(clickCount)) clickCount = 0;
    }
    updateCounterDisplay();
}

// Update counter display
function updateCounterDisplay() {
    document.getElementById('counter').innerText = `Clicks: ${clickCount}`;
}

// Rock, Paper, Scissors Game Logic
function playGame(playerChoice) {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the game:");
        playerNameSet = true;
    }

    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result = '';

    if (playerChoice === computerChoice) {
        result = 'It\'s a tie!';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = `You win! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}.`;
        saveScore('Rock, Paper, Scissors', 1);
    } else {
        result = `You lose! ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}.`;
    }
    document.getElementById('result').innerText = `You chose: ${capitalize(playerChoice)}\nComputer chose: ${capitalize(computerChoice)}\n${result}`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Click Counter Logic
function increaseCounter() {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Click Counter game:");
        playerNameSet = true;
    }

    clickCount++;
    updateCounterDisplay();
    localStorage.setItem('clickCount', clickCount.toString());
}

// Reset the Click Counter
function resetCounter() {
    saveScore('Click Counter', clickCount);
    clickCount = 0;
    updateCounterDisplay();
    localStorage.setItem('clickCount', '0');
}

// Save Score to localStorage
function saveScore(game, score) {
    if (!playerNameSet) return;

    let savedScores = JSON.parse(localStorage.getItem('scores')) || {};

    if (!savedScores[game]) {
        savedScores[game] = [];
    }

    const playerIndex = savedScores[game].findIndex(
        player => player.playerName.toLowerCase() === playerName.toLowerCase()
    );

    if (playerIndex !== -1) {
        if (savedScores[game][playerIndex].score < score) {
            savedScores[game][playerIndex].score = score;
        }
    } else {
        savedScores[game].push({ playerName: playerName.trim(), score });
    }

    savedScores[game].sort((a, b) => b.score - a.score);
    if (savedScores[game].length > 10) {
        savedScores[game] = savedScores[game].slice(0, 10);
    }

    localStorage.setItem('scores', JSON.stringify(savedScores));
    displayLeaderboard();
}

// Display leaderboard
function displayLeaderboard() {
    const savedScores = JSON.parse(localStorage.getItem('scores')) || {};

    const rpsScores = savedScores['Rock, Paper, Scissors'] || [];
    document.getElementById('rps-leaderboard').innerHTML = `<h3>Rock, Paper, Scissors Leaderboard</h3>${
        rpsScores.length > 0
            ? rpsScores.map((player, i) => `<p>${i + 1}. ${player.playerName}: ${player.score} wins</p>`).join('')
            : '<p>No scores yet!</p>'
    }`;

    const clickCounterScores = savedScores['Click Counter'] || [];
    document.getElementById('click-counter-leaderboard').innerHTML = `<h3>Click Counter Leaderboard</h3>${
        clickCounterScores.length > 0
            ? clickCounterScores.map((player, i) => `<p>${i + 1}. ${player.playerName}: ${player.score} clicks</p>`).join('')
            : '<p>No scores yet!</p>'
    }`;

    const numberGuessScores = savedScores['Number Guessing Game'] || [];
    document.getElementById('number-guess-leaderboard').innerHTML = `<h3>Number Guessing Game Leaderboard</h3>${
        numberGuessScores.length > 0
            ? numberGuessScores.map((player, i) => `<p>${i + 1}. ${player.playerName}: ${player.score} wins</p>`).join('')
            : '<p>No scores yet!</p>'
    }`;
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    loadClickCount();
    displayLeaderboard();

    // Ensure click event listener is only added once
    const clickButton = document.getElementById('clickButton');
    if (clickButton) {
        clickButton.removeEventListener('click', increaseCounter);
        clickButton.addEventListener('click', increaseCounter);
    }
});
