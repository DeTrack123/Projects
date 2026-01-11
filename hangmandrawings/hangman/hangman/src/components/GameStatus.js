import './GameStatus.css';

// GameStatus component to display messages based on game status
function GameStatus({ gameStatus, word, onReset }) {
  
  // If game is in progress (not won or lost)
  if (gameStatus === 'playing') {
    return (
      <div className="game-status playing">
        <h2>🎮 Hangman Game</h2>
        <p className="instructions">
          Click the letters below to guess the word!<br />
          Be careful - you only have 6 wrong guesses before the game is over!
        </p>
      </div>
    );
  }
  
  // If player WON the game
  if (gameStatus === 'won') {
    return (
      <div className="game-status won">
        <h2>🎉 YOU WON! 🎉</h2>
        <p className="message">
          Congratulations! You guessed the word: <strong>{word.toUpperCase()}</strong>
        </p>
        <button className="play-again-btn" onClick={onReset}>
          🔄 Play Again
        </button>
      </div>
    );
  }
  
  // If player LOST the game
  if (gameStatus === 'lost') {
    return (
      <div className="game-status lost">
        <h2>💀 GAME OVER 💀</h2>
        <p className="message">
          You ran out of guesses! The word was: <strong>{word.toUpperCase()}</strong>
        </p>
        <button className="play-again-btn" onClick={onReset}>
          🔄 Try Again
        </button>
      </div>
    );
  }
  
  return null;
}

export default GameStatus;
