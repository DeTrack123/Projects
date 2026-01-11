# Hangman Game - React Capstone Project

A classic Hangman word-guessing game built with React. Players try to guess a hidden word one letter at a time before running out of attempts!

## 🎮 Game Rules

- A random word is chosen at the start of each game
- You have **5 wrong guesses** before you lose
- Click letter buttons to make guesses
- Correct guesses reveal letters in the word
- Wrong guesses advance the hangman figure
- Win by guessing all letters before the hangman is complete
- Lose if you make 5 incorrect guesses

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or download this project to your local machine

2. Navigate to the project directory:
```bash
cd hangman
```

3. Install dependencies:
```bash
npm install
```

### Running the Game

Start the development server:
```bash
npm start
```

The game will automatically open in your browser at `http://localhost:3000`

## 🛠️ Technologies Used

- **React 18+** - JavaScript library for building user interfaces
- **Create React App** - Project scaffolding and build tool
- **CSS3** - Styling with modern features like Grid and Flexbox
- **React Hooks** - useState and useEffect for state management

## 📁 Project Structure

```
hangman/
├── public/
│   ├── index.html          # HTML template
│   ├── Layne1.png          # Hangman figure stages
│   ├── Layne2.png
│   ├── Layne3.png
│   ├── Layne4.png
│   ├── Layne5.png
│   ├── Layne6.png
│   └── Layne7.png          # Victory image
├── src/
│   ├── App.js              # Main game logic and state management
│   ├── App.css             # Main layout styling
│   ├── components/
│   │   ├── GameStatus.js   # Game instructions and status messages
│   │   ├── GameStatus.css
│   │   ├── HangmanDisplay.js  # Displays hangman figure images
│   │   ├── HangmanDisplay.css
│   │   ├── WordDisplay.js  # Shows word with guessed letters
│   │   ├── WordDisplay.css
│   │   ├── Keyboard.js     # Alphabet button grid
│   │   ├── Keyboard.css
│   │   ├── LetterButton.js # Individual letter buttons
│   │   ├── LetterButton.css
│   │   ├── HelpButton.js   # Help modal with game rules
│   │   └── HelpButton.css
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
└── package.json            # Project dependencies and scripts
```

## 🎯 Key Features

- **Responsive Design** - 3-column grid layout that adapts to screen size
- **Interactive UI** - Visual feedback for button states (hover, disabled)
- **State Management** - Centralized game state with React hooks
- **Component Architecture** - 6 reusable React components
- **Custom Graphics** - Unique Layne character images for hangman stages
- **Help System** - Built-in help button with comprehensive game rules
- **Play Again** - Easy restart functionality after each game

## 📝 Component Overview

### App.js
Main game controller that manages:
- Word selection from a curated list
- Tracking guessed letters and wrong guesses
- Game status (playing/won/lost)
- Win/loss condition checking

### GameStatus
Displays game instructions, win/loss messages, and the Play Again button.

### HangmanDisplay
Shows the appropriate hangman figure image based on wrong guesses or victory state.

### WordDisplay
Renders the target word with correctly guessed letters revealed and unguessed letters hidden.

### Keyboard
Creates a full alphabet keyboard using array mapping over 26 letters.

### LetterButton
Individual button component for each letter with state-based styling.

### HelpButton
Fixed-position help button that opens a modal with detailed game rules and tips.

## 🎨 Styling Features

- Gradient backgrounds with vibrant colors
- Smooth animations and transitions
- Clear visual hierarchy
- Disabled button states for guessed letters
- Modal overlay for help system
- Consistent spacing and typography

## 👤 Author

**Christo Swanepoel**
- Capstone Project for React Course

