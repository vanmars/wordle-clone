import 'dotenv/config'

document.addEventListener('DOMContentLoaded', () => {
  // Draw empty board
  createSquares();

  // Varibles for Handling Key Presses
  const guessedWords = [[]];
  let availableSpace = 1;
  let word;
  let guessedWordCount = 0;

  getNewWord();

  // Keyboard Event Listeners
  const keys = document.querySelectorAll('.keyboard-row button');

  for (let index = 0; index < keys.length; index++) {
    keys[index].onclick = ({target}) => {
      const letter = target.getAttribute('data-key');
  
      if (letter === 'enter'){
        handleSubmitWord();
        return;
      }

      if (letter === 'del') {
        handleDeleteLetter();
        return;
      }

      handleGuessedLetter(letter);
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArray();
    const removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;
    
    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = '';
    availableSpace = availableSpace - 1;
  };

  function getNewWord() {
    try {
      fetch("https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5", {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": process.env.WORDS_API_KEY
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((jsonifiedResponse) => {
        word = jsonifiedResponse.word;
      })
    } catch(err) {
      console.error('Error: ', err);
    }
  }

  function getTileColor(letter, index){
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(211, 214, 218)"
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter.toLowerCase() === letterInThatPosition.toLowerCase();

    if (isCorrectPosition) {
      return "rgb(83, 141, 78";
    } else {
      return "rgb(181, 159, 59)";
    }
  };

  function handleSubmitWord () {
    const currentWordArr = getCurrentWordArray();
    if (currentWordArr.length !== 5){
      window.alert("Not enough letters");
    }

    const currentWord = currentWordArr.join('');

    fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": process.env.WORDS_API_KEY
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw Error();
      };

      const firstLetterId = guessedWordCount * 5 + 1;
      const interval = 200;
  
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const tileColor = getTileColor(letter, index);
  
          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId);
          letterEl.classList.add("animate__flipInX");
          letterEl.style = `background-color:${tileColor}`;
        }, interval * index)
      })
  
      guessedWordCount += 1;
  
      if (currentWord === word){
        window.alert('Congratulations!');
      }
  
      guessedWords.push([]);
  
      if (guessedWords.length === 6){
        window.alert(`Sorry, you have no more guesses! The word is ${word}`);
      };
    }).catch(() => {
      window.alert('Word not recognized')
    })
    
  }  

  function getCurrentWordArray(){
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  };

  function handleGuessedLetter(letter){
    const currentWordArray = getCurrentWordArray();
    if (currentWordArray && currentWordArray.length < 5) {
      currentWordArray.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));
      availableSpace = availableSpace + 1;

      availableSpaceEl.textContent = letter;
    }
  };

  function createSquares() {
    const gameBoard = document.getElementById('board');
    for(let index=0; index<30; index++){
      let square = document.createElement('div');
      square.classList.add('square');
      square.classList.add('animate__animated');
      square.setAttribute('id', index + 1);
      gameBoard.appendChild(square);
    }
  };
})