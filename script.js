// Click Counter Variables
let clickCount = 0;
let playerName = '';
let playerNameSet = false;

// Helper functions for cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        return decodeURIComponent(cookieValue);
    }
    return null;
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

// Load click count from cookies
function loadClickCount() {
    const savedClickCount = getCookie('clickCount');
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

// Increase click count by 1
function increaseCounter() {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Click Counter game:");
        playerNameSet = true;
    }

    // Increment the click count by 1
    clickCount++;

    // Update display
    updateCounterDisplay();

    // Store the updated click count in cookie
    setCookie('clickCount', clickCount.toString(), 7);

    // Save the score to the leaderboard
    saveScore('Click Counter', 1);
}

// Reset the click counter
function resetCounter() {
    clickCount = 0;
    updateCounterDisplay();

    // Clear the cookie
    setCookie('clickCount', '0', 7);
}

// Save score to leaderboard
function saveScore(game, score) {
    if (!playerNameSet) return;

    let savedScores = {};
    const savedScoresStr = getCookie('scores');
    if (savedScoresStr) {
        savedScores = JSON.parse(savedScoresStr);
    }

    if (!savedScores[game]) {
        savedScores[game] = [];
    }

    const playerIndex = savedScores[game].findIndex(
        player => player.playerName.toLowerCase() === playerName.toLowerCase()
    );

    if (playerIndex !== -1) {
        savedScores[game][playerIndex].score += score;
    } else {
        savedScores[game].push({ playerName: playerName.trim(), score });
    }

    savedScores[game].sort((a, b) => b.score - a.score);
    if (savedScores[game].length > 10) {
        savedScores[game] = savedScores[game].slice(0, 10);
    }

    setCookie('scores', JSON.stringify(savedScores), 7);
    displayLeaderboard();
}

// Display leaderboard
function displayLeaderboard() {
    const savedScoresStr = getCookie('scores');
    const savedScores = savedScoresStr ? JSON.parse(savedScoresStr) : {};

    const clickCounterScores = savedScores['Click Counter'] || [];
    document.getElementById('click-counter-leaderboard').innerHTML = `<h3>Click Counter Leaderboard</h3>${
        clickCounterScores.length > 0
            ? clickCounterScores.map((player, i) => `<p>${i + 1}. ${player.playerName}: ${player.score} clicks</p>`).join('')
            : '<p>No scores yet!</p>'
    }`;
}

// Rock, Paper, Scissors Game Logic
function playGame(playerChoice) {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Rock, Paper, Scissors game:");
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

// Capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Number Guessing Game Logic
let numberToGuess = Math.floor(Math.random() * 100) + 1;
let guessAttempts = 0;

function submitGuess() {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Number Guessing Game:");
        playerNameSet = true;
    }

    const playerGuess = parseInt(document.getElementById('number-guess-input').value, 10);
    guessAttempts++;

    if (playerGuess === numberToGuess) {
        if (guessAttempts <= 5) {
            document.getElementById('number-guess-feedback').innerText = `Congratulations ${playerName}! You guessed the number in ${guessAttempts} attempts.`;
            saveScore('Number Guessing Game', 1);
        } else {
            document.getElementById('number-guess-feedback').innerText = `You guessed the number in ${guessAttempts} attempts, but it took more than 5 tries. You lose.`;
        }
        resetNumberGuessingGame();
    } else if (playerGuess < numberToGuess) {
        document.getElementById('number-guess-feedback').innerText = 'Too low! Try again.';
    } else {
        document.getElementById('number-guess-feedback').innerText = 'Too high! Try again.';
    }
}

function resetNumberGuessingGame() {
    numberToGuess = Math.floor(Math.random() * 100) + 1;
    guessAttempts = 0;
    document.getElementById('number-guess-input').value = '';
}

// Initialize leaderboard and game state
document.addEventListener('DOMContentLoaded', () => {
    loadClickCount();
    displayLeaderboard();
});
