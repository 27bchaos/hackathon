// Game state
let clickCount = 0;
let targetNumber = Math.floor(Math.random() * 100) + 1;
let rpsScore = 0;

// Initialize leaderboards
const leaderboards = {
    rps: [],
    clicks: [],
    guesses: []
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load saved leaderboards
    const saved = localStorage.getItem('gameLeaderboards');
    if (saved) {
        try {
            const savedData = JSON.parse(saved);
            Object.assign(leaderboards, savedData);
        } catch (e) {
            console.error('Error loading leaderboards:', e);
            localStorage.removeItem('gameLeaderboards'); // Clear corrupted data
        }
    }
    
    // Initialize leaderboard displays
    displayLeaderboards();
    
    // Set up click counter button with proper event handling
    const clickButton = document.getElementById('clickButton');
    if (clickButton) {
        clickButton.addEventListener('click', increaseCounter);
    }
});

// Rock Paper Scissors Game
function playGame(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    let result;
    if (playerChoice === computerChoice) {
        result = "It's a tie!";
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = 'You win!';
        rpsScore++;
    } else {
        result = 'Computer wins!';
        if (rpsScore > 0) {
            updateLeaderboard('rps', rpsScore);
            rpsScore = 0;
        }
    }
    
    const resultElement = document.getElementById('result');
    if (resultElement) {
        resultElement.textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. ${result}`;
    }
}

// Click Counter Game
function increaseCounter() {
    clickCount++;
    const counterElement = document.getElementById('counter');
    if (counterElement) {
        counterElement.textContent = `Clicks: ${clickCount}`;
    }
}

function resetCounter() {
    if (clickCount > 0) {
        updateLeaderboard('clicks', clickCount);
    }
    clickCount = 0;
    const counterElement = document.getElementById('counter');
    if (counterElement) {
        counterElement.textContent = 'Clicks: 0';
    }
}

// Number Guessing Game
function submitGuess() {
    const guessInput = document.getElementById('number-guess-input');
    const feedback = document.getElementById('number-guess-feedback');
    
    if (!guessInput || !feedback) return;
    
    const guess = parseInt(guessInput.value);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        feedback.textContent = 'Please enter a valid number between 1 and 100';
        return;
    }
    
    if (guess === targetNumber) {
        feedback.textContent = 'Congratulations! You guessed the number!';
        updateLeaderboard('guesses', guess);
        targetNumber = Math.floor(Math.random() * 100) + 1;
        guessInput.value = '';
    } else if (guess < targetNumber) {
        feedback.textContent = 'Too low! Try again.';
    } else {
        feedback.textContent = 'Too high! Try again.';
    }
}

// Leaderboard Functions
function updateLeaderboard(game, score) {
    if (!leaderboards[game]) return;
    
    leaderboards[game].push({
        score: score,
        date: new Date().toLocaleDateString()
    });
    
    // Sort scores (higher is better)
    leaderboards[game].sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    if (leaderboards[game].length > 10) {
        leaderboards[game] = leaderboards[game].slice(0, 10);
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('gameLeaderboards', JSON.stringify(leaderboards));
    } catch (e) {
        console.error('Error saving leaderboards:', e);
    }
    
    // Update display
    displayLeaderboards();
}

function displayLeaderboards() {
    const games = ['rps', 'clicks', 'guesses'];
    games.forEach(game => {
        const container = document.querySelector(`#${game}-leaderboard .scores`);
        if (!container) return;
        
        container.innerHTML = leaderboards[game] && leaderboards[game].length ? 
            leaderboards[game].map((entry, index) => `
                <div class="score-entry">
                    <span>#${index + 1}</span>
                    <span>${entry.score}</span>
                    <span>${entry.date}</span>
                </div>
            `).join('') :
            '<p>No scores yet!</p>';
    });
}
