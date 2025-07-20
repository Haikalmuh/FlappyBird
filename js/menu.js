console.log("Menu.js dimuat");

const startBtn = document.getElementById("start-btn");
const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const highScoreText = document.getElementById("high-score");

const highScore = localStorage.getItem("flappyHighScore") || 0;
highScoreText.textContent = `High Score: ${highScore}`;

startBtn.addEventListener("click", () => {
    console.log("Tombol Start diklik");
    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    if (typeof startGame === "function") {
        startGame();
    } else {
        console.warn("startGame belum tersedia!");
    }
});
