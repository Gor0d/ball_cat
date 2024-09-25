const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 0;
let ballSpeedY = -5;
let isGameOver = false;
let isGameStarted = false;
let score = 0;
let lives = 3;

const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 20;
let obstacleSpeed = 2;  // A velocidade começa baixa, mas vai aumentar

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#00ff00';
  ctx.fill();
  ctx.closePath();
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.beginPath();
    ctx.rect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
    ctx.closePath();
  });
}

function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += obstacleSpeed;

    // Remove obstáculos que saem da tela
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
      increaseDifficulty();  // Aumenta a dificuldade conforme a pontuação
    }

    // Checa colisão com a bolinha
    if (
      ballX > obstacles[i].x &&
      ballX < obstacles[i].x + obstacleWidth &&
      ballY > obstacles[i].y &&
      ballY < obstacles[i].y + obstacleHeight
    ) {
      lives--;
      obstacles.splice(i, 1);  // Remove o obstáculo após a colisão
      if (lives === 0) {
        isGameOver = true;
      }
    }
  }
}

function generateObstacle() {
  const randomX = Math.random() * (canvas.width - obstacleWidth);
  obstacles.push({ x: randomX, y: -obstacleHeight });
}

function moveBall() {
  ballX += ballSpeedX;

  // Impede que a bolinha saia dos limites do canvas
  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    ballSpeedX = -ballSpeedX;
  }
}

function increaseDifficulty() {
  if (score % 10 === 0 && obstacleSpeed < 8) {
    obstacleSpeed += 0.5;  // Aumenta a velocidade a cada 10 pontos
  }
}

function resetGame() {
  isGameOver = false;
  score = 0;
  lives = 3;
  obstacleSpeed = 2;
  obstacles.length = 0;
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  document.getElementById('gameOverScreen').classList.add('hidden');
}

function updateGame() {
  if (!isGameStarted) return;

  if (isGameOver) {
    document.getElementById('gameOverScreen').classList.remove('hidden');
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawObstacles();

  moveBall();
  updateObstacles();

  document.getElementById('score').innerText = `Score: ${score}`;
  document.getElementById('lives').innerText = `Lives: ${lives}`;
  
  requestAnimationFrame(updateGame);
}

// Controle da bolinha com teclas de seta
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    ballSpeedX = -5;
  } else if (e.key === 'ArrowRight') {
    ballSpeedX = 5;
  } else if (e.key === ' ') {
    if (!isGameStarted) {
      isGameStarted = true;
      document.getElementById('startScreen').classList.add('hidden');
      updateGame();
    } else if (isGameOver) {
      resetGame();
      updateGame();
    }
  }
});

// Geração de obstáculos a cada 2 segundos
setInterval(() => {
  if (isGameStarted && !isGameOver) generateObstacle();
}, 2000);

// Tela inicial
document.getElementById('startScreen').classList.remove('hidden');
