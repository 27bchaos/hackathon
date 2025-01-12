let clickCount = 0;
let playerName = '';
let playerNameSet = false;

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

function setCookie(name, value, days) {
    try {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
}

function loadClickCount() {
    const savedClickCount = getCookie('clickCount');
    if (savedClickCount !== null) {
        clickCount = parseInt(savedClickCount, 10);
        if (isNaN(clickCount)) clickCount = 0;
    }
    updateCounterDisplay();
}

function updateCounterDisplay() {
    document.getElementById('counter').innerText = `Clicks: ${clickCount}`;
    document.getElementById('click-message').innerText = ''; // Reset message each time
}

function increaseCounter() {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Click Counter game:");
        playerNameSet = true;
    }

    // Add 1 to the click count
    clickCount++;

    // Update display
    updateCounterDisplay();

    // Set the updated click count to a cookie so it persists
    setCookie('clickCount', clickCount.toString(), 7);

    // Display confirmation message after click
    document.getElementById('click-message').innerText = 'Click registered!';

    // Save the score to leaderboard
    saveScore('Click Counter', 1);
}

function resetCounter() {
    // Reset the counter
    clickCount = 0;
    updateCounterDisplay();

    // Reset the cookie
    setCookie('clickCount', '0', 7);

    // Clear the click message
    document.getElementById('click-message').innerText = '';
}

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

document.addEventListener('DOMContentLoaded', () => {
    loadClickCount();
    displayLeaderboard();
});
