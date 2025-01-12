let clickCount = 0;
let playerName = '';
let playerNameSet = false;

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
    saveScore('Click Counter', clickCount);
    clickCount = 0;
    updateCounterDisplay();
    setCookie('clickCount', '0', 7);
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

    const rpsScores = savedScores['Rock, Paper, Scissors'] || [];
    document.getElementById('rps-leaderboard').innerHTML = `<h3>Rock, Paper, Scissors Leaderboard</h3>${
        rpsScores.length > 0
            ? rpsScores.map((player, i) => `<p>${i + 1}. ${player.playerName}: ${player.score} wins</p>`).join('')
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
