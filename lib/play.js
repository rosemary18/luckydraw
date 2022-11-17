let game = {}
let intervalId = null
const root = document.getElementById('root')

// Generator

// Handlers

const handlerCheckGame = () => {

    let _game = localStorage.getItem("draw_game")

    if (!_game) return window.close()
    _game = JSON.parse(_game)
    if (!_game?.play) return window.close()
    game = _game
}

const handlerCheckStorage = (e) => {
    
    handlerCheckGame()
}

// Renders

const renderRoot = () => {
    
}

// Listeners

window.addEventListener('load', handlerCheckGame)
window.addEventListener('storage', handlerCheckStorage)