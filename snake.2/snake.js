const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const replayButton = document.getElementById("replay");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let gameSpeed = 100; // milliseconds
let gameLoop;

// Start the game
function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    nextDirection = { x: 0, y: 0 };
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = `Score: ${score}`;
    replayButton.style.display = "none";
    generateFood();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, gameSpeed);
}

// Update game state
function updateGame() {
    if (gameOver) return;

    // Update direction
    direction = { ...nextDirection };

    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Check collision with self
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    drawGame();
}

// Draw everything
function drawGame() {
    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

// Generate new food position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    // Make sure food doesn't spawn on snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
    }
});

// End game
function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
    replayButton.style.display = "block";
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
}

// Replay button
replayButton.addEventListener("click", startGame);

// Start the game initially
startGame();
