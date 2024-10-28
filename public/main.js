const goButton = document.getElementById("go");
const nextButton = document.getElementById("next");
const resultsDiv = document.querySelector(".results");
const guessDiv = document.querySelector(".guess");
const guessTextBox = document.getElementById("guess");
const currentGuessParagraphs = document.querySelectorAll(".currentGuess");
const previousGuessParagraph = document.getElementById("previousGuess");
const historyOfGuessesParagraph = document.getElementById("pastGuesses");
const hideAtTheBeginning = document.querySelectorAll(".hideAtTheBeginning");
const scoreSpan = document.getElementById("score");
const explanationParagraph = document.getElementById("explanation");
const chat = document.getElementById("chatOutput");
const textXL = document.getElementById("success");
const loseDiv = document.querySelector("lose");
const restartButton = document.getElementById("restart");
const previousEmoji = document.getElementById("previousEmoji")
const currentEmoji = document.querySelectorAll(".currentEmoji")

let guessArray = [{"name": "rock", "emoji": "🪨"}];

document.body.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    submitGuess();
  }
});

async function submitGuess() {
  if (guessTextBox.value) {
    //variables
    const userGuess = guessTextBox.value;
    const previousGuess = guessArray[0].name;

    //fetch
    const apiURL = `http://localhost:3000/api/whatbeatsrock/${previousGuess}/${userGuess}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    
    //add new guess and emoji
    guessArray.unshift({"name": userGuess, "emoji": data.emoji});

    //update first emoji (there is one currentEmoji, but it goes in multiple places)
    for (let i = 0; i < currentEmoji.length; i++) {
      currentEmoji[i].innerText = guessArray[0].emoji;
    }

    //update explanation
    chat.innerText = data.details;

    //uptade seccond emoji
    previousEmoji.innerText = guessArray[1].emoji

    //show new screen
    guessDiv.style.display = "none";
    resultsDiv.style.display = "block";

    //erase text box
    guessTextBox.value = "";

    //update paragraphs
    for (let i = 0; i < currentGuessParagraphs.length; i++) {
      currentGuessParagraphs[i].innerText = guessArray[0].name;
    }
    previousGuessParagraph.innerText = guessArray[1].name;
    //update hystory
    historyOfGuessesParagraph.innerText = `${guessArray[0].name} 🤜 ${historyOfGuessesParagraph.innerText}`;

    //hide at the beginning
    for (let i = 0; i < hideAtTheBeginning.length; i++) {
      hideAtTheBeginning[i].style.display = "block";
    }

    //if we lose
    if (data.winner.toLowerCase() != userGuess) {
      success.innerText = "did not beat";
      restartButton.style.display = "block";
      nextButton.style.display = "none";
    }

    //update score
    scoreSpan.innerText = guessArray.length - 1;
  }
}

goButton.addEventListener("click", () => {
  submitGuess();
});

nextButton.addEventListener("click", () => {
  guessDiv.style.display = "block";
  resultsDiv.style.display = "none";
});

document.body.addEventListener("keypress", (event) => {
  console.log(`you typed ${event.key}`);
});

guessTextBox.addEventListener("keypress", () => {
  if (guessTextBox.value.length > 0) {
    goButton.disabled = false;
  } else {
    goButton.disabled = true;
  }
});

restartButton.addEventListener("click", () => {
  location.reload();
});
