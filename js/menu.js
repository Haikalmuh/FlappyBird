console.log("Menu.js dimuat");

const startBtn = document.getElementById("start-btn");
const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const highScoreText = document.getElementById("high-score");

// --- 1. SET MAP DEFAULT ---
if (!localStorage.getItem("selectedMap")) {
    localStorage.setItem("selectedMap", "day");
}

let selectedMap = localStorage.getItem("selectedMap");

// Terapkan map saat pertama kali dimuat
const background = document.querySelector(".background");
background.style.backgroundImage = `url('assets/maps/bg-${selectedMap}.png')`;

// Update centang di modal
document.querySelectorAll(".checkmark").forEach(el => el.classList.add("hidden"));
const selectedCheck = document.querySelector(`.map-option[data-map="${selectedMap}"] .checkmark`);
if (selectedCheck) selectedCheck.classList.remove("hidden");

// --- 2. HIGH SCORE ---
highScoreText.textContent = `High Score: ${localStorage.getItem("flappyHighScore") || 0}`;

// --- 3. START BUTTON + COUNTDOWN ---
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

// --- 4. MODAL GANTI MAP ---
const mapBtn = document.getElementById("map-btn");
const mapModal = document.getElementById("map-modal");
const closeMapModal = document.getElementById("close-map-modal");
const mapOptions = document.querySelectorAll(".map-option");

mapBtn.addEventListener("click", () => {
    mapModal.classList.remove("hidden");
});

closeMapModal.addEventListener("click", () => {
    mapModal.classList.add("hidden");
});

mapOptions.forEach(option => {
    option.addEventListener("click", () => {
        const theme = option.getAttribute("data-map");
        applyMapTheme(theme);
        localStorage.setItem("selectedMap", theme);
    });
});

// --- 5. APLIKASIKAN MAP ---
function applyMapTheme(theme) {
    background.style.backgroundImage = `url('assets/maps/bg-${theme}.png')`;

    // Update centang di pilihan
    document.querySelectorAll(".checkmark").forEach(el => el.classList.add("hidden"));
    const selected = document.querySelector(`.map-option[data-map="${theme}"] .checkmark`);
    if (selected) selected.classList.remove("hidden");
}
