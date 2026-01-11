import './LetterButton.css';

// LetterButton component for individual letter buttons in the keyboard
function LetterButton({ letter, onGuess, isGuessed, isDisabled }) {
  
  // Handle when user clicks a letter button
  const handleClick = () => {
    // Only allow click if the letter hasn't been guessed yet and game isn't over
    if (!isGuessed && !isDisabled) {
      onGuess(letter);
    }
  };

  return (
    <button
      className={`letter-button ${isGuessed ? 'guessed' : ''} ${isDisabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={isGuessed || isDisabled}
    >
      {letter.toUpperCase()}
    </button>
  );
}

export default LetterButton;
