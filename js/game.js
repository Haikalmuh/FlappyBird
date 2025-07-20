const canvas = document.getElementById("game-screen");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const birdImg = new Image();
birdImg.src = "assets/img/closedwings1.png";

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

function flap() {
    bird.velocity = -8;
}

window.addEventListener("mousedown", () => {
    if (gameRunning) flap();
});
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameRunning) flap();
});

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = "#2ecc71";
    pipes.forEach(pipe => {
        // Pipa atas
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        // Pipa bawah
        ctx.fillRect(pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height - pipe.top - pipe.gap);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipe.speed;
    });

    // Hapus pipa yang keluar layar
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function spawnPipe() {
    const pipeWidth = 60;
    const gapHeight = 180;
    const topHeight = Math.random() * (canvas.height - gapHeight - 100) + 50;

    pipes.push({
        x: canvas.width,
        width: pipeWidth,
        top: topHeight,
        gap: gapHeight,
        speed: 3
    });
}

function detectCollision() {
    // Tabrak tanah atau langit
    if (bird.y + bird.height > canvas.height || bird.y < 0) return true;

    // Tabrak pipa
    for (let pipe of pipes) {
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (
                bird.y < pipe.top ||
                bird.y + bird.height > pipe.top + pipe.gap
            )
        ) {
            return true;
        }
    }

    return false;
}

function gameOver() {
    clearInterval(pipeInterval);
    gameRunning = false;
    alert("Game Over!");
    location.reload(); // muat ulang halaman
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    updatePipes();

    drawPipes();
    drawBird();

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
    gameRunning = true;

    pipeInterval = setInterval(spawnPipe, 1800);
    spawnPipe(); // langsung muncul satu pertama
    gameLoop();
};
