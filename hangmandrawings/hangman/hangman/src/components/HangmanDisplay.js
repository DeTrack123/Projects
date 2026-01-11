import './HangmanDisplay.css';

// HangmanDisplay component to show hangman image and wrong guesses
function HangmanDisplay({ wrongGuesses, gameStatus }) {
  
  // Get the correct image based on game state
  const getHangmanImage = () => {
    // If player WON, show Layne7.png (victory image!)
    if (gameStatus === 'won') {
      return '/Layne7.png';
    }
    const imageNumber = wrongGuesses + 1;
    return `/Layne${imageNumber}.png`;
  };

  return (
    <div className="hangman-display">
      <div className="hangman-figure">
        {/* Display the hangman image */}
        <img 
          src={getHangmanImage()} 
          alt={gameStatus === 'won' ? 'Victory!' : `Hangman stage ${wrongGuesses + 1}`}
          className="hangman-image"
        />
      </div>
      <div className="wrong-guesses-counter">
        <p>Wrong Guesses: <span className="count">{wrongGuesses}</span> / 5</p>
      </div>
    </div>
  );
}

export default HangmanDisplay;
