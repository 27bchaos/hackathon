<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rock, Paper, Scissors & Click Counter Game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Rock, Paper, Scissors & Click Counter Game</h1>

    <!-- Rock, Paper, Scissors Game Section -->
    <div class="game-container">
        <h2>Rock, Paper, Scissors</h2>
        <div class="choices">
            <button onclick="playGame('rock')">Rock</button>
            <button onclick="playGame('paper')">Paper</button>
            <button onclick="playGame('scissors')">Scissors</button>
        </div>
        <div id="result"></div>
    </div>

    <!-- Leaderboard Section for Rock, Paper, Scissors -->
    <div class="leaderboard-section">
        <div id="rps-leaderboard">
            <h3>Rock, Paper, Scissors Leaderboard</h3>
            <p>No scores yet!</p>
        </div>
    </div>

    <!-- Click Counter Game Section (Moved to the bottom) -->
    <div class="game-container">
        <h2>Click Counter</h2>
        <button onclick="increaseCounter()">Click Me!</button>
        <p id="counter">Clicks: 0</p>
        <button onclick="resetCounter()">Reset Counter</button>
        <div id="note">Note: To save your Click Counter score, please click the 'Reset Counter' button.</div>
    </div>

    <!-- Leaderboard Section for Click Counter -->
    <div class="leaderboard-section">
        <div id="click-counter-leaderboard">
            <h3>Click Counter Leaderboard</h3>
            <p>No scores yet!</p>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
