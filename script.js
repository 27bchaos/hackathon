let clickCount = 0;
let playerName = '';
let playerNameSet = false;
let numberToGuess = Math.floor(Math.random() * 100) + 1;
let guessAttempts = 0;
const maxGuessAttempts = 10; // Max attempts for Number Guessing Game
let rpsWins = 0;  // Track Rock, Paper, Scissors Wins

// Get a cookie by name
function getCookie(name) {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) {
            const cookieValue = parts.pop().split(';').shift();
            return decodeURIComponent(cookieValue);
        }
        return null;
    } catch (error) {
        console.error('Error reading cookie:', error);
        return null;
    }
}

// Set a cookie with a name, value, and expiry date (in days)
function setCookie(name, value, days) {
    try {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
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
        rpsWins++;  // Increment wins for Rock, Paper, Scissors
        result = `You win! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}.`;
        saveScore('Rock, Paper, Scissors', rpsWins);
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
    setCookie('clickCount', clickCount.toString(), 7);
}

// Reset the Click Counter
function resetCounter() {
    saveScore('Click Counter', clickCount);  // Save click count to leaderboard
    clickCount = 0;
    updateCounterDisplay();
    setCookie('clickCount', '0', 7);
}

// Number Guessing Game Logic
function submitGuess() {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Number Guessing Game:");
        playerNameSet = true;
    }

    const playerGuess = parseInt(document.getElementById('number-guess-input').value, 10);
    if (isNaN(playerGuess)) {
        document.getElementById('number-guess-feedback').innerText = 'Please enter a valid number.';
        return;
    }

    guessAttempts++;
    if (playerGuess === numberToGuess) {
        if (guessAttempts <= maxGuessAttempts) {
            document.getElementById('number-guess-feedback').innerText = `Congratulations ${playerName}! You guessed the number in ${guessAttempts} attempts.`;
            saveScore('Number Guessing Game', 1);  // Save win to leaderboard
        } else {
            document.getElementById('number-guess-feedback').innerText = `You guessed the number in ${guessAttempts} attempts, but it took more than 10 tries. You lose.`;
        }
        resetNumberGuessingGame();
    } else if (playerGuess < numberToGuess) {
        document.getElementById('number-guess-feedback').innerText = 'Too low! Try again.';
    } else {
        document.getElementById('number-guess-feedback').innerText = 'Too high! Try again.';
    }

    if (guessAttempts >= maxGuessAttempts) {
        document.getElementById('number-guess-feedback').innerText = `Sorry, you've exceeded the maximum number of attempts. The correct number was ${numberToGuess}.`;
        resetNumberGuessingGame();
    }
}

function resetNumberGuessingGame() {
    numberToGuess = Math.floor(Math.random() * 100) + 1;
    guessAttempts = 0;
    document.getElementById('number-guess-input').value = '';
}

// Save Score to cookies
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
        savedScores[game][playerIndex].score = score;  // Update score for the player
    } else {
        savedScores[game].push({ playerName: playerName.trim(), score });
    }

    savedScores[game].sort((a, b) => b.score - a.score);  // Sort leaderboard by score
    if (savedScores[game].length > 10) {
        savedScores[game] = savedScores[game].slice(0, 10);  // Keep top 10 scores
    }

    setCookie('scores', JSON.stringify(savedScores), 7);  // Save to cookie
    displayLeaderboard();  // Update leaderboard
}

// Display leaderboard
function displayLeaderboard() {
    const savedScoresStr = getCookie('scores');
    const savedScores = savedScoresStr ? JSON.parse(savedScoresStr) : {};

    const rpsScores = savedScores['Rock, Paper, Scissors'] || [];
    document.getElementById('rps-leaderboard').innerHTML = `<h3>Rock, Paper, Scissors Leaderboard</h3>${
        rpsScores.length > 0
            ? rpsScores.map((player, i) => `<p>${i + 1}. ${player.playerName}: ${player.score} wins</p>`).join('')
            : '<p>No scores yet!</p>'
    }`;

    const clickScores = savedScores['Click Counter'] || [];
    document.getElementById('click-counter-leaderboard').innerHTML = `<h3>Click Counter Leaderboard</h3>${
        clickScores.length > 0
            ? clickScores.map((player, i) => `<p>${i + 1}. ${player.playerName}: ${player.score} clicks</p>`).join('')
            : '<p>No scores yet!</p>'
    }`;

    const numberGuessScores = savedScores['Number Guessing Game'] || [];
    document.getElementById('number-guess-leaderboard').innerHTML = `<h3>Number Guessing Game Leaderboard</h3>${
        numberGuessScores.length > 0
            ? numberGuessScores.map((player, i) => `<p>${i + 1}. ${player.playerName}: ${player.score} guesses</p>`).join('')
            : '<p>No scores yet!</p>'
    }`;
}

// Load saved click count and scores
window.onload = function () {
    loadClickCount();
    displayLeaderboard();
};
