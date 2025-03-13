/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

// Game constants
const MAX_STRIKES = 3;
const MAX_PASSES = 2;
const WORDS = [
  "javascript",
  "programming",
  "developer",
  "computer",
  "keyboard",
  "monitor",
  "website",
  "frontend",
  "backend",
  "database",
  "network",
  "algorithm"
];

// Main App component
const App = () => {
  // Get game state from localStorage or initialize new game
  const getInitialState = () => {
    const savedState = localStorage.getItem('scrambleGameState');
    if (savedState) {
      return JSON.parse(savedState);
    }
    
    return {
      words: shuffle([...WORDS]),
      currentWordIndex: 0,
      points: 0,
      strikes: 0,
      passes: MAX_PASSES,
      gameOver: false,
      message: "Unscramble the word!",
      messageType: "normal"
    };
  };

  // State initialization
  const [gameState, setGameState] = React.useState(getInitialState);
  const [guess, setGuess] = React.useState("");
  
  // Get current word and its scrambled version
  const currentWord = gameState.words[gameState.currentWordIndex];
  const scrambledWord = currentWord ? shuffle(currentWord) : "";
  
  // Save game state to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('scrambleGameState', JSON.stringify(gameState));
  }, [gameState]);

  // Handle user guess
  const handleGuess = (e) => {
    e.preventDefault();
    
    if (!guess.trim() || gameState.gameOver) return;
    
    if (guess.toLowerCase() === currentWord) {
      // Correct guess
      handleCorrectGuess();
    } else {
      // Wrong guess
      handleWrongGuess();
    }
    
    // Clear input after guess
    setGuess("");
  };

  // Handle correct guess
  const handleCorrectGuess = () => {
    const newPoints = gameState.points + 1;
    const newIndex = gameState.currentWordIndex + 1;
    const allWordsUsed = newIndex >= gameState.words.length;
    
    setGameState(prev => ({
      ...prev,
      points: newPoints,
      currentWordIndex: newIndex,
      gameOver: allWordsUsed,
      message: allWordsUsed ? `Game over! You got ${newPoints} points!` : "Correct! Good job!",
      messageType: "success"
    }));
  };

  // Handle wrong guess
  const handleWrongGuess = () => {
    const newStrikes = gameState.strikes + 1;
    const isGameOver = newStrikes >= MAX_STRIKES;
    
    setGameState(prev => ({
      ...prev,
      strikes: newStrikes,
      gameOver: isGameOver,
      message: isGameOver ? `Game over! You got ${prev.points} points!` : "Wrong! Try again!",
      messageType: isGameOver ? "normal" : "error"
    }));
  };

  // Handle input change
  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  // Use a pass
  const handlePass = () => {
    if (gameState.passes <= 0 || gameState.gameOver) return;
    
    const newIndex = gameState.currentWordIndex + 1;
    const allWordsUsed = newIndex >= gameState.words.length;
    
    setGameState(prev => ({
      ...prev,
      passes: prev.passes - 1,
      currentWordIndex: newIndex,
      gameOver: allWordsUsed,
      message: allWordsUsed ? `Game over! You got ${prev.points} points!` : "Word skipped!",
      messageType: "normal"
    }));
  };

  // Restart the game
  const handleRestart = () => {
    setGameState({
      words: shuffle([...WORDS]),
      currentWordIndex: 0,
      points: 0,
      strikes: 0,
      passes: MAX_PASSES,
      gameOver: false,
      message: "Unscramble the word!",
      messageType: "normal"
    });
  };

  return (
    <div className="game-container">
      <h1>Scramble Game</h1>
      
      <div className="game-stats">
        <div>Points: {gameState.points}</div>
        <div>Strikes: {gameState.strikes}/{MAX_STRIKES}</div>
        <div>Passes: {gameState.passes}/{MAX_PASSES}</div>
      </div>
      
      <div className={`game-message ${gameState.messageType}`}>
        {gameState.message}
      </div>
      
      {!gameState.gameOver ? (
        <>
          <div className="scrambled-word">{scrambledWord}</div>
          
          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={handleInputChange}
              placeholder="Enter your guess"
              autoFocus
            />
            <button type="submit">Submit</button>
          </form>
          
          <button 
            onClick={handlePass}
            disabled={gameState.passes <= 0}
            className={gameState.passes <= 0 ? "disabled" : ""}
          >
            Pass ({gameState.passes} left)
          </button>
        </>
      ) : (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your score: {gameState.points}</p>
          <button onClick={handleRestart}>Play Again</button>
        </div>
      )}
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);