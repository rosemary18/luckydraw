// Functions

const handlerOnLoad = () => {

    if (window.location?.pathname == "/index.html") window.location = "/"

    const lastGame = localStorage.getItem('draw_game')
    if (lastGame) {
        STATES.GAME = JSON.parse(lastGame)
        STATES.GAME.play = false
        localStorage.setItem("draw_game", stringify(STATES.GAME))
    }
}

const handlerUnLoad = () => {

    clearInterval(STATES.TIME_ID)
    localStorage.setItem("draw_game", stringify(STATES.GAME))
    localStorage.removeItem("active_prize")
    localStorage.removeItem("stage_winners")
}

const Start = () => {

    setTimeout(() => Navigate(Object.keys(STATES?.GAME)?.length > 0 ? 'DASHBOARD' : 'WELCOME'), 1000);
}

// Register

window.addEventListener('load', handlerOnLoad)
window.addEventListener('unload', handlerUnLoad)
window.addEventListener('storage', handlerChangeStorageMain)

Start()