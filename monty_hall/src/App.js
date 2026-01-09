import { useState } from "react";
import "./App.css";

function App() {
  
  // Track which door the player has selected (1, 2, 3, or null)
  const [selectedDoor, setSelectedDoor] = useState(null);
  
  //Generate a random number between 1 and 3
  const [winningDoor, setWinningDoor] = useState(() => Math.floor(Math.random() * 3) + 1);
  
  // Track what phase of the game we're in:
  // "selecting" = player picks first door
  // "revealing" = Monty opens a losing door  
  // "final" = player makes final choice
  // "finished" = show win/lose result
  const [gamePhase, setGamePhase] = useState("selecting");
  
  // Track which door Monty opened (1, 2, 3, or null)
  const [montyOpenedDoor, setMontyOpenedDoor] = useState(null);


  // Determines which door Monty should open
  const getMontyDoor = (userChoice) => {
    const allDoors = [1, 2, 3];
    
    // Filter out doors that Monty CANNOT open
    const availableDoors = allDoors.filter(door => 
      door !== userChoice && door !== winningDoor
    );
    
    // If there are multiple doors available, pick the first one
    return availableDoors[0];
  };

  // This function receives the door number that was clicked
  const handleDoorClick = (doorNumber) => {
    
    // Initial door selection
    if (gamePhase === 'selecting') {
      setSelectedDoor(doorNumber);
      setGamePhase('revealing');
      setMontyOpenedDoor(getMontyDoor(doorNumber));
    } 
    
    // Final door choice (after clicking "Make Final Choice!" button)
    else if (gamePhase === 'final') {
      setSelectedDoor(doorNumber);
      setGamePhase('finished');
    }
  };

  // Start a new game with a NEW random winning door
  const resetGame = () => {
    setSelectedDoor(null);
    setGamePhase('selecting');
    setMontyOpenedDoor(null);
    setWinningDoor(Math.floor(Math.random() * 3) + 1);
  };

  // This return statement defines the HTML structure of our game
  return (
    <div className="App">
      <h1>🚪 Monty Hall Game 🚪</h1>
      <div className="doors-container">
        
        {/* DOOR 1 */}
        <div className="door" onClick={() => handleDoorClick(1)}>
          Door 1
          {selectedDoor === 1 && " ✓SELECTED"}
          {montyOpenedDoor === 1 && " ❌OPENED"}
        </div>
        
        {/* DOOR 2 */}
        <div className="door" onClick={() => handleDoorClick(2)}>
          Door 2
          {selectedDoor === 2 && " ✓SELECTED"}
          {montyOpenedDoor === 2 && " ❌OPENED"}
        </div>
        
        {/* DOOR 3 */}
        <div className="door" onClick={() => handleDoorClick(3)}>
          Door 3
          {selectedDoor === 3 && " ✓SELECTED"}
          {montyOpenedDoor === 3 && " ❌OPENED"}
        </div>
      </div>

      {/* Show after user picks initial door */}
      {gamePhase === 'revealing' && (
        <div>
          <p>Monty has opened a losing door! Now choose your final door:</p>
          <button onClick={() => setGamePhase('final')}>
            Make Final Choice!
          </button>
        </div>
      )}

      {/*Show game results */}
      {gamePhase === 'finished' && (
        <div>
          <h2>
            {selectedDoor === winningDoor ? "🎉 YOU WON! 🎉" : "😞 You Lost! 😞"}
          </h2>
          <p>The prize was behind Door {winningDoor}</p>
          <p>You chose Door {selectedDoor}</p>
          <button onClick={resetGame}>
            Play Again!
          </button>
        </div>
      )}
    </div>
  );
}
export default App;
