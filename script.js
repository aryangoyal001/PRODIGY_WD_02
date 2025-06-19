let startTime, interval;
let elapsedTime = 0;
let running = false;

let lapStartTime = 0;
let lapElapsed = 0;
let lapInterval;
let lastLapTime = 0;

let showSplit = false;

const display = document.getElementById("display");
const sinceLastLapDisplay = document.getElementById("sinceLastLapDisplay");
const toggleBtn = document.getElementById("toggle");
const icon = document.getElementById("icon");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const lapsList = document.getElementById("laps");
const themeToggle = document.getElementById("themeToggle");
const splitToggle = document.getElementById("splitToggle");

function formatTime(ms) {
  const hours = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
}

function updateLapDisplay() {
  sinceLastLapDisplay.textContent = `+${formatTime(lapElapsed)}`;
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  interval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 100);

  lapStartTime = Date.now() - lapElapsed;
  lapInterval = setInterval(() => {
    lapElapsed = Date.now() - lapStartTime;
    updateLapDisplay();
  }, 100);

  running = true;
  icon.textContent = "⏸";
}

function pauseTimer() {
  clearInterval(interval);
  clearInterval(lapInterval);
  running = false;
  icon.textContent = "▶";
}

function toggleTimer() {
  running ? pauseTimer() : startTimer();
}

function resetTimer() {
  clearInterval(interval);
  clearInterval(lapInterval);

  elapsedTime = 0;
  lapElapsed = 0;
  lapStartTime = 0;
  lastLapTime = 0;

  running = false;
  updateDisplay();
  updateLapDisplay();
  icon.textContent = "▶";
  lapsList.innerHTML = '';
}

function recordLap() {
  if (running) {
    const currentLap = elapsedTime;
    const lapDiff = currentLap - lastLapTime;
    lastLapTime = currentLap;

    const li = document.createElement("li");
    const lapTime = formatTime(currentLap);
    const splitTime = formatTime(lapDiff);
    li.innerHTML = `<span>Lap ${lapsList.children.length + 1}: ${lapTime}</span><span>${showSplit ? '+' + splitTime : ''}</span>`;
    lapsList.prepend(li);
    lapsList.scrollTop = 0;

    clearInterval(lapInterval);
    lapElapsed = 0;
    lapStartTime = Date.now();
    lapInterval = setInterval(() => {
      lapElapsed = Date.now() - lapStartTime;
      updateLapDisplay();
    }, 100);
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

toggleBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);
themeToggle.addEventListener("click", toggleTheme);
splitToggle.addEventListener("change", () => {
  showSplit = splitToggle.checked;
});

updateDisplay();
updateLapDisplay();
