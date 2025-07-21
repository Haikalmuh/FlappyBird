console.log("Menu.js dimuat");

const startBtn = document.getElementById("start-btn");
const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const highScoreText = document.getElementById("high-score");

document.getElementById("high-score").innerText = `High Score: ${localStorage.getItem("flappyHighScore") || 0}`;

// const highScore = localStorage.getItem("flappyHighScore") || 0;
// highScoreText.textContent = `High Score: ${highScore}`;

startBtn.addEventListener("click", () => {
    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    const countdownEl = document.getElementById("countdown");
    let count = 3;
    countdownEl.textContent = count;
    countdownEl.classList.remove("hidden");

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownEl.classList.add("hidden");
            startGame(); // Baru mulai game setelah 3..2..1 selesai
        }
    }, 1000);
});

