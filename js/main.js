document.addEventListener('DOMContentLoaded', () => {
  // Draw empty board
  createSquares();

  // Varibles for Handling Key Presses
  const guessedWords = [[]];
  let availableSpace = 1;
  let word = 'dairy';
  let guessedWordCount = 0;

  // Keyboard Event Listeners
  const keys = document.querySelectorAll('.keyboard-row button');

  for (let index = 0; index < keys.length; index++) {
    keys[index].onclick = ({target}) => {
      const letter = target.getAttribute('data-key');
  
      if (letter === 'enter'){
        handleSubmitWord();
        return;
      }

      handleGuessedLetter(letter);
    }
  }

  function handleSubmitWord () {
    const currentWordArr = getCurrentWordArray();
    if (currentWordArr.length !== 5){
      window.alert("Not enough letters");
    }

    const currentWord = currentWordArr.join('');
    const firstLetterId = guessedWordCount * 5 + 1;
    const interval = 200;

    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = "rgb(211, 214, 218)";

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

    console.log('Guessed words: ', guessedWords)
    console.log('Available space: ', availableSpace);
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