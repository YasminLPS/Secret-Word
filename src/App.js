//CSS
import './App.css';

//React
import {useCallback, useEffect, useState} from 'react';

//data
import {wordsList} from './data/words';

//Components
import StartScreen from './Components/StartScreen';
import Game from './Components/Game';
import GameOver from './Components/GameOver';


const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setpickedCategory] = useState("");
  const [letters, setLetters] = useState ([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore]= useState(0)

  const pickWordAndPickCategory = useCallback(() =>{
    // pick random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}

  }, [words]);

  //Start the secret words game
  const startGame = useCallback(() =>{
    //clear all letters
    clearLetterStates()

    //pick word and pick category
    const {word, category} = pickWordAndPickCategory();

    //create an array of letter
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //fill states
    setPickedWord(word);
    setpickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name)


  }, [pickWordAndPickCategory]);

  //process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return; 
    }

    //push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){

      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter,
      ]);

    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter,
      ]);
      
      setGuesses((actualGuesses) => actualGuesses -1)
      
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //check if guesses end
  useEffect(() => {
    if(guesses <= 0){
      //reset all startes
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

    //check if win condition
    useEffect(() => {
      const uniqueLetters = [...new Set(letters)]
      
      //win condition
      if(guessedLetters.length === uniqueLetters.length){
        //add score
        setScore((actualScore) => actualScore += 100);

        //restart game with new word
        startGame();
      }

    }, [guessedLetters,letters, startGame])

  // restarts the game 
  const retray = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && 
      <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord}  
      pickedCategory={pickedCategory} 
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
      {gameStage === 'end' && <GameOver retray={retray} score={score}/>}

    </div>
  );
}

export default App;
