const playBtn = document.querySelector(".play-btn")
const player1 = document.querySelector(".name-input .plr-1")
const player2 = document.querySelector(".name-input .plr-2")
const inputContainer = document.querySelector(".input-container")
const gameContainer = document.querySelector(".game-container")
const body = document.querySelector("body")
const cards = document.querySelector(".cards")
const card = document.querySelectorAll(".card")
const players = document.querySelector(".players")
const name1 = document.querySelector(".name-1")
const name2 = document.querySelector(".name-2")

const noDisplay = "none"
const display = "flex"

playBtn.addEventListener("click", init)

player1.addEventListener("focus", addAnimation1)
player2.addEventListener("focus", addAnimation2)
player1.addEventListener("blur", removeAnimation1)
player2.addEventListener("blur", removeAnimation2)

function addAnimation1() {
    document.querySelector(".user-icon-1").style.animation = "addUserAnimation forwards 1s"
}

function addAnimation2() {
    document.querySelector(".user-icon-2").style.animation = "addUserAnimation forwards 1s"
}

function removeAnimation1() {
    document.querySelector(".user-icon-1").style.animation = "removeUserAnimation forwards 1s"
}

function removeAnimation2() {
    document.querySelector(".user-icon-2").style.animation = "removeUserAnimation forwards 1s"
}

function init() {
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
    card.forEach(e => {
        e.classList.add("display")
    });

    if(!player1.value){
        name1.innerText = "PLAYER1"
    }else {
        name1.innerText = player1.value
    }
    
    if(!player1.value){
        name2.innerText = "PLAYER2"
    }else {
        name2.innerText = player2.value
    }
}
