import './WordDisplay.css';

// WordDisplay component to show guessed letters and underscores for letters not yet guessed
function WordDisplay({ word, guessedLetters }) {
  
  // Takes the word and checks if each letter has been guessed
  const displayWord = () => {

    // Map through each letter to decide if we show it or hide it
    return word.split('').map((letter, index) => {

      // Convert to lowercase to match our guessed letters
      const isGuessed = guessedLetters.includes(letter.toLowerCase());
      
      // Return a span for each letter with a unique key
      return (
        <span key={index} className="letter-box">
          {isGuessed ? letter.toUpperCase() : '_'}
        </span>
      );
    });
  };

  return (
    <div className="word-display">
      <h2>Guess the Word!</h2>
      <div className="letters-container">
        {displayWord()}
      </div>
    </div>
  );
}

export default WordDisplay;
