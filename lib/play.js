let game = {}
let active_prize = {}
let intervalId = null
let stageWinners = []
let _default = true
const root = document.getElementById('root')
const soundWin = document.getElementById('sound-win')
const soundSpin = document.getElementById('sound-spin')
root.classList.add("bg1");


// Generator

const clearContent = () => {

    while (root.hasChildNodes()) root.removeChild(root.firstChild)
    return true
}

// Handlers

// const handlerChangeBackground = (e) => {

//     if (e.code == "Space") {
//         if (_default) {
//             root.classList.remove("bg1");
//             root.classList.add("bg2");
//         } else {
//             root.classList.remove("bg2");
//             root.classList.add("bg1");
//         }

//         _default = !_default
//     }
// }

const handlerCheckGame = () => {

    // console.log('Game check ...')

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
    
    clearInterval(intervalId)
    handlerCheckGame()
    console.log("check: ", e)

    const drawText = document.getElementById('draw-text') || {}
    const drawText1 = document.getElementById('draw-text1') || {}
    const drawText2 = document.getElementById('draw-text2') || {}
    const drawText3 = document.getElementById('draw-text3') || {}
    const drawText4 = document.getElementById('draw-text4') || {}
    let _stageWinner = localStorage.getItem("stage_winner") || ""
    
    if (_stageWinner) {
        
        const players = filterPlayer()
        soundSpin?.play?.()

        if (_stageWinner === "draw") {
            intervalId = setInterval(() => {
                drawText.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
                if (active_prize?.drawType > 1) drawText1.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
                if (active_prize?.drawType > 2) drawText2.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
                if (active_prize?.drawType > 3) drawText3.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
                if (active_prize?.drawType > 4) drawText4.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
            }, 50)
        } else if (_stageWinner === "draw-1") { 
            if (active_prize?.drawType > 1) drawText1.textContent = stageWinners?.[1]?.name
            if (active_prize?.drawType > 2) drawText2.textContent = stageWinners?.[2]?.name
            if (active_prize?.drawType > 3) drawText3.textContent = stageWinners?.[3]?.name
            if (active_prize?.drawType > 4) drawText4.textContent = stageWinners?.[4]?.name
            intervalId = setInterval(() => {
                drawText.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
            }, 50)
        } else if (_stageWinner === "draw-2") { 
            drawText.textContent = stageWinners?.[0]?.name
            if (active_prize?.drawType > 2) drawText2.textContent = stageWinners?.[2]?.name
            if (active_prize?.drawType > 3) drawText3.textContent = stageWinners?.[3]?.name
            if (active_prize?.drawType > 4) drawText4.textContent = stageWinners?.[4]?.name
            intervalId = setInterval(() => {
                drawText1.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
            }, 50)
        } else if (_stageWinner === "draw-3") { 
            drawText1.textContent = stageWinners?.[1]?.name
            drawText.textContent = stageWinners?.[0]?.name
            if (active_prize?.drawType > 3) drawText3.textContent = stageWinners?.[3]?.name
            if (active_prize?.drawType > 4) drawText4.textContent = stageWinners?.[4]?.name
            intervalId = setInterval(() => {
                drawText2.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
            }, 50)
        } else if (_stageWinner === "draw-4") { 
            drawText1.textContent = stageWinners?.[1]?.name
            drawText2.textContent = stageWinners?.[2]?.name
            drawText.textContent = stageWinners?.[0]?.name
            if (active_prize?.drawType > 4) drawText4.textContent = stageWinners?.[4]?.name
            intervalId = setInterval(() => {
                drawText3.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
            }, 50)
        } else if (_stageWinner === "draw-5") { 
            drawText1.textContent = stageWinners?.[1]?.name
            drawText2.textContent = stageWinners?.[2]?.name
            drawText3.textContent = stageWinners?.[3]?.name
            drawText.textContent = stageWinners?.[0]?.name
            intervalId = setInterval(() => {
                drawText4.textContent = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]?.name
            }, 50)
        } else {
            soundSpin?.pause?.()
            _stageWinner = JSON.parse(_stageWinner)
            stageWinners = _stageWinner
            if (stageWinners?.length > 0) {
                drawText.textContent = stageWinners[0]?.name
                drawText1.textContent = stageWinners?.[1]?.name
                drawText2.textContent = stageWinners?.[2]?.name
                drawText3.textContent = stageWinners?.[3]?.name
                drawText4.textContent = stageWinners?.[4]?.name
            }

        }
    } else {
        drawText.textContent && (drawText.textContent = " ")
        stageWinners = []
    }
}

const filterPlayer = (items) => {
    
    const available = [];

    game.participant?.map(item => {
        if (item?.available && !(stageWinners.some(itm => itm?.winner_id == item?.id))) available.push(item)
    })

    available.sort(() => Math.random()-.5)

    return available
}

const Start = () => [

    renderRoot()
]

// Renders


const renderRoot = () => {

    // soundWin?.pause?.()
    
    clearContent()

    const renderListWinners = () => {

        const lists = document.createElement('div')
        const contentLists = document.createElement('div')
        lists.className = "list-winners"
        contentLists.className = "content-list"

        const createList = (item) => {
            const text = document.createElement('p')
            text.className = "list-winner"
            text.textContent = item?.winner_name
            contentLists.append(text)
        }

        lists.append(contentLists)
        active_prize?.winners?.map(createList)
        content.append(lists)

        // soundWin?.play?.()
    }
    
    const container = document.createElement('div')
    const content = document.createElement('div')
    const prizeName = document.createElement('h1')
    const drawText = document.createElement('p')
    const drawText1 = document.createElement('p')
    const drawText2 = document.createElement('p')
    const drawText3 = document.createElement('p')
    const drawText4 = document.createElement('p')
    const imgPrize = document.createElement('img')

    prizeName.id = "prize-name"
    drawText.id = "draw-text"
    drawText1.id = "draw-text1"
    drawText2.id = "draw-text2"
    drawText3.id = "draw-text3"
    drawText4.id = "draw-text4"

    prizeName.textContent = active_prize?.prize || ""

    container.className = "content"
    content.className = "content"
    prizeName.className = "title-prize"
    drawText.className = "draw-text"
    drawText1.className = "draw-text"
    drawText2.className = "draw-text"
    drawText3.className = "draw-text"
    drawText4.className = "draw-text"
    imgPrize.className = "image-prize"
    
    if (active_prize?.image) {
        imgPrize.src = active_prize?.image
        content.append(imgPrize)
    }
    
    if ((active_prize?.total - active_prize?.winners?.length) == 0) renderListWinners()
    else {

        if (active_prize?.drawType > 1) imgPrize.style.bottom = "-3.5em"
    
        if (active_prize?.drawType == 2) {
            content.append(drawText)
            content.append(drawText1)
        } else if (active_prize?.drawType == 3) {
    
            const group = document.createElement('div')
            group.style.display = "flex"
            group.style.alignItems = "center"
    
            drawText.className = "draw-text-md"
            drawText1.className = "draw-text-md"
            drawText2.className = "draw-text-md"
    
            group.append(drawText)
            group.append(drawText1)
            content.append(group)
            content.append(drawText2)
            
        } else if (active_prize?.drawType == 4) {
    
            const group = document.createElement('div')
            const group1 = document.createElement('div')
    
            group.style.display = "flex"
            group.style.alignItems = "center"
            group1.style.display = "flex"
            group1.style.alignItems = "center"
    
            drawText.className = "draw-text-md"
            drawText1.className = "draw-text-md"
            drawText2.className = "draw-text-md"
            drawText3.className = "draw-text-md"
    
            group.append(drawText)
            group.append(drawText1)
            group1.append(drawText2)
            group1.append(drawText3)
            content.append(group)
            content.append(group1)
            
        } else if (active_prize?.drawType == 5) {
    
            const group = document.createElement('div')
            const group1 = document.createElement('div')
    
            group.style.display = "flex"
            group.style.alignItems = "center"
            group1.style.display = "flex"
            group1.style.alignItems = "center"
    
            drawText.className = "draw-text-md"
            drawText1.className = "draw-text-md"
            drawText2.className = "draw-text-md"
            drawText3.className = "draw-text-md"
            drawText4.className = "draw-text-md"
    
            group.append(drawText)
            group.append(drawText1)
            group1.append(drawText2)
            group1.append(drawText3)
            content.append(group)
            content.append(group1)
            content.append(drawText4)
            
        } else {
            content.append(drawText)
        }    
    }
    container.append(prizeName)
    container.append(content)
    root.append(container)
}

// Listeners

window.addEventListener('load', handlerCheckGame)
window.addEventListener('storage', handlerCheckStorage)
// window.addEventListener('keydown', handlerChangeBackground)

// Start 

Start()