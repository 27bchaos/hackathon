let clickCount = 0;
let playerName = ''; // To store the player's name for both games
let playerNameSet = false; // To check if the player's name is already set

// Get a cookie by name
function getCookie(name) {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop().split(';').shift();
            return decodeURIComponent(cookieValue); // Decode the cookie value
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
        playerNameSet = true; // Set name flag
    }

    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result = '';

    if (playerChoice === computerChoice) {
        result = 'It\'s a tie!';
        document.getElementById('result').innerText = `You chose: ${capitalize(playerChoice)}\nComputer chose: ${capitalize(computerChoice)}\n${result}`;
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = `You win! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}.`;
        document.getElementById('result').innerText = `You chose: ${capitalize(playerChoice)}\nComputer chose: ${capitalize(computerChoice)}\n${result}`;
        // Save score for each win, not just the first
        saveScore('Rock, Paper, Scissors', 1);
    } else {
        result = `You lose! ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}.`;
        document.getElementById('result').innerText = `You chose: ${capitalize(playerChoice)}\nComputer chose: ${capitalize(computerChoice)}\n${result}`;
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Click Counter Logic
function increaseCounter() {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Click Counter game:");
        playerNameSet = true; // Set name flag
    }

    clickCount++;
    updateCounterDisplay();
    setCookie('clickCount', clickCount.toString(), 7);
    saveScore('Click Counter', clickCount);
}

// Reset the Click Counter
function resetCounter() {
    clickCount = 0;
    updateCounterDisplay();
    setCookie('clickCount', '0', 7);
}

// Save Score to cookies
function saveScore(game, score) {
    try {
        if (!playerNameSet) return; // Avoid saving score before the name is set

        // Get existing scores
        let savedScores = {};
        const savedScoresStr = getCookie('scores');
        if (savedScoresStr) {
            savedScores = JSON.parse(savedScoresStr);
        }

        // Initialize game array if needed
        if (!savedScores[game]) {
            savedScores[game] = [];
        }

        // Check if player already exists
        const playerIndex = savedScores[game].findIndex(
            player => player.playerName.toLowerCase() === playerName.toLowerCase()
        );

        if (playerIndex !== -1) {
            // Update existing score (accumulate score if player wins again)
            savedScores[game][playerIndex].score += score;
        } else {
            // Add new player if not found
            savedScores[game].push({
                playerName: playerName.trim(),
                score: score
            });
        }

        // Sort and limit to top 10 scores
        savedScores[game].sort((a, b) => b.score - a.score);
        if (savedScores[game].length > 10) {
            savedScores[game] = savedScores[game].slice(0, 10);
        }

        // Save back to cookie
        setCookie('scores', JSON.stringify(savedScores), 7);

        // Update display
        displayLeaderboard();
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Display leaderboard
function displayLeaderboard() {
    try {
        const savedScoresStr = getCookie('scores');
        const savedScores = savedScoresStr ? JSON.parse(savedScoresStr) : {};

        // Display RPS leaderboard
        const rpsScores = savedScores['Rock, Paper, Scissors'] || [];
        let rpsLeaderboardHTML = '<h3>Rock, Paper, Scissors Leaderboard</h3>';
        if (rpsScores.length > 0) {
            rpsLeaderboardHTML += rpsScores
                .map((player, index) => `<p>${index + 1}. ${player.playerName}: ${player.score} wins</p>`)
                .join('');
        } else {
            rpsLeaderboardHTML += '<p>No scores yet!</p>';
        }
        document.getElementById('rps-leaderboard').innerHTML = rpsLeaderboardHTML;

        // Display Click Counter leaderboard
        const clickCounterScores = savedScores['Click Counter'] || [];
        let clickCounterLeaderboardHTML = '<h3>Click Counter Leaderboard</h3>';
        if (clickCounterScores.length > 0) {
            clickCounterLeaderboardHTML += clickCounterScores
                .map((player, index) => `<p>${index + 1}. ${player.playerName}: ${player.score} clicks</p>`)
                .join('');
        } else {
            clickCounterLeaderboardHTML += '<p>No scores yet!</p>';
        }
        document.getElementById('click-counter-leaderboard').innerHTML = clickCounterLeaderboardHTML;
    } catch (error) {
        console.error('Error displaying leaderboard:', error);
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    loadClickCount();
    displayLeaderboard();
});
