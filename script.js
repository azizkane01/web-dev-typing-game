const words = ['ordinateur', 'clavier', 'souris', 'espace', 'internet', 'programme', 'fichier', 'dossier', 'thiaroye', 'logiciel', 'pikine', 'serveur', 'dakar', 'sauvegarde', 'saloum','lalala'];

let currentWord = '';
let score = 0;
let timeLeft = 60;
let progress_bar=0;
let totalWords = 0;
let correctWords = 0;
let gameActive = false;
let gameTimer = null;
let startTime = null;

const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const scoreDisplay = document.getElementById('score-display');
const timeDisplay = document.getElementById('time-display');
const wpmDisplay = document.getElementById('wpm-display');
const accuracyDisplay = document.getElementById('accuracy-display');
const progressFill = document.getElementById('progress-fill');
const commencerBtn = document.getElementById('commencer');
const recommencerBtn = document.getElementById('recommencer');
const gameSummary = document.getElementById('game-summary');
const finalScore = document.getElementById('final-score');
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function displayNewWord() {
    currentWord = getRandomWord();
    wordDisplay.textContent = currentWord;
    wordDisplay.className = 'word-display';
    wordInput.value = '';
}

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 60;
    totalWords = 0;
    correctWords = 0;
    startTime = Date.now();

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    progressFill.style.width = '100%';

    commencerBtn.disabled = true;
    recommencerBtn.disabled = false;
    wordInput.disabled = false;
    wordInput.focus();

    gameSummary.style.display = 'none';

    displayNewWord();

    gameTimer = setInterval(() => {
        timeLeft--;
        progress_bar++;
        timeDisplay.textContent = timeLeft;
        progressFill.style.width = (progress_bar / 60) * 100 + '%';

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    wordInput.disabled = true;
    wordDisplay.textContent = 'Partie terminée !';
    wordDisplay.className = 'word-display';

    const finalWpmValue = Math.round(calculateWPM());
    const finalAccuracyValue = Math.round(calculateAccuracy());

    finalScore.textContent = score;
    finalWpm.textContent = finalWpmValue;
    finalAccuracy.textContent = finalAccuracyValue;
    gameSummary.style.display = 'block';

    commencerBtn.disabled = false;
}

function calculateWPM() {
    const timeElapsed = (Date.now() - startTime) / 60000;
    return timeElapsed > 0 ? correctWords / timeElapsed : 0;
}

function calculateAccuracy() {
    if (totalWords === 0) return 100;
    const rawAccuracy = (correctWords / totalWords) * 100;
    return Math.max(0, rawAccuracy);
}


function updateStats() {
    wpmDisplay.textContent = Math.round(calculateWPM());
    accuracyDisplay.textContent = Math.round(calculateAccuracy()) + '%';
}

function resetGame() {
    gameActive = false;
    clearInterval(gameTimer);
    score = 0;
    timeLeft = 60;
    totalWords = 0;
    correctWords = 0;
    startTime = null;

    scoreDisplay.textContent = '0';
    timeDisplay.textContent = '60';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    progressFill.style.width = '0%';

    wordDisplay.textContent = 'Cliquez sur "Commencer" pour jouer !';
    wordDisplay.className = 'word-display';
    wordInput.value = '';
    wordInput.disabled = true;

    commencerBtn.disabled = false;
    recommencerBtn.disabled = true;
    gameSummary.style.display = 'none';
}

wordInput.addEventListener('input', function () {
    if (!gameActive) return;

    const typedWord = this.value.trim();

    // Efface rouge si longueur < mot attendu
    if (typedWord.length < currentWord.length) {
        wordDisplay.className = 'word-display';
    }

    // Quand la longueur est atteinte
    if (typedWord.length === currentWord.length) {
        if (typedWord === currentWord) {
            correctWords++;
            score++;
            scoreDisplay.textContent = score;
            wordDisplay.className = 'word-display correct';

            totalWords++;
            updateStats();

            setTimeout(() => {
                displayNewWord();
            }, 300);
        } else {
            // Mot incorrect mais complet
            totalWords++;
            wordDisplay.className = 'word-display incorrect';
            updateStats();
            // Ne pas passer au mot suivant
        }
    }


    // Si l'utilisateur tape plus de caractères que le mot
    if (typedWord.length > currentWord.length) {
        wordDisplay.className = 'word-display incorrect';
    }
});

commencerBtn.addEventListener('click', startGame);
recommencerBtn.addEventListener('click', resetGame);

wordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !gameActive && !commencerBtn.disabled) {
        startGame();
    }
});

resetGame();
