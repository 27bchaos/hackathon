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
        if (guessAttempts <= 5) {
            document.getElementById('number-guess-feedback').innerText = `Congratulations ${playerName}! You guessed the number in ${guessAttempts} attempts.`;
            saveScore('Number Guessing Game', 1);  // Save the win
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
    // Reset the game state and number
    numberToGuess = Math.floor(Math.random() * 100) + 1;  // New random number
    guessAttempts = 0;  // Reset attempts
    document.getElementById('number-guess-input').value = '';  // Clear the input field
}

// Load stored data from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadClickCount();
    displayLeaderboard();

    // Make sure the submit guess button works
    const submitGuessButton = document.querySelector('button[onclick="submitGuess()"]');
    if (submitGuessButton) {
        submitGuessButton.addEventListener('click', submitGuess);
    }
});
