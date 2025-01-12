let clickCount = 0;
let playerName = '';
let playerNameSet = false;
let numberToGuess = Math.floor(Math.random() * 100) + 1;
let guessAttempts = 0;

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

// Update the counter display
function updateCounterDisplay() {
    document.getElementById('counter').innerText = `Clicks: ${clickCount}`;
}

// Rock, Paper, Scissors Game logic
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

// Capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Increase click counter
function increaseCounter() {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Click Counter game:");
        playerNameSet = true;
    }

    // Increase the counter by 1
    clickCount++;
    updateCounterDisplay();
    setCookie('clickCount', clickCount.toString(), 7);

    // Save the score only when the click count is updated
    saveScore('Click Counter', clickCount);
}

// Reset click counter
function resetCounter() {
    clickCount = 0;
    updateCounterDisplay();
    setCookie('clickCount', '0', 7);
}

// Submit guess for the Number Guessing Game
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

// Reset the Number Guessing Game
function resetNumberGuessingGame() {
    numberToGuess = Math.floor(Math.random() * 100) + 1;
    guessAttempts = 0;
    document.getElementById('number-guess-input').value = '';
}

// Save the score to cookies
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

// Display the leaderboard
function displayLeaderboard() {
    const savedScoresStr = getCookie('scores');
    const savedScores = savedScoresStr ? JSON.parse(savedScoresStr) : {};

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

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', () => {
    loadClickCount();
    displayLeaderboard();
});
