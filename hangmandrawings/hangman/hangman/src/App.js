// Import React's useState hook for managing game state
import { useState, useEffect } from 'react';
import './App.css';
import GameStatus from './components/GameStatus';
import HangmanDisplay from './components/HangmanDisplay';
import WordDisplay from './components/WordDisplay';
import Keyboard from './components/Keyboard';
import HelpButton from './components/HelpButton';

function App() {
  
  // Your custom words!
  const wordList = ['spaghetti', 'banana', 'unicorn', 'ninja', 'donut', 'penguin', 'taco'];

  // The word the player is trying to guess
  const [word, setWord] = useState('');
  
  // Array of letters the player has guessed
  const [guessedLetters, setGuessedLetters] = useState([]);
  
  // Number of wrong guesses made
  const [wrongGuesses, setWrongGuesses] = useState(0);
  
  // Game status: 'playing', 'won', or 'lost'
  const [gameStatus, setGameStatus] = useState('playing');
  
  // Maximum wrong guesses allowed before game over
  const MAX_WRONG_GUESSES = 5;

  // useEffect with empty dependency array [] runs only once when component mounts
  useEffect(() => {
    startNewGame();
  }, []);
  
  // Picks a random word and resets all game state
  const startNewGame = () => {
    // Pick a random word from the word list
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    
    setWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
  };
  
  
  // Handle when player guesses a letter
  const handleGuess = (letter) => {
    // Don't allow guessing if game is over
    if (gameStatus !== 'playing') return;
    
    // Don't allow guessing same letter twice
    if (guessedLetters.includes(letter)) return;
    
    // Add the letter to guessed letters array
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    
    // Check if the letter is in the word
    if (!word.includes(letter)) {
      // Wrong guess! Increment wrong guesses
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      // Check if player has lost (too many wrong guesses)
      if (newWrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
      }
    } else {
      // Player wins when all letters in the word have been guessed
      checkWin(newGuessedLetters);
    }
  };
  
  // Player wins when all unique letters in the word have been guessed
  const checkWin = (guessedLetters) => {
    // Get all unique letters in the word
    const wordLetters = [...new Set(word.split(''))];
    
    // Check if every letter in the word has been guessed
    const hasWon = wordLetters.every(letter => guessedLetters.includes(letter));
    
    if (hasWon) {
      setGameStatus('won');
    }
  };
  
  // Display all components in a grid layout
  return (
    <div className="App">
      {/* Help button - fixed in top-right corner */}
      <HelpButton />
      
      {/* 3 column layout */}
      <div className="game-content">
        {/* Game title and status messages */}
        <GameStatus 
          gameStatus={gameStatus}
          word={word}
          onReset={startNewGame}
        />
        
        {/* Hangman figure display */}
        <HangmanDisplay 
          wrongGuesses={wrongGuesses}
          gameStatus={gameStatus}
        />
        
        {/* Word display AND keyboard underneath */}
        <div className="word-and-keyboard-section">
          {/* Word with guessed letters revealed */}
          <WordDisplay 
            word={word}
            guessedLetters={guessedLetters}
          />
          
          {/* Alphabet keyboard for guessing */}
          <Keyboard 
            onGuess={handleGuess}
            guessedLetters={guessedLetters}
            isGameOver={gameStatus !== 'playing'}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
