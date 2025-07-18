const player1 = document.querySelector(".name-input .plr-1")
const player2 = document.querySelector(".name-input .plr-2")
function init() {
    player1.addEventListener("focus", addAnimation1)
    player2.addEventListener("focus", addAnimation2)
    player1.addEventListener("blur", removeAnimation1)
    player2.addEventListener("blur", removeAnimation2)
    enter()
}


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

function enter() {

    player1.addEventListener("keypress", (e) => {
        if (e.key === "Enter") player2.focus()
    })
    player2.addEventListener("keypress", (e) => {
        setTimeout(() => {
            if (e.key === "Enter") playBtn.click()
        }, 500)
    })

}

init()