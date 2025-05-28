const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");
const hintText = document.querySelector(".hint-text b"); // Seleciona o elemento da dica

// As variaveis iniciais do jogo
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    // Reseta o game e as letras após o término do jogo
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "../hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Seleciona um conjunto de palavra e dica aleatório na wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word.toUpperCase(); // Converter a palavra para maiúsculas para comparação consistente
    hintText.innerText = hint; // Exibe a dica
    resetGame();
}

const gameOver = (isVictory) => {
    // Depois que o jogo se encerra, exibe os detalhes relevantes no modal
    const modalText = isVictory ? `Você encontrou a palavra:` : 'A palavra correta era:';
    gameModal.querySelector("img").src = `./assets/image/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Parabéns!' : 'Fim de Jogo!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

const initGame = (button, clickedLetter) => {
    // Checar se a letra selecionada existe na palavra da vez
    const upperClickedLetter = clickedLetter.toUpperCase(); // Converter a letra clicada para maiúsculas
    button.disabled = true; // Desabilita o botão clicado pelo jogador para evitar repetição

    if (currentWord.includes(upperClickedLetter)) {
        // Demonstra todas letras encontradas no wordDisplay
        [...currentWord].forEach((letter, index) => {
            if (letter === upperClickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // Caso o jogador selecione uma letra errada, atualiza a imagem do Hangman
        wrongGuessCount++;
        hangmanImage.src = `../image/hangman-${wrongGuessCount}.svg`;
    }
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Ativa a função de "gameover" quando as condições são atendidas
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}

// Criou o teclado interativo e adicionou os ouvintes de evento (EventListener)
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    const letter = String.fromCharCode(i).toUpperCase(); // Converter a letra para maiúsculas no botão
    button.innerText = letter;
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, letter)); // Passar a letra maiúscula para initGame
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);