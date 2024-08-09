document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("resetButton").addEventListener("click", () => window.location.reload()); // to reset the game and timeouts


let gameMode;
let numLength;
let numDigits;
let numbers;
let cards;
let timer;

/**
 * Initializes the game settings and starts the game.
 */
function startGame() {
  gameMode = document.getElementById("gameMode").value;
  numLength = document.getElementById("numLength").value;
  numDigits = document.getElementById("numDigits").value;

  document.getElementById("startButton").classList.add("hidden");
  document.getElementById("resetButton").classList.remove("hidden");

  numbers = generateRandomNumbers(numLength);
  setupGameArea();
  displayNumbers();
}

/**
 * Generates an array of random numbers based on the game settings.
 * @returns {Array} Array of random numbers.
 */
function generateRandomNumbers() {
  let nums = [];
  for (let i = 0; i < numLength; i++) {
    nums.push(
      Math.floor(Math.random() * (9 * 10 ** (numDigits - 1))) +
        10 ** (numDigits - 1)
    );
  }
  return nums;
}

/**
 * Sets up the game area by creating card elements.
 */
function setupGameArea() {
  const gameArea = document.getElementById("gameArea");
  gameArea.innerHTML = "";
  cards = [];

  for (let i = 0; i < numLength; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.dataset.index = i;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    gameArea.appendChild(card);
    cards.push(cardInner);
  }
}

/**
 * Displays the numbers on the in different orders with an animation.
 */
function displayNumbers() {
  function showNumber() {
    if (index < numbers.length) {
      const cardBack = cards[index].querySelector(".card-back");
      cardBack.textContent = numbers[cardBack.dataset.index];
      cards[index].classList.add("flip");
      index++;
      setTimeout(hideNumber, 1000);
    } else {
      cards.map((card)=> card.classList.remove("flip"));
      setTimeout(startMemoryPhase, 3000);
    }
  }

  function hideNumber() {
    if (gameMode === "pro" || gameMode === "chaotic") {
      cards[index - 1].classList.remove("flip");
      setTimeout(() => {}, 600);
    }
    setTimeout(showNumber, 1000);
  }

  let index = 0;

  if (gameMode === "chaotic") {
    cards.sort(() => 0.5 - Math.random());
  }

  setTimeout(showNumber, 700);
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
  preventKeyPressbyClassname("card-back", numDigits);
  focusNextElement(-1); // focuses the first card
  timer = new Date();
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
    cardBack.classList.add("correct");
    cardBack.classList.remove("incorrect", "empty");
    cardBack.contentEditable = false;
    focusNextElement(index);
  } else {
    cardBack.classList.add("incorrect");
    cardBack.parentElement.parentElement.classList.add("shake");

    cardBack.classList.remove("correct", "empty");

    setTimeout(() => {
      cardBack.textContent = "";
    }, 200);

    setTimeout(() => {
      cardBack.parentElement.parentElement.classList.remove("shake");
    }, 400);
  }

  setTimeout(checkWinCondition, 200);
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
    const endTime = new Date();
    const timeDiff = (endTime - timer) / 1000;
    alert(`Congratulations! You completed the game in ${timeDiff} seconds.`);
  }
}

/**
 * Focuses on the next card for input.
 * @param {number} index - The index of the current card.
 */
function focusNextElement(index) {
  if (index == cards.length - 1) return;
  cards.map((cardInner) => {
    const cardBack = cardInner.querySelector(".card-back");
    if (cardBack.dataset.index == index + 1) {
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
  var elements = document.getElementsByClassName(className);
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener(
      "keypress",
      function (e) {
        if (this.innerHTML.length >= length) {
          e.preventDefault();
          return false;
        }
      },
      false
    );
  }
}

/**
 * Ensures that the value of an input element stays within its defined minimum and maximum limits.
 * If the value is less than the minimum, it sets the value to the minimum.
 * If the value is greater than the maximum, it sets the value to the maximum.
 * 
 * @param {HTMLElement} el - The input element to impose the min and max constraints on.
 */
function imposeMinMax(el) {
  if (el.value != "") {
    if (parseInt(el.value) < parseInt(el.min)) {
      el.value = el.min;
    }
    if (parseInt(el.value) > parseInt(el.max)) {
      el.value = el.max;
    }
  }
}

