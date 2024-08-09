# Memory Coach

Memory Coach is a memory training game developed using JavaScript, HTML, and CSS. The game challenges users to remember and correctly input sequences of numbers, testing and improving memory skills through various game modes and levels of difficulty.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Game Modes](#game-modes)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Memory Coach is designed to provide a fun and engaging way to sharpen your memory skills. In the game, sequences of numbers are shown briefly and then hidden. Your task is to remember the numbers and enter them correctly to progress through the game. The game offers multiple difficulty levels and customizable settings, allowing players to adjust the challenge to their liking.

## Features

- **Multiple Difficulty Levels**: Choose from Easy, Pro, and Chaotic modes to match your memory skill level.
- **Customizable Game Settings**: Adjust the number of cards and the number of digits to control the difficulty.
- **Real-time Feedback**: Immediate visual feedback for correct or incorrect inputs.
- **Sound Effects**: Audio feedback for correct, incorrect, and winning actions.
- **Responsive Design**: The game adapts to different screen sizes, ensuring a good user experience across devices.

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/yourusername/memory-coach.git
    ```

2. Navigate to the project directory:

    ```bash
    cd memory-coach
    ```

3. Open `index.html` in your web browser to start the game.

## How to Play

1. **Configure the Game**:
    - Select the number of cards.
    - Choose the number of digits.
    - Pick a game mode: Easy, Pro, or Chaotic.

2. **Start the Game**: Click the "Start" button to begin.

3. **Memorize**: Watch the numbers as they appear briefly on the screen.

4. **Recall**: After the numbers disappear, re-enter them in the correct order.

5. **Win**: If all inputs are correct, you win! The game will display the time you took to complete the challenge.

## Game Modes

- **Easy Mode**: Numbers appear sequentially and stay visible until all have been shown. Then, they disappear simultaneously.
- **Pro Mode**: Numbers appear sequentially but disappear one by one after a short delay.
- **Chaotic Mode**: Numbers appear in random order and disappear one by one, making the task much more challenging.

## Technologies Used

- **HTML5**: Structure and layout of the game.
- **CSS3**: Styling and animations.
- **JavaScript**: Core game logic and interactivity.
- **Audio**: Sound effects for better user engagement.

## Project Structure

```bash
Memory Coach/
│
├── index.html         # Main HTML file
├── styles.css         # CSS file for styling
├── script.js          # JavaScript file for game logic
└── sounds/            # Folder containing sound files
```

## Customization

- **Styling**: Modify `styles.css` to change the visual appearance of the game.
- **Game Logic**: Edit `script.js` to add new features, modify game mechanics, or change the behavior of existing features.
- **Sounds**: Replace the sound files in the `sounds/` directory to customize the audio feedback.

## Future Improvements

- **Leaderboard**: Implement a leaderboard to track high scores.
- **Additional Game Modes**: Add more challenging game modes or customizable difficulty settings.
- **Accessibility**: Enhance the game for better accessibility, including keyboard navigation and screen reader support.

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Contributions, whether they are bug fixes, new features, or documentation improvements, are always welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
