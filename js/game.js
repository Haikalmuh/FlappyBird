const canvas = document.getElementById("game-screen");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Elemen untuk pause
const pauseMenu = document.getElementById("pause-menu");
const resumeBtn = document.getElementById("resume-btn");
const restartBtnPause = document.getElementById("restart-btn-pause");

let isPaused = false;

const birdImg = new Image();
birdImg.src = "assets/img/closedwings1.png";

const pipeTopImg = new Image();
pipeTopImg.src = "assets/img/pipe-top.png";

const pipeBottomImg = new Image();
pipeBottomImg.src = "assets/img/pipe-bottom.png";

let bird = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    velocity: 0,
    gravity: 0.5
};

let pipes = [];
let pipeInterval;
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;

function flap() {
    bird.velocity = -7;
}

window.addEventListener("mousedown", () => {
    if (gameRunning && !isPaused) flap();
});

window.addEventListener("keydown", (e) => {
    const key = e.code;
    if (gameRunning && !isPaused && (key === "Space" || key === "KeyW" || key === "ArrowUp")) {
        flap();
    }

    // Toggle pause
    if (gameRunning && key === "KeyP") {
        isPaused = !isPaused;
        if (isPaused) {
            pauseMenu.classList.remove("hidden");
            clearInterval(pipeInterval); // 🛑 hentikan pipa saat pause
        } else {
            pauseMenu.classList.add("hidden");
            pipeInterval = setInterval(spawnPipe, 1800); // ✅ atur ulang setelah resume
            gameLoop(); // lanjut loop
        }
    }
});

resumeBtn.addEventListener("click", () => {
    isPaused = false;
    pauseMenu.classList.add("hidden");
    pipeInterval = setInterval(spawnPipe, 1800); // ✅ pastikan hanya satu interval
    gameLoop();
});


restartBtnPause.addEventListener("click", () => {
    location.reload();
});

document.getElementById("restart-btn").addEventListener("click", () => {
    location.reload();
});

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px Fredoka One";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 60);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImg, pipe.x, pipe.top - pipeTopImg.height, pipe.width, pipeTopImg.height);
        ctx.drawImage(pipeBottomImg, pipe.x, pipe.top + pipe.gap, pipe.width, pipeBottomImg.height);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipe.speed;

        if (!pipe.scored && bird.x > pipe.x + pipe.width) {
            score++;
            pipe.scored = true;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("flappyHighScore", highScore);
            }
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function spawnPipe() {
    const pipeWidth = 80;
    const gapHeight = 180;
    const topHeight = Math.random() * (canvas.height - gapHeight - 100) + 50;

    pipes.push({
        x: canvas.width,
        width: pipeWidth,
        top: topHeight,
        gap: gapHeight,
        speed: 3,
        scored: false
    });
}

function detectCollision() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) return true;

    for (let pipe of pipes) {
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipe.gap)
        ) {
            return true;
        }
    }

    return false;
}

function gameOver() {
    clearInterval(pipeInterval);
    gameRunning = false;

    const gameOverCard = document.getElementById("game-over-card");
    const finalScore = document.getElementById("final-score");
    const finalHighScore = document.getElementById("final-highscore");

    finalScore.textContent = `Score: ${score}`;
    finalHighScore.textContent = `High Score: ${highScore}`;
    gameOverCard.classList.remove("hidden");
}

function gameLoop() {
    if (!gameRunning || isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    updatePipes();

    drawPipes();
    drawBird();
    drawScore();

    if (detectCollision()) {
        gameOver();
        return;
    }

    requestAnimationFrame(gameLoop);
}

window.startGame = () => {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameRunning = true;
    isPaused = false;

    pipeInterval = setInterval(spawnPipe, 1800);
    spawnPipe();
    gameLoop();
};
