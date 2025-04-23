const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
const rows = canvas.width / box;
const cols = canvas.height / box;

let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = "RIGHT";
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let gameOver = false;
let speed = 200;  // Initial speed (slow)

// DOM elements
const resetButton = document.getElementById("reset");
const scoreboard = document.getElementById("scoreboard");

// Initialize the game
function initGame() {
  // Respawn snake in the middle of the screen
  snake = [{ x: Math.floor(rows / 2), y: Math.floor(cols / 2) }];
  direction = "RIGHT";
  score = 0;
  gameOver = false;
  speed = 200;  // Start at the slowest speed
  generateFood(); // Generate food at a random position
  updateScoreboard();
  resetButton.style.display = "none";

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

// Generate food at a random position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
}

// Draw the snake
function drawSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  snake.forEach((segment) => {
    ctx.fillStyle = "lime";
    ctx.fillRect(segment.x * box, segment.y * box, box, box);
  });
}

// Draw the food
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);
}

// Update scoreboard
function updateScoreboard() {
  scoreboard.textContent = `Score: ${score} | High Score: ${highScore}`;
}

// Adjust the snake's speed based on the score
function adjustSpeed() {
  if (score <= 20) {
    speed = 200; // Slow speed
  } else if (score <= 30) {
    speed = 150; // Moderate speed
  } else if (score <= 50) {
    speed = 100; // Very fast speed
  } else if (score > 50 && score < 100) {
    speed = 50; // Maximum speed
  } else if (score >= 100) {
    // Impossible level (snake jumps randomly)
    speed = 50;
    randomJump();
  }
  
  // Update the game speed
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

// Game loop function
function gameLoop() {
  const head = { ...snake[0] };

  // Move the snake
  if (direction === "LEFT") head.x--;
  if (direction === "UP") head.y--;
  if (direction === "RIGHT") head.x++;
  if (direction === "DOWN") head.y++;

  // Check for collisions with walls or itself
  if (
    head.x < 0 ||
    head.x >= rows ||
    head.y < 0 ||
    head.y >= cols ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver = true;
    clearInterval(gameInterval);
    resetButton.style.display = "block";  // Show the restart button
    return;
  }

  snake.unshift(head);

  // Check if the snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    updateScoreboard();
    generateFood();
    adjustSpeed(); // Adjust speed as score increases
  } else {
    snake.pop(); // Remove the tail of the snake
  }

  // Draw the updated game
  drawSnake();
  drawFood();
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Randomly move the snake to any position on the grid (Level 100 - Impossible)
function randomJump() {
  const randomX = Math.floor(Math.random() * rows);
  const randomY = Math.floor(Math.random() * cols);

  // Teleport snake head to a random location
  snake[0] = { x: randomX, y: randomY };
}

// Restart the game
resetButton.addEventListener("click", () => {
  initGame();
});

// Start the game when the page loads
initGame();
