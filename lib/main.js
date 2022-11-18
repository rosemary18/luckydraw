let game = {}
let active_prize = {}
let intervalId = null
let timeId = null
const root = document.getElementById('root')
const NO_IMAGE = 'data:image/png;base64,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'

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

const createNeonInput = (_title = "", _id = "", _type = "file", _accept = ".txt", _multiple = true) => {

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
    input.multiple = _multiple
    
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

const createDrawOption = () => {

    const container = document.createElement('div')
    const radio1 = document.createElement('input')
    const radio2 = document.createElement('input')
    const label1 = document.createElement('label')
    const label2 = document.createElement('label')

    container.className = "draw-options"

    radio1.type = "radio"
    radio2.type = "radio"
    radio1.name = "draw-option"
    radio2.name = "draw-option"
    radio1.value = 1
    radio2.value = 2

    if (active_prize?.drawType) {
        if (active_prize?.drawType == 1) radio1.checked = true
        else {
            if ((active_prize?.total - active_prize.winners?.length) > 1) radio2.checked = true
            else {
                radio1.checked = true
                radio2.disabled = true

                active_prize.drawType = 1
                game?.prizes?.forEach((item, i) => {
                    if (item?.id == active_prize?.id) game.prizes[i] = active_prize
                })
                localStorage.setItem("draw_prize", JSON.stringify(active_prize))
                localStorage.setItem("draw_game", JSON.stringify(game))
            }
        }
    } else {
        
        active_prize.drawType = 1
        radio1.checked = true
        if ((active_prize?.total - active_prize.winners?.length) < 2) radio2.disabled = true
    }

    label1.textContent = " 1 Draw "
    label2.textContent = " 2 Draw "

    container.append(radio1)
    container.append(label1)
    container.append(radio2)
    container.append(label2)

    const handleChecked = () => {

        const radios = document.getElementsByName('draw-option')
        radios.forEach((radio) => {
            if (radio.checked) {
                active_prize.drawType = radio.value
                game?.prizes?.forEach((item, i) => {
                    if (item?.id == active_prize?.id) game.prizes[i] = active_prize
                })
                localStorage.setItem("draw_prize", JSON.stringify(active_prize))
                localStorage.setItem("draw_game", JSON.stringify(game))
            }
        })
    }

    radio1.addEventListener("change", handleChecked)
    radio2.addEventListener("change", handleChecked)

    return container
}

const createImagePrize = () => {

    const container = document.createElement('div')
    const inputImage = document.createElement('input')
    const imgPrize = document.createElement('img')

    container.className = "input-image"

    inputImage.type = "file"
    inputImage.style.display = "none"
    
    imgPrize.src = active_prize?.image || NO_IMAGE
    imgPrize.style.width = "100%"
    imgPrize.style.cursor = "pointer"
    imgPrize.style.borderRadius = "8px"

    container.append(inputImage)
    container.append(imgPrize)

    container.addEventListener('click', () => inputImage.click())
    inputImage.addEventListener('change', (e) => {

        // Get a reference to the file
        const file = e.target.files[0];

        // Encode the file using the FileReader API
        const reader = new FileReader();
        reader.onloadend = () => {
            active_prize.image = reader.result
            game?.prizes?.forEach((item, i) => {
                if (item?.id == active_prize?.id) game.prizes[i] = active_prize
            })
            localStorage.setItem("draw_prize", JSON.stringify(active_prize))
            localStorage.setItem("draw_game", JSON.stringify(game))
            renderScreenDetail()
        };
        reader.readAsDataURL(file);
    })

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

const clearContent = () => {

    while (root.hasChildNodes()) root.removeChild(root.firstChild)
    return true
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

    if (handlerCheckPrize()) window.open('./play.html', 'blank')

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

    let text = "*Note: Masukkan nama pemain/peserta dipisahakan dengan baris baru / enter. (Note ini jangan dihapus dan tetap terpisah dengan satu baris)\n\nBagus Ardana \nDeliana Mufas \nArkham Jala \nIvan Vilo \nGarim Aklu \nZuya Axe \nCoppa Vanhi \nArian Tuguf \nLuffy \nToni Hamka \nAbdu Rizy \nArya Manud"
    let text1 = "*Note: Masukkan hadiah dan jumlah hadiah dipisahkan dengan koma. Setiap hadiah dipisahkan dengan baris baru atau enter. (Note ini jangan dihapus dan tetap terpisah dengan satu baris)\n\nJam Alexander Christie, 2\nTiket Wisata Marbabu, 5, \nMobil Civic Full Hybrid, 3"

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

    console.log(inputParticipant.files?.[0])
    
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
        active_prize = {}
        game.play = false
        localStorage.setItem("draw_game", JSON.stringify(game))
        localStorage.removeItem('draw_prize')
        localStorage.removeItem('stage_winner')
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

    if (player?.length) {
        player?.map(itm => {
            game?.participant?.forEach((item, i) => {
                if (item?.id == itm?.id) game.participant[i].available = false
            })
        })
    } else {
        game?.participant?.forEach((item, i) => {
            if (item?.id == player?.id) game.participant[i].available = false
        })
    }

    localStorage.setItem("draw_game", JSON.stringify(game))
    localStorage.removeItem('stage_winner')
    renderScreenDetail()
}

const handlerSetWinner = (player) => {

    if (player?.length > 0) {

        player?.map(itm => {
            const winner = {
                prize_id: active_prize?.id,
                prize_name: active_prize?.prize,
                winner_id: itm?.id,
                winner_name: itm?.name
            }
            
            game?.participant?.forEach((item, i) => {
                if (item?.id == itm?.id) game.participant[i].available = false
            })
            
            game?.prizes?.forEach((item, i) => {
                if (item?.id == active_prize?.id) game.prizes[i].winners?.push(winner)
            })
        
            game?.winners?.push(winner)
        })
    } else {
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
    }
    
    localStorage.setItem("draw_game", JSON.stringify(game))
    localStorage.removeItem('stage_winner')
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
        const textDraw1 = document.createElement('p')
        let drawOption = createDrawOption()
        const drawButton = creatNeonButton("Draw")
        const imgPrize = createImagePrize()

        textDetailPrize.textContent = `Prize: ${active_prize?.prize}`
        textDetailTotal.textContent = `Total: ${active_prize?.total} Item`
        textDetailDrawLeft.textContent = `Draw Left : ${active_prize?.total-active_prize?.winners?.length}`

        title.textContent = `Draw: ${active_prize?.prize || ""}`
        titleSideLeft.textContent = "DETAIL"
        titleSideRight.textContent = "WINNERS"
    
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

        textDraw.id = "draw-winner"
        textDraw1.id = "draw-winner"

        sideLeft.append(titleSideLeft)
        sideLeft.append(textDetailPrize)
        sideLeft.append(textDetailTotal)
        sideLeft.append(textDetailDrawLeft)
        sideLeft.append(imgPrize)
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

            playArea.append(drawOption)
            playArea.append(drawButton)
            
            const handlerDraw = () => {
                
                let _stagePlayer = {}, _stagePlayer1 = {}
                const players = filterPlayer(game?.participant)
                
                if (!((active_prize?.drawType == 2) && players?.length > 1) || players?.length == 0) return alert('Participant not available!')
                    
                while (playArea.hasChildNodes()) playArea.removeChild(playArea.firstChild)
                playArea.append(textDraw)
                if (active_prize?.drawType == 2) playArea.append(textDraw1)
    
                if (intervalId) clearInterval(intervalId)
    
                intervalId = setInterval(() => {

                    _stagePlayer = Object.assign({}, players?.[Math.max((Math.floor(Math.random()*(players?.length))), 0)])
                    textDraw.textContent = _stagePlayer?.name
                    if (active_prize?.drawType == 2) {
                        _stagePlayer1 = Object.assign({}, players?.[Math.max((Math.floor(Math.random()*(players?.length))), 0)])
                        textDraw1.textContent = _stagePlayer1?.name
                    }
                }, 50)

                localStorage.setItem('stage_winner', "draw")
    
                setTimeout(() => {

                    clearInterval(intervalId)
                    if ((active_prize?.drawType == 2) && (_stagePlayer?.id == _stagePlayer1?.id)) {
                        players.forEach((itm, i) => (itm?.id == _stagePlayer?.id) && players.splice(i, 1))
                        _stagePlayer1 = players?.[Math.max((Math.floor(Math.random() * (players?.length))), 0)]
                        textDraw1.textContent = _stagePlayer1?.name
                    }

                    let stage = (active_prize?.drawType == 2) ? [_stagePlayer, _stagePlayer1] : _stagePlayer
                    localStorage.setItem('stage_winner', JSON.stringify(stage))

                    setTimeout(() => {
                        let res = confirm("Winner: " + `${textDraw.textContent}${(active_prize?.drawType == 2 ? `, ${textDraw1.textContent}` : '')}` + "\n\n*Note: Peserta tidak dapat mengikuti undian lagi.\nTekan batal akan membuat peserta gugur")
                        if (!res) handlerFallPlayer(stage)
                        else handlerSetWinner(stage)
                        playArea.removeChild(playArea.firstElementChild)
                        drawOption = createDrawOption()
                        playArea.append(drawOption)
                        playArea.append(drawButton)
                    }, 200)
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
