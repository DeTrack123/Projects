import { useState } from 'react';
import './HelpButton.css';

function HelpButton() {
  // Track whether help modal is shown or hidden
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      {/* Help Button - always visible */}
      <button 
        className="help-button" 
        onClick={() => setShowHelp(true)}
        aria-label="Show game rules"
      >
        ❓ Help
      </button>

      {/* Help Modal - shows when button is clicked */}
      {showHelp && (
        <div className="help-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-button" 
              onClick={() => setShowHelp(false)}
              aria-label="Close help"
            >
              ✕
            </button>
            
            <h2>🎮 How to Play Hangman</h2>
            
            <div className="help-content">
              <section>
                <h3>📖 Game Rules:</h3>
                <ul>
                  <li>The computer picks a random word from a list</li>
                  <li>You must guess the word letter by letter</li>
                  <li>Click on the alphabet buttons to make your guesses</li>
                  <li>Correct guesses reveal letters in the word</li>
                  <li>Wrong guesses add parts to the hangman figure</li>
                </ul>
              </section>

              <section>
                <h3>🎯 Winning & Losing:</h3>
                <ul>
                  <li><strong>Win:</strong> Guess all letters before making 5 wrong guesses</li>
                  <li><strong>Lose:</strong> Make 5 wrong guesses and the hangman is complete</li>
                </ul>
              </section>

              <section>
                <h3>💡 Tips:</h3>
                <ul>
                  <li>Start with common vowels (A, E, I, O, U)</li>
                  <li>Then try common consonants (R, S, T, N, L)</li>
                  <li>Look for patterns in the revealed letters</li>
                  <li>You can play again after winning or losing!</li>
                </ul>
              </section>
            </div>

            <button 
              className="got-it-button" 
              onClick={() => setShowHelp(false)}
            >
              Got it! Let's Play 🎮
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default HelpButton;
