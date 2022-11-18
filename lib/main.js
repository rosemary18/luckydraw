let game = {}
let active_prize = {}
let intervalId = null
let timeId = null
const root = document.getElementById('root')

// Generator

const creatNeonButton = (_title = "") => {

    const button = document.createElement('a')
    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    const span3 = document.createElement('span')
    const span4 = document.createElement('span')
    const title = document.createElement('p')

    button.append(span1)
    button.append(span2)
    button.append(span3)
    button.append(span4)
    button.append(title)

    title.textContent = _title
    title.className = "title-button"

    button.className = "button-neon"
    
    return button
}

const createNeonInput = (_title = "", _id = "", _type = "file", _accept = ".txt") => {

    const container = document.createElement('div')
    const group = document.createElement('div')
    const input = document.createElement('input')
    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    const span3 = document.createElement('span')
    const span4 = document.createElement('span')
    const title = document.createElement('h6')
    
    input.id = _id
    input.placeholder = "Pilih file peserta"
    input.accept = _accept
    
    title.textContent = _title
    title.className = "title-input-neon"

    group.className = "input-neon"

    input.type = _type
    group.append(span1)
    group.append(span2)
    group.append(span3)
    group.append(span4)
    group.append(input)

    container.append(title)
    container.append(group)

    return container
}

// Handlers

const handlerOnLoad = () => {

    const last_game = localStorage.getItem('draw_game')
    if (last_game) {
        game = JSON.parse(last_game)
        game.play = false
        localStorage.setItem("draw_game", JSON.stringify(game))
    }

    navigateWelcome()
}

const handlerUnLoad = () => {

    clearInterval(timeId)
    localStorage.removeItem("draw_prize")
}

const testDraw = () => {

    const participant = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    participant.sort(() => Math.random()-.5)
    
    intervalId = setInterval(() => {
        root.innerHTML = participant[Math.max(Math.floor(Math.random()*participant.length), 0)]
    }, 200)

    setTimeout(() => {
        clearInterval(intervalId)
    }, 5000);
}

const clearContent = () => {

    while (root.hasChildNodes()) root.removeChild(root.firstChild)
    return true
}

const draw = () => {

}

const handlerCheckPrize = () => {
    
    let next = false
    game?.prizes?.forEach(e => {
        if (e?.total != e?.winners?.length) next = true
    });

    return next
}

const navigateDetail = () => {

    game.play = true
    localStorage.setItem("draw_game", JSON.stringify(game))

    // if (handlerCheckPrize()) window.open('./play.html', 'blank')

    updateDocumentTitle("Dashboard: Lucky Draw")
    renderScreenDetail()
}

const navigateForm = () => {

    updateDocumentTitle("Lucky Draw - Start New Game")
    renderScreenForm()
}

const navigateWelcome = () => {

    updateDocumentTitle()
    handlerCloseGame()
    renderScreenWelcome()
}

const Start = () => {

    renderScreenWelcome()
}

const downloadTemplate = () => {

    console.log("Downloading...")
    const link = document.createElement('a');
    const link1 = document.createElement('a');

    let text = "*Note: Masukkan nama pemain/peserta dipisahakan dengan baris baru / enter. (Note ini jangan dihapus dan tetap terpisah dengan satu baris)\n\nRonaldo \nMessi"
    let text1 = "*Note: Masukkan hadiah dan jumlah hadiah dipisahkan dengan koma. Setiap hadiah dipisahkan dengan baris baru atau enter. (Note ini jangan dihapus dan tetap terpisah dengan satu baris)\n\nJam Alexander Christie, 2"

    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    link.setAttribute('download', `template-peserta.txt`);
    link.click()

    link1.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text1));
    link1.setAttribute('download', `template-hadiah.txt`);
    setTimeout(() => link1.click(), 400);
}

const handlerStartNewGame = async () => {

    let err = false
    const newGame = {
        participant: [],
        prizes: [],
        winners: []
    }

    const inputParticipant = document.getElementById('input-participant')
    const inputPrizes = document.getElementById('input-prizes')
    
    if (!inputParticipant.files?.[0] || !inputPrizes.files?.[0]) return alert("Data belum lengkap ...")

    const reader = new FileReader();
    const reader1 = new FileReader();

    reader.addEventListener('load', (event) => {

        if (typeof event.target.result == "string") {

            let id = 0;
            const data = event.target.result.split('\n\n')?.[1]?.split('\n')

            if (data?.length > 0) {
                data?.map(name => {
                    newGame.participant.push({ id, name: name?.trim(), available: true })
                    id++;
                })
            } else err = true
        }
    })

    reader1.addEventListener('load', (event) => {

        if (typeof event.target.result == "string") {

            let id = 0;
            const data = event.target.result.split('\n\n')?.[1]?.split('\n')

            if (data?.length > 0) {
                data?.map(prize => {
                    newGame.prizes.push({ id, prize: prize?.split(",")?.[0]?.trim(), total: parseInt(prize?.split(",")?.[1] || 1), winners: [] })
                    id++;
                })
            } else err = true
        }
    })

    reader.readAsText(inputParticipant.files[0])
    reader1.readAsText(inputPrizes.files[0])

    setTimeout(() => {
        if (err) return alert("Terjadi kesalahan, periksa kembali file, mohon ikuti arahan cara pengisian yan tertera didalam template ...")
        else {
            console.log(newGame)
            localStorage.setItem("draw_game", JSON.stringify(newGame))
            game = newGame
            navigateDetail()
        }
    }, 1000);
}

const handlerCloseGame = () => {

    if (Object.keys(game).length > 0) {
        game.play = false
        localStorage.setItem("draw_game", JSON.stringify(game))
    }
}

const handleViewPrizeDraw = (item, i) => {

    active_prize = (item?.id == active_prize?.id) ? {} : item

    if (Object.keys(active_prize).length > 0) localStorage.setItem("draw_prize", JSON.stringify(active_prize))
    else localStorage.removeItem("draw_prize")

    renderScreenDetail()
}

const sortPrize = (items) => {

    const completed = [];
    const uncompleted = []

    items?.map(item => {

        let left = item?.total - (item?.winners?.length || 0)
        if (left > 0) uncompleted.push(item)
        else completed.push(item)
    })

    return [...uncompleted, ...completed]
}

const sortPlayer = (items) => {

    const available = [];
    const winners = [];
    const fall = [];

    items?.map(item => {
        
        if (item?.available) available.push(item)
        else {
            if (game?.winners?.some(itm => itm?.winner_id == item?.id)) winners.push(item)
            else fall.push(item)
        }
    })

    return [...available, ...winners, ...fall]
}

const filterPlayer = (items) => {
    
    const available = [];

    items?.map(item => {
        if (item?.available && !(game?.winners?.some(itm => itm?.winner_id == item?.id))) available.push(item)
    })

    available.sort(() => Math.random()-.5)

    return available
}

const handlerFallPlayer = (player) => {
    
    game?.participant?.forEach((item, i) => {
        if (item?.id == player?.id) game.participant[i].available = false
    })

    localStorage.setItem("draw_game", JSON.stringify(game))
    renderScreenDetail()
}

const handlerSetWinner = (player) => {

    const winner = {
        prize_id: active_prize?.id,
        prize_name: active_prize?.prize,
        winner_id: player?.id,
        winner_name: player?.name
    }
    
    game?.participant?.forEach((item, i) => {
        if (item?.id == player?.id) game.participant[i].available = false
    })
    
    game?.prizes?.forEach((item, i) => {
        if (item?.id == active_prize?.id) game.prizes[i].winners?.push(winner)
    })

    game?.winners?.push(winner)
    
    localStorage.setItem("draw_game", JSON.stringify(game))
    renderScreenDetail()
}

// Renders

const updateDocumentTitle = (_title = "Lucky Draw") => {

    const title = document.getElementsByTagName("title")
    title[0].textContent = _title
}

const createSectionDraw = () => {

    let now = new Date()
    
    const sectionDraw = document.createElement('div')
    const contentContainer = document.createElement('div')
    const headerGroup = document.createElement('div')
    const title = document.createElement('h6')
    const time = document.createElement('h6')
    
    sectionDraw.className = "content-detail-section"
    contentContainer.className = "draw-section-content"
    title.className = "title-section"
    headerGroup.style.display = "flex"
    headerGroup.style.justifyContent = "space-between"
    time.className = "title-section"
    headerGroup.style.alignItems = "center"
    time.style.fontSize = ".8rem"
    
    title.textContent = `WINNERS: (${game?.prizes?.reduce((a, _a) => a + _a?.total, 0) || 0} Prizes)`
    time.textContent = `${now.getFullYear()}/${now.getMonth()}/${now.getDate()}, ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    timeId && clearInterval(timeId)
    timeId = setInterval(() => {
        now = new Date()
        time.textContent = `${now.getFullYear()}/${now.getMonth()}/${now.getDate()}, ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    }, 1000)
    
    headerGroup.append(title)
    headerGroup.append(time)

    if (Object.keys(active_prize).length > 0) {
        
        const contentDetailContainer = document.createElement('div')
        const contentDetail = document.createElement('div')
        const content = document.createElement('div')
        const sideLeft = document.createElement('div')
        const sideRight = document.createElement('div')
        const playArea = document.createElement('div')
        const titleSideLeft = document.createElement('h6')
        const titleSideRight = document.createElement('h6')
        const listWinners = document.createElement('div')
        const textDetailPrize = document.createElement('p')
        const textDetailTotal = document.createElement('p')
        const textDetailDrawLeft = document.createElement('p')
        const textDraw = document.createElement('p')
        const drawButton = creatNeonButton("Draw")
        
        textDetailPrize.textContent = `Prize: ${active_prize?.prize}`
        textDetailTotal.textContent = `Total: ${active_prize?.total} Item`
        textDetailDrawLeft.textContent = `Draw Left : ${active_prize?.total-active_prize?.winners?.length}`

        title.textContent = `Draw: ${active_prize?.prize || ""}`
        titleSideLeft.textContent = "DETAIL"
        titleSideRight.textContent = "WINNERS"

        textDraw.id = "draw-winner"
    
        contentDetailContainer.className = "prize-detail-container"
        contentDetail.className = "prize-draw"
        content.className = "prize-detail"
        playArea.className = "play-area"
        titleSideLeft.className = "title-side"
        titleSideRight.className = "title-side"
        sideLeft.className = "side"
        sideRight.className = "side"
        listWinners.className = "list-winners"
        listWinners.style.padding = "0px"
        textDetailTotal.className = "text-detail"
        textDetailPrize.className = "text-detail"
        textDetailDrawLeft.className = "text-detail"
        
        sideLeft.append(titleSideLeft)
        sideLeft.append(textDetailPrize)
        sideLeft.append(textDetailTotal)
        sideLeft.append(textDetailDrawLeft)
        sideRight.append(titleSideRight)
        sideRight.append(listWinners)
        content.append(sideLeft)
        content.append(sideRight)
        contentDetail.append(content)
        contentDetailContainer.append(contentDetail)
        contentContainer.append(contentDetailContainer)
        contentContainer.append(playArea)
        
        const createListWinner = (item, i) => {
            
            const textName = document.createElement('p')
            textName.style.margin = "0px"
            textName.style.marginBottom = "4px"
            textName.textContent = `${i+1}. ` + item?.winner_name
            listWinners.append(textName)
        }

        active_prize?.winners?.map(createListWinner)

        if (active_prize?.total - active_prize?.winners?.length > 0) {

            playArea.append(drawButton)

            const handlerDraw = () => {
                
                let _stagePlayer = {}
                const players = filterPlayer(game?.participant)
                playArea.removeChild(playArea.firstElementChild)
                playArea.append(textDraw)
    
                if (intervalId) clearInterval(intervalId)
    
                intervalId = setInterval(() => {
                    _stagePlayer = players?.[Math.max((Math.floor(Math.random()*(players?.length))), 0)]
                    textDraw.textContent = _stagePlayer?.name
                }, 100)
    
                setTimeout(() => {
                    let res = confirm("Winner: " + textDraw.textContent + "\n\n*Note: Peserta tidak dapat mengikuti undian lagi.\nTekan batal akan membuat peserta gugur")
                    if (!res) handlerFallPlayer(_stagePlayer)
                    else handlerSetWinner(_stagePlayer)
                    clearInterval(intervalId)
                    playArea.removeChild(playArea.firstElementChild)
                    playArea.append(drawButton)
                }, 5000)
            } 
    
            drawButton.addEventListener('click', handlerDraw)
        } else {
            textDraw.textContent = "Completed"
            playArea.append(textDraw)
        }

    } else {

        contentContainer.style.justifyContent = "start"

        const listWinners = document.createElement('div')

        listWinners.className = "list-winners"

        const createListWinner = (item, i) => {
            
            const textName = document.createElement('p')
            textName.textContent = `${i+1}. ` + item?.winner_name + ` (${item?.prize_name})`
            listWinners.append(textName)
        }

        game?.winners?.map(createListWinner)

        contentContainer.append(listWinners)
    }

    sectionDraw.append(headerGroup)
    sectionDraw.append(contentContainer)
    
    return sectionDraw
}

const createSectionPrizes = () => {

    const sectionListPrize = document.createElement('div')
    const lists = document.createElement('ul')
    const title = document.createElement('h6')

    title.textContent = "PRIZE"

    sectionListPrize.className = "content-detail-section"
    sectionListPrize.style.maxWidth = "300px"
    title.className = "title-section"

    lists.className = "list-item-container"

    const createList = (item, i) => {

        let left = item?.total - item?.winners?.length

        const list = document.createElement('a')
        const name = document.createElement('p')
        const total = document.createElement('p')

        name.textContent = item?.prize
        total.textContent = left > 0 ? left : "✓"

        if (!(left > 0)) total.style.color = "#00a97e"

        list.className = "list-item-prize"

        if (active_prize?.id == item?.id) list.classList.add("list-item-prize-active")

        list.append(name)
        list.append(total)

        lists.append(list)

        list.addEventListener('click', () => handleViewPrizeDraw(item, i) )
    }

    sortPrize(game?.prizes)?.map(createList)
    
    sectionListPrize.append(title)
    sectionListPrize.append(lists)
    
    return sectionListPrize
}

const createSectionPlayers = () => {
    
    const sectionListPlayers = document.createElement('div')
    const descGroup = document.createElement('div')
    const title = document.createElement('h6')
    const lists = document.createElement('ul')

    const descAvailable = document.createElement('p')
    const tagAvailable = document.createElement('span')
    
    const descRed = document.createElement('p')
    const tagRed = document.createElement('span')
    
    const descGreen = document.createElement('p')
    const tagGreen = document.createElement('span')
    
    title.textContent = "PLAYER"
    tagAvailable.textContent = "❚  "
    tagAvailable.style.color = "rgba(255,255,255,.5)"
    tagRed.textContent ="❚  "
    tagRed.style.color = "red"
    tagGreen.textContent = "❚  "
    tagGreen.style.color = "#00a97e"
    descAvailable.textContent = "Active"
    descRed.textContent = "Fall"
    descGreen.textContent = "Win"
    
    sectionListPlayers.className = "content-detail-section"
    sectionListPlayers.style.maxWidth = "300px"
    title.className = "title-section"

    lists.className = "list-item-container"
    descGroup.className = "desc-status-player"

    const createList = (item) => {

        const list = document.createElement('div')
        const name = document.createElement('p')
        const prize = document.createElement('p')
        const tag = document.createElement('span')

        name.textContent = item?.name
        tag.textContent = "❚ "
        
        list.append(name)
        
        if (game?.winners?.some(itm => itm?.winner_id == item?.id)) {
            const _prize = game?.winners?.find(itm => itm?.winner_id == item?.id)
            prize.textContent = `(${_prize?.prize_name})`
            list.append(prize)
            tag.style.color = "#00a97e"
        } else if (!item?.available) tag.style.color = "red"
        
        list.className = "list-item-participant"
        
        name.insertAdjacentElement("afterbegin", tag)
        lists.append(list)
    }

    sortPlayer(game?.participant)?.map(createList)

    descAvailable.insertAdjacentElement("afterbegin", tagAvailable)
    descGreen.insertAdjacentElement("afterbegin", tagGreen)
    descRed.insertAdjacentElement("afterbegin", tagRed)
    descGroup.append(descAvailable)
    descGroup.append(descGreen)
    descGroup.append(descRed)

    sectionListPlayers.append(title)
    sectionListPlayers.append(descGroup)
    sectionListPlayers.append(lists)
    
    return sectionListPlayers
}

const renderScreenWelcome = () => {

    clearContent()

    const container = document.createElement('div')
    const buttonContinue = creatNeonButton("Continue")
    const buttonStartOver = creatNeonButton("New Game") 
    const title = document.createElement('h1')

    container.className = "container-center-blue"
    title.className = "title-welcome"

    title.textContent = "Lucky Draw"

    // Append
    container.append(title)
    if (Object.keys(game).length > 0) container.append(buttonContinue)
    container.append(buttonStartOver)
    root.append(container)

    buttonStartOver.addEventListener('click', navigateForm)
    buttonContinue.addEventListener('click', navigateDetail)
}

const renderScreenForm = () => {

    clearContent()

    const container = document.createElement('div')
    const formBox = document.createElement('div')
    const form = document.createElement('form')
    const title = document.createElement('h2')
    const inputParticipant = createNeonInput("Players", "input-participant")
    const inputPrizes = createNeonInput("Prizes", "input-prizes")
    const buttonStart = creatNeonButton("Start")
    const buttonBack = creatNeonButton("«")
    const linkTemplate = document.createElement('a')

    container.className = "container-center-blue"
    formBox.className = "form-box"
    form.className = "form-input"
    linkTemplate.className = "link-template"
    buttonBack.style.position = "absolute"
    buttonBack.style.top = "12px"
    buttonBack.style.left = "12px"
    buttonBack.style.fontSize = "2em"
    inputPrizes.style.marginTop = "12px"

    title.textContent = "New Game"
    linkTemplate.textContent = "Download template file"
    linkTemplate.title = "Download template file"
    inputParticipant.title = "Choose .txt file players, download template first"
    inputPrizes.title = "Choose .txt file prizes, download template first"
    buttonBack.title = "Back"

    form.append(inputParticipant)
    form.append(inputPrizes)
    form.append(linkTemplate)

    formBox.append(title)
    formBox.append(form)
    formBox.append(buttonStart)
    container.append(formBox)
    root.append(buttonBack)
    root.append(container)

    linkTemplate.addEventListener('click', downloadTemplate)
    buttonBack.addEventListener('click', navigateWelcome)
    buttonStart.addEventListener('click', handlerStartNewGame)
}

const renderScreenDetail = () => {

    clearContent()

    const container = document.createElement('div')
    const content = document.createElement('div')
    const navGroup = document.createElement('div')
    const sectionDraw = createSectionDraw()
    const sectionListPrize = createSectionPrizes()
    const sectionListPlayer = createSectionPlayers()
    const buttonBack = creatNeonButton("«")

    container.className = "container-blue"
    content.className = "content-detail"
    navGroup.className = "navgroup-detail"

    container.style.flexDirection = "row"
    buttonBack.style.fontSize = "1.5em"
    buttonBack.title = "Back"

    navGroup.append(buttonBack)
    content.append(sectionListPrize)
    content.append(sectionDraw)
    content.append(sectionListPlayer)
    container.append(navGroup)
    container.append(content)
    root.append(container)

    buttonBack.addEventListener('click', navigateWelcome)
}

// Listeners

window.addEventListener('load', handlerOnLoad)
window.addEventListener('unload', handlerUnLoad)

// Start
Start()
