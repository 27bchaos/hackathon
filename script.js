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
}

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

function increaseCounter() {
    if (!playerNameSet) {
        playerName = prompt("Enter your name for the Click Counter game:");
        playerNameSet = true;
    }

    clickCount++;
    updateCounterDisplay();
    setCookie('clickCount', clickCount.toString(), 7);
    saveScore('Click Counter', clickCount, true); // Ensure Click Counter matches
}

function resetCounter() {
    clickCount = 0;
    updateCounterDisplay();
    setCookie('clickCount', '0', 7);
    saveScore('Click Counter', 0, true);
}

function saveScore(game, score, isOverwrite = false) {
    try {
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
            if (isOverwrite) {
                savedScores[game][playerIndex].score = score; // Overwrite for Click Counter
            } else {
                savedScores[game][playerIndex].score += score;
            }
        } else {
            savedScores[game].push({
                playerName: playerName.trim(),
                score: score
            });
        }

        savedScores[game].sort((a, b) => b.score - a.score);
        if (savedScores[game].length > 10) {
            savedScores[game] = savedScores[game].slice(0, 10);
        }

        setCookie('scores', JSON.stringify(savedScores), 7);
        displayLeaderboard();
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

function displayLeaderboard() {
    try {
        const savedScoresStr = getCookie('scores');
        const savedScores = savedScoresStr ? JSON.parse(savedScoresStr) : {};

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

document.addEventListener('DOMContentLoaded', () => {
    loadClickCount();
    displayLeaderboard();
});
