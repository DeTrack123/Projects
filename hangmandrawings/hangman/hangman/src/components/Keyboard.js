import LetterButton from './LetterButton';
import './Keyboard.css';

// Keyboard component to display all alphabet letters as buttons
function Keyboard({ onGuess, guessedLetters, isGameOver }) {

  // We'll use map() to create a button for each letter
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="keyboard">
      <h3>Click a letter to guess:</h3>
      <div className="keyboard-container">
        {/* This creates a LetterButton component for each letter */}
        {alphabet.map((letter) => (
          <LetterButton
            key={letter} 
            letter={letter}
            onGuess={onGuess}
            isGuessed={guessedLetters.includes(letter)}
            isDisabled={isGameOver}
          />
        ))}
      </div>
    </div>
  );
}

export default Keyboard;
