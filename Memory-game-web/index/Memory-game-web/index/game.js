//------------------------------------ JS for GAME ------------------------- 

const inputContainer = document.querySelector(".input-container")
const gameContainer = document.querySelector(".game-container")
const playBtn = document.querySelector(".play-btn")
const body = document.querySelector("body")
const cards = document.querySelector(".cards")
const card = document.querySelectorAll(".card")
const players = document.querySelector(".players")
const name1 = document.querySelector(".name-1")
const name2 = document.querySelector(".name-2")
const score1 = document.querySelector(".player-1 span:nth-child(2)");
const score2 = document.querySelector(".player-2 span:nth-child(2)");
const result = document.querySelector(".result")
const reset = document.querySelector(".reset")

const noDisplay = "none"
const display = "flex"

let boardReady = true;

gameContainer.classList.remove("display");
players.classList.remove("display");
cards.classList.remove("display");
name1.style.display = noDisplay
name2.style.display = noDisplay
reset.style.display = noDisplay
score1.style.display = noDisplay
score2.style.display = noDisplay

window.onload = () => {
    loadProgress()
}
reset.addEventListener("click", backToLanding)

let player1Score = 0;
let player2Score = 0;

score1.innerText = `SCORE: ${player1Score.toString().padStart(2, '0')}`
score2.innerText = `SCORE: ${player2Score.toString().padStart(2, '0')}`

player1.addEventListener('input', saveProgress);
player2.addEventListener('input', saveProgress);

playBtn.addEventListener("click", init)

card.forEach(e => {
    e.addEventListener("click", () => setTimeout(() => {
        flipCard(e)
    }), 1000)
})

const cardBg = [
    "Car.png", "Chair.png", "Clock.png", "CPU-casing.png", "Cube.png",
    "Dairy.png", "Dice.png", "Fan.png", "Football.png", "Grape.png",
    "Hat.png", "Katana.png", "Knight.png", "Magnifying-glass.png", "mouse.png",
    "Racket.png", "Shuttle.png", "Smartphone.png", "Soccer.png", "Spinner.png",
    "T-shirt.png", "Thermometer.png"
]

function init() {
    result.style.display = "none";
    result.style.animation = "none";
    result.innerText = "";
    localStorage.removeItem("lastResult");
    applyStyle()
    addPlayerName()
    addCards()
}

function addPlayerName() {
    card.forEach(e => {
        e.classList.add("display")
    });

    name1.innerText = player1.value || "PLAYER1"
    name2.innerText = player2.value || "PLAYER2"
}

function applyStyle() {
    body.style.transition = 'all 3s'
    inputContainer.style.display = noDisplay
    playBtn.style.display = noDisplay
    body.style.backgroundImage = 'url(gameBG2.png)'
    body.style.alignItems = 'center'
    gameContainer.classList.add("display")
    gameContainer.style.transition = 'all 2s'
    players.classList.add("display")
    cards.classList.add("display")

    players.querySelectorAll("span").forEach(e => {
        e.style.display = display

    })
    name1.style.display = display
    name2.style.display = display
    score1.style.display = display
    score2.style.display = display
    name1.style.boxShadow = "0px 0px 10px 5px white"
    reset.style.display = display
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let flippedCards = [];
let lockBoard = false;
let currentPlayer = 1;

function addCards() {
    cards.innerHTML = ""; // Clear existing
    const selected = [...cardBg].sort(() => 0.5 - Math.random()).slice(0, 22);
    let remainingCards = selected.length;
    const duplicated = [...selected, ...selected];
    shuffle(duplicated);

    duplicated.forEach((bg, index) => {
        const card = document.createElement("div");
        card.classList.add("card", "display");
        card.dataset.index = index;
        card.style.setProperty('--angle', '180deg');
        card.style.setProperty('--bg-img', `url(../card-images/${bg})`);
        card.dataset.bg = bg;

        card.addEventListener("click", () => {
            if (lockBoard || flippedCards.includes(card) || !boardReady) return;

            boardReady = false; // Prevent other clicks during animation

            flipCard(card);
            flippedCards.push(card);

            setTimeout(() => {
                boardReady = true; // Allow next interaction after flip completes
            }, 500); // Your CSS flip time (adjust if needed)

            if (flippedCards.length === 2) {
                lockBoard = true;

                const [card1, card2] = flippedCards;

                if (card1.dataset.bg === card2.dataset.bg) {
                    setTimeout(() => {
                        card1.classList.add('fly-away');
                        card2.classList.add('fly-away');

                        setTimeout(() => {
                            card1.style.visibility = 'hidden';
                            card2.style.visibility = 'hidden';

                            if (currentPlayer == 1) {
                                player1Score++;
                                score1.innerText = `SCORE: ${player1Score.toString().padStart(2, '0')}`;
                            } else {
                                player2Score++;
                                score2.innerText = `SCORE: ${player2Score.toString().padStart(2, '0')}`;
                            }

                            remainingCards--

                            if (remainingCards == 0) {
                                showResult()
                            }

                            saveProgress();
                            resetTurn();
                        }, 800);
                    }, 800);
                } else {
                    setTimeout(() => {
                        flipBack(card1);
                        flipBack(card2);
                        currentPlayer = currentPlayer === 1 ? 2 : 1;
                        updateTurnDisplay();
                        resetTurn();
                    }, 800);
                }
            }
        });

        cards.appendChild(card);
    });

    updateTurnDisplay();
}

function flipCard(card) {
    card.style.setProperty('--angle', '0deg');
}

function flipBack(card) {
    card.style.setProperty('--angle', '180deg');
}

function resetTurn() {
    flippedCards = [];
    lockBoard = false;
    boardReady = true;
}


function updateTurnDisplay() {
    if (currentPlayer === 1) {
        name1.style.boxShadow = "0px 0px 10px 5px white"
        name2.style.boxShadow = "none";
    } else {
        name2.style.boxShadow = "0px 0px 10px 5px white"
        name1.style.boxShadow = "none"
    }
}

function saveProgress() {
    const player1Name = player1.value.trim() || "PLAYER1";
    const player2Name = player2.value.trim() || "PLAYER2";


    const cardsState = Array.from(document.querySelectorAll('.card')).map(card => ({
        index: card.dataset.index,
        bg: card.style.getPropertyValue('--bg-img').trim(),
        flipped: getComputedStyle(card).getPropertyValue('--angle').trim() === '0deg',
        matched: card.classList.contains('fly-away')
    }));

    const progress = {
        cards: cardsState,
        player1Score,
        player2Score,
        currentPlayer,
        player1Name,
        player2Name,
        background: body.style.backgroundImage || "",
    };


    localStorage.setItem('memoryGameProgress', JSON.stringify(progress));
}

function loadProgress() {

    result.style.display = "none";
    result.style.animation = "none";
    result.innerText = "";

    const saved = localStorage.getItem('memoryGameProgress');
    if (saved) {
        const data = JSON.parse(saved);

        if (data.background) {
            body.style.backgroundImage = data.background;
        } else {
            // fallback to game bg or landing bg as appropriate
            body.style.backgroundImage = 'url(gameBG2.png)';
        }


        // Restore player names and input fields
        player1.value = data.player1Name && data.player1Name.trim() !== "" ? data.player1Name : "PLAYER1";
        player2.value = data.player2Name && data.player2Name.trim() !== "" ? data.player2Name : "PLAYER2";
        name1.innerText = player1.value;
        name2.innerText = player2.value;

        // Show game UI
        inputContainer.style.display = "none";
        playBtn.style.display = "none";
        gameContainer.classList.add("display");
        players.classList.add("display");
        cards.classList.add("display");
        reset.style.display = "flex";

        players.querySelectorAll("span").forEach(e => {
            e.style.display = "flex";
        });

        // Restore scores
        player1Score = data.player1Score || 0;
        player2Score = data.player2Score || 0;
        score1.innerText = `SCORE: ${player1Score.toString().padStart(2, '0')}`;
        score2.innerText = `SCORE: ${player2Score.toString().padStart(2, '0')}`;

        // Rebuild cards and restore flipped cards even if just one
        rebuildCards(data.cards);

        // Restore current player
        currentPlayer = data.currentPlayer || 1;

        // Update turn display highlight
        updateTurnDisplay();

        // Return true to indicate game was restored successfully
        return true;
    }
    return false;
}


function rebuildCards(savedCards) {
    cards.innerHTML = "";

    savedCards.forEach(({ index, bg, flipped, matched }) => {
        const card = document.createElement("div");
        card.classList.add("card", "display");
        card.dataset.index = index;
        card.style.setProperty('--angle', flipped ? '0deg' : '180deg');
        card.style.setProperty('--bg-img', bg);
        card.dataset.bg = bg.match(/\/([^\/]+)\)$/)[1];

        if (matched) {
            card.classList.add("fly-away");
            card.style.visibility = "hidden";
        }

        card.addEventListener("click", () => {
            if (lockBoard || flippedCards.includes(card)) return;

            flipCard(card);
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                lockBoard = true;
                const [card1, card2] = flippedCards;

                if (card1.dataset.bg === card2.dataset.bg) {
                    setTimeout(() => {
                        card1.classList.add('fly-away');
                        card2.classList.add('fly-away');
                        setTimeout(() => {
                            card1.style.visibility = 'hidden';
                            card2.style.visibility = 'hidden';
                            if (currentPlayer == 1) {
                                player1Score++;
                                score1.innerText = `SCORE: ${player1Score.toString().padStart(2, '0')}`;
                            } else {
                                player2Score++;
                                score2.innerText = `SCORE: ${player2Score.toString().padStart(2, '0')}`;
                            }
                            saveProgress();
                            resetTurn();
                        }, 1000);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        flipBack(card1);
                        flipBack(card2);
                        currentPlayer = currentPlayer === 1 ? 2 : 1;
                        updateTurnDisplay();
                        resetTurn();
                    }, 1000);
                }
            }
        });

        cards.appendChild(card);
    });

    updateTurnDisplay();
}
function backToLanding() {
    result.style.display = "none";
    result.style.animation = "none";
    result.innerText = "";
    
    gameContainer.classList.remove("display");
    players.classList.remove("display");
    cards.classList.remove("display");
    name1.style.display = noDisplay
    name2.style.display = noDisplay
    reset.style.display = noDisplay
    score1.style.display = noDisplay
    score2.style.display = noDisplay

    body.style.backgroundImage = "url(bg.png)";

    inputContainer.style.display = "flex";
    playBtn.style.display = "flex";

    cards.innerHTML = "";

    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;

    score1.innerText = `SCORE: 00`;
    score2.innerText = `SCORE: 00`;

    name1.innerText = "PLAYER1";
    name2.innerText = "PLAYER2";

    player1.value = "";
    player2.value = "";


    localStorage.removeItem('memoryGameProgress');
    localStorage.removeItem('lastResult');
}

function showResult() {
    if (player1Score > player2Score) {
        result.innerText = `WON by ${name1.innerText}!!`;
    } else if (player2Score > player1Score) {
        result.innerText = `WON by ${name2.innerText}!!`;
    } else {
        result.innerText = `DRAW !!`;
    }

    result.style.display = display;
    result.style.animation = "showResult 1.125s linear forwards";
}


