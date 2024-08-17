// Constants for timing
const SHOW_NUMBER_DELAY = 1000;
const HIDE_NUMBER_DELAY = 600;
const MEMORY_PHASE_DELAY = 3000;
const PROGRESS_BAR_UPDATE_INTERVAL = 5;
const PROGRESS_BAR_BLINKING_THRESHOLD = 90;

// Event listeners for buttons
document.getElementById("startButton").addEventListener("click", startGame);
document
  .getElementById("resetButton")
  .addEventListener("click", () => window.location.reload());

window.onload = function () {
  let highScore = localStorage.getItem("highScore");
  // Additional onload tasks can be added here
};

// Game-related variables
let gameMode, numLength, numDigits, numbers, cards, timer;
let progressBarInterval, gameArea;
let progressContainer = document.querySelector("#progressContainer");
let progressBar = progressContainer.firstElementChild;
let highScoreBar = progressContainer.lastElementChild;

/**
 * Initializes the game settings and starts the game.
 */
function startGame() {
  gameMode = document.getElementById("gameMode").value;
  numLength = document.getElementById("numLength").value;
  numDigits = document.getElementById("numDigits").value;

  setupUIForGameStart();

  numbers = generateRandomNumbers(numLength, numDigits);
  setupGameArea();
  displayNumbers();

  displayHighScore();
}

/**
 * Sets up the UI elements for game start.
 */
function setupUIForGameStart() {
  const startButton = document.getElementById("startButton");
  startButton.classList.add("hidden");
  startButton.textContent = "Restart";

  document.getElementById("resetButton").classList.remove("hidden");

  resetProgressBar();
}

/**
 * Resets the progress bar to its initial state.
 */
function resetProgressBar() {
  progressBar.style.animation = "none";
  progressBar.style.backgroundColor = "#4caf50";
  const tooltipHs = progressBar.firstElementChild;
  if (tooltipHs) {
    tooltipHs.remove();
  }
}

/**
 * Generates an array of random numbers based on the game settings.
 * @param {number} length - The length of the number array.
 * @param {number} digits - The number of digits for each number.
 * @returns {Array<number>} Array of random numbers.
 */
function generateRandomNumbers(length, digits) {
  let nums = [];
  for (let i = 0; i < length; i++) {
    nums.push(
      Math.floor(Math.random() * (9 * 10 ** (digits - 1))) + 10 ** (digits - 1)
    );
  }
  return nums;
}

/**
 * Sets up the game area by creating card elements.
 */
function setupGameArea() {
  gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";
  cards = [];
  resetProgressContainer();

  for (let i = 0; i < numLength; i++) {
    createAndAppendCard(i);
  }
}

/**
 * Resets the progress container to its initial state.
 */
function resetProgressContainer() {
  progressBar.style.width = "0%";
  progressContainer.classList.add("not-visible");
}

/**
 * Creates and appends a card element to the game area.
 * @param {number} index - The index of the card.
 */
function createAndAppendCard(index) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");
  cardBack.dataset.index = index;

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);
  gameArea.appendChild(card);
  cards.push(cardInner);
}

/**
 * Displays the numbers on the cards with an animation.
 */
function displayNumbers() {
  let index = 0;

  if (gameMode === "chaotic") {
    // Shuffle cards for chaotic mode
    cards.sort(() => 0.5 - Math.random());
  }

  setTimeout(showNumber, SHOW_NUMBER_DELAY);

  function showNumber() {
    if (index < numbers.length) {
      const cardBack = cards[index].querySelector(".card-back");
      cardBack.textContent = numbers[cardBack.dataset.index];
      cards[index].classList.add("flip");
      index++;
      setTimeout(hideNumber, SHOW_NUMBER_DELAY);
    } else {
      resetCardsAfterDisplay();
    }
  }

  function hideNumber() {
    if (gameMode === "pro" || gameMode === "chaotic") {
      cards[index - 1].classList.remove("flip");
    }
    setTimeout(showNumber, SHOW_NUMBER_DELAY);
  }

  function resetCardsAfterDisplay() {
    cards.forEach((card) => card.classList.remove("flip"));
    setTimeout(startMemoryPhase, MEMORY_PHASE_DELAY);
  }
}

/**
 * Starts the memory phase of the game, allowing players to input their guesses.
 */
function startMemoryPhase() {
  cards.forEach((cardInner) => {
    const cardBack = cardInner.querySelector(".card-back");
    cardBack.textContent = "";
    cardInner.classList.add("flip", "empty");
    cardBack.contentEditable = true;
    cardBack.addEventListener("input", evaluateInput);
  });

  limitInputLengthByClassName("card-back", numDigits);
  focusNextElement(-1); // Focus the first card
  timer = new Date();
  startProgressBar(numLength * numDigits * 3); // Start the progress bar
}

/**
 * Starts the progress bar with the given time limit.
 * @param {number} timeLimit - The time limit in seconds.
 */
function startProgressBar(timeLimit) {
  progressContainer.classList.remove("not-visible");

  let timePassed = 0;
  const totalTime = timeLimit * 1000;

  progressBarInterval = setInterval(() => {
    timePassed += PROGRESS_BAR_UPDATE_INTERVAL;
    updateProgressBar(timePassed, totalTime);
  }, PROGRESS_BAR_UPDATE_INTERVAL);
}

/**
 * Updates the progress bar based on the time passed.
 * @param {number} timePassed - The time passed in milliseconds.
 * @param {number} totalTime - The total time in milliseconds.
 */
function updateProgressBar(timePassed, totalTime) {
  const percentage = (timePassed / totalTime) * 100;
  progressBar.style.width = percentage + "%";
  if (percentage > PROGRESS_BAR_BLINKING_THRESHOLD) {
    progressBar.style.backgroundColor = "#ff0000";
    progressBar.style.animation = `blinking 500ms ${
      Math.floor((totalTime * 0.1) / 500) + 21
    }`;
  }
  if (timePassed >= totalTime) {
    clearInterval(progressBarInterval);
    checkWinCondition();
    failGame();
  }
}

/**
 * Handles the game failure scenario.
 */
function failGame() {
  gameArea.innerHTML = ""; // Clear the game area

  const failMessage = document.createElement("div");
  failMessage.textContent = "Time's up!";
  failMessage.classList.add("fail-message");
  gameArea.appendChild(failMessage);

  toggleResetAndStartButtons();
}

/**
 * Toggles the visibility of the reset and start buttons.
 */
function toggleResetAndStartButtons() {
  document.getElementById("resetButton").classList.add("hidden");
  const startButton = document.getElementById("startButton");
  startButton.classList.remove("hidden");
  startButton.textContent = "Try Again";
}

/**
 * Evaluates the player's input and provides feedback.
 * @param {Event} event - The input event triggered by the player's interaction.
 */
function evaluateInput(event) {
  const cardBack = event.target;
  const value = parseInt(cardBack.textContent);

  if (value < 10 ** (numDigits - 1)) {
    return;
  }
  const index = parseInt(cardBack.dataset.index);

  if (value === numbers[index]) {
    handleCorrectInput(cardBack, index);
  } else {
    handleIncorrectInput(cardBack);
  }

  setTimeout(checkWinCondition, 200);
}

/**
 * Handles the scenario when the player's input is correct.
 * @param {HTMLElement} cardBack - The back of the card.
 * @param {number} index - The index of the card.
 */
function handleCorrectInput(cardBack, index) {
  cardBack.classList.add("correct");
  cardBack.classList.remove("incorrect", "empty");
  cardBack.contentEditable = false;
  focusNextElement(index);
}

/**
 * Handles the scenario when the player's input is incorrect.
 * @param {HTMLElement} cardBack - The back of the card.
 */
function handleIncorrectInput(cardBack) {
  cardBack.classList.add("incorrect");
  cardBack.parentElement.parentElement.classList.add("shake");

  cardBack.classList.remove("correct", "empty");

  // Clear the input after a short delay
  setTimeout(() => {
    cardBack.textContent = "";
  }, 200);

  setTimeout(() => {
    cardBack.parentElement.parentElement.classList.remove("shake");
  }, 400);
}

/**
 * Checks if the player has won the game by matching all numbers correctly.
 */
function checkWinCondition() {
  let allCorrect = true;

  cards.forEach((cardInner) => {
    const cardBack = cardInner.querySelector(".card-back");
    const value = parseInt(cardBack.textContent);
    if (value !== numbers[cardBack.dataset.index]) {
      allCorrect = false;
    } else {
      cardBack.contentEditable = false;
    }
  });

  if (allCorrect) {
    handleWinCondition();
  }

  toggleResetAndStartButtons();
}

/**
 * Handles the scenario when the player wins the game.
 */
function handleWinCondition() {
  const endTime = new Date();
  const timeDiff = (endTime - timer) / 1000;
  const score = calculateScore(timeDiff);

  let highScore = localStorage.getItem("highScore");
  if (!highScore || score < highScore) {
    updateHighScore(score);
  }

  displayWinMessage(timeDiff, score);
  clearInterval(progressBarInterval);
}

/**
 * Calculates the player's score.
 * @param {number} timeDiff - The time difference in seconds.
 * @returns {number} The calculated score.
 */
function calculateScore(timeDiff) {
  return (timeDiff / (numDigits * numLength)).toFixed(2);
}

/**
 * Updates the high score in local storage and UI.
 * @param {number} score - The new high score.
 */
function updateHighScore(score) {
  localStorage.setItem("highScore", score);
  displayConfetti();
  displayHighScoreTooltip(score);
  highScoreBar.firstElementChild.style.display = "none";
}

/**
 * Displays a confetti animation for the high score.
 */
function displayConfetti() {
  confetti({
    particleCount: 200,
    spread: 90,
    origin: { y: 0.6 },
  });
}

/**
 * Displays the high score tooltip on the progress bar.
 * @param {number} score - The high score to display.
 */
function displayHighScoreTooltip(score) {
  const tooltip = document.createElement("div");
  tooltip.textContent = `New High Score: ${parseFloat(score).toFixed(2)}s/d`;
  tooltip.classList.add("tooltip-hs");
  progressBar.appendChild(tooltip);
}

/**
 * Displays the win message in the game area.
 * @param {number} timeDiff - The time difference in seconds.
 * @param {number} score - The player's score.
 */
function displayWinMessage(timeDiff, score) {
  gameArea.innerHTML = ""; // Clear the game area

  const winMessage = document.createElement("div");
  winMessage.textContent = `Congratulations! You completed the game in ${timeDiff.toFixed(
    2
  )} seconds. Your score: ${score}s/d.`;
  winMessage.classList.add("win-message");
  gameArea.appendChild(winMessage);
}

/**
 * Focuses on the next card for input.
 * @param {number} index - The index of the current card.
 */
function focusNextElement(index) {
  if (index === cards.length - 1) return;
  cards.forEach((cardInner) => {
    const cardBack = cardInner.querySelector(".card-back");
    if (parseInt(cardBack.dataset.index) === index + 1) {
      cardBack.focus();
    }
  });
}

/**
 * Limits the input length in elements with the specified class name.
 * @param {string} className - The class name of the elements to apply the restriction to.
 * @param {number} length - The maximum allowed length of the input.
 */
function limitInputLengthByClassName(className, length) {
  const elements = document.getElementsByClassName(className);
  Array.from(elements).forEach((element) => {
    element.addEventListener(
      "keypress",
      (e) => {
        if (element.innerHTML.length >= length) {
          e.preventDefault();
        }
      },
      false
    );
  });
}

/**
 * Ensures that the value of an input element stays within its defined minimum and maximum limits.
 * @param {HTMLElement} el - The input element to impose the min and max constraints on.
 */
function imposeMinMax(el) {
  const value = parseInt(el.value);
  if (el.value) {
    el.value = Math.max(parseInt(el.min), Math.min(value, parseInt(el.max)));
  }
}

/**
 * Displays the high score on the progress bar.
 */
function displayHighScore() {
  const highScore = localStorage.getItem("highScore");
  if (highScore) {
    const highScorePercentage = (parseFloat(highScore) * 100) / 3;
    highScoreBar.style.width = highScorePercentage + "%";
    highScoreBar.style.display = "block";
    const tooltip = document.createElement("div");
    tooltip.textContent = `High Score: ${parseFloat(highScore).toFixed(2)}s/d`;
    tooltip.classList.add("tooltip");
    highScoreBar.appendChild(tooltip);
  }
}
