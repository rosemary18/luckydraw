let game = {}
let active_prize = {}
let intervalId = null
const root = document.getElementById('root')

// Generator

const clearContent = () => {

    while (root.hasChildNodes()) root.removeChild(root.firstChild)
    return true
}

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

    const prizeName = document.getElementById('prize-name')
    const drawText = document.getElementById('draw-text')

    let _draw_prize = localStorage.getItem("draw_prize")
    let _stageWinner = localStorage.getItem("stage_winner")
    
    if (_draw_prize) {
        active_prize = JSON.parse(_draw_prize)
        prizeName.textContent = active_prize?.prize
    } else prizeName.textContent = ""

    if (_stageWinner) {

        if (_stageWinner === "draw") {

            const players = filterPlayer(game.participant)
            intervalId = setInterval(() => {
                drawText.textContent = players?.[Math.max((Math.floor(Math.random()*(players?.length))), 0)]?.name
            }, 50)
        } else {

            clearInterval(intervalId)
            _stageWinner = JSON.parse(_stageWinner)
            setTimeout(() => drawText.textContent = _stageWinner?.name, 100)
        }
    } else drawText.textContent = ""
}

const filterPlayer = (items) => {
    
    const available = [];

    items?.map(item => {
        if (item?.available && !(game?.winners?.some(itm => itm?.winner_id == item?.id))) available.push(item)
    })

    available.sort(() => Math.random()-.5)

    return available
}

const Start = () => [

    renderRoot()
]

// Renders

const renderRoot = () => {

    clearContent()
    
    const container = document.createElement('div')
    const prizeName = document.createElement('h1')
    const drawText = document.createElement('p')

    prizeName.id = "prize-name"
    drawText.id = "draw-text"

    container.append(prizeName)
    container.append(drawText)
    root.append(container)
}

// Listeners

window.addEventListener('load', handlerCheckGame)
window.addEventListener('storage', handlerCheckStorage)

// Start 

Start()