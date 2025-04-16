// ブロック崩しゲーム（スマホ用左右ボタン + ブロック配置最終調整）

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x, y, dx, dy, paddleX;
let ballRadius = 10;
let paddleHeight = 10;
let paddleWidth = 75;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 5;
let brickColumnCount = 10; // 10列
let brickWidth = 80;       // 幅 80px
let brickHeight = 25;
let brickPadding = 10;     // 間隔 10px
let brickOffsetTop = 40;
let brickOffsetLeft = 35;  // 左右マージン 35px
let lives = 3;
let score = 0;
let stage = 1;
let bricks = [];

function resizeCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.min(960, width);
  canvas.height = Math.min(640, height);
  resetPositions();
}

function resetPositions() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
}

function createBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 10, 30);
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 110, 30);
}

function drawStage() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Stage: " + stage, canvas.width / 2 - 40, 30);
}

function collisionDetection() {
  let allCleared = true;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        allCleared = false;
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 10;
        }
      }
    }
  }
  if (allCleared) {
    alert("ステージクリア！次へ進みます。");
    stage++;
    brickRowCount++;
    createBricks();
    resetPositions();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawStage();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      let relativeX = x - (paddleX + paddleWidth / 2);
      let normalized = relativeX / (paddleWidth / 2);
      let maxBounceAngle = Math.PI / 3;
      let bounceAngle = normalized * maxBounceAngle;
      let speed = Math.sqrt(dx * dx + dy * dy);
      dx = speed * Math.sin(bounceAngle);
      dy = -speed * Math.cos(bounceAngle);
    } else {
      lives--;
      if (!lives) {
        alert("ゲームオーバー！");
        document.location.reload();
      } else {
        resetPositions();
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

canvas.addEventListener("touchmove", function (e) {
  const rect = canvas.getBoundingClientRect();
  const touchX = e.touches[0].clientX - rect.left;
  paddleX = touchX - paddleWidth / 2;
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
  e.preventDefault();
}, { passive: false });

// 🔽 スマホUIボタン追加
const leftBtn = document.createElement("button");
leftBtn.textContent = "◀";
leftBtn.style.position = "absolute";
leftBtn.style.bottom = "20px";
leftBtn.style.left = "20px";
leftBtn.style.width = "60px";
leftBtn.style.height = "60px";
leftBtn.style.fontSize = "30px";
document.body.appendChild(leftBtn);

const rightBtn = document.createElement("button");
rightBtn.textContent = "▶";
rightBtn.style.position = "absolute";
rightBtn.style.bottom = "20px";
rightBtn.style.right = "20px";
rightBtn.style.width = "60px";
rightBtn.style.height = "60px";
rightBtn.style.fontSize = "30px";
document.body.appendChild(rightBtn);

leftBtn.addEventListener("touchstart", () => leftPressed = true);
leftBtn.addEventListener("touchend", () => leftPressed = false);
rightBtn.addEventListener("touchstart", () => rightPressed = true);
rightBtn.addEventListener("touchend", () => rightPressed = false);

window.addEventListener("resize", resizeCanvas);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

resizeCanvas();
createBricks();
draw();
