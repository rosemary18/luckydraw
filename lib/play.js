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

    let _draw_prize = localStorage.getItem("draw_prize")
    if (_draw_prize) active_prize = JSON.parse(_draw_prize)

    renderRoot()
}

const handlerCheckStorage = (e) => {
    
    handlerCheckGame()

    const drawText = document.getElementById('draw-text')
    const drawText1 = document.getElementById('draw-text1')
    let _stageWinner = localStorage.getItem("stage_winner")

    if (_stageWinner) {

        if (_stageWinner === "draw") {

            const players = filterPlayer(game.participant)
            intervalId = setInterval(() => {
                drawText.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
                drawText1.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
            }, 50)
        } else {
            clearInterval(intervalId)
            _stageWinner = JSON.parse(_stageWinner)
            if (_stageWinner?.length > 0) {
                drawText.textContent = _stageWinner[0]?.name
                drawText1.textContent = _stageWinner[1]?.name
            } else drawText.textContent = _stageWinner?.name
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
    const content = document.createElement('div')
    const prizeName = document.createElement('h1')
    const drawText = document.createElement('p')
    const drawText1 = document.createElement('p')
    const imgPrize = document.createElement('img')

    prizeName.id = "prize-name"
    drawText.id = "draw-text"
    drawText1.id = "draw-text1"

    prizeName.textContent = active_prize?.prize || ""

    container.className = "content"
    content.className = "content"
    prizeName.className = "title-prize"
    drawText.className = "draw-text"
    drawText1.className = "draw-text"
    imgPrize.className = "image-prize"
    
    if (active_prize?.image) {
        imgPrize.src = active_prize?.image
        content.append(imgPrize)
    }

    content.append(drawText)
    if (active_prize?.drawType == 2) content.append(drawText1)
    container.append(prizeName)
    container.append(content)
    root.append(container)
}

// Listeners

window.addEventListener('load', handlerCheckGame)
window.addEventListener('storage', handlerCheckStorage)

// Start 

Start()