let game = {}
let intervalId = null
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

const checkLastGame = () => {

    const last_game = localStorage.getItem('draw_game')
    if (last_game) {
        game = JSON.parse(last_game)
        game.play = false
        localStorage.setItem("draw_game", JSON.stringify(game))
    }

    navigateWelcome()
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

// Renders

const updateDocumentTitle = (_title = "Lucky Draw") => {

    const title = document.getElementsByTagName("title")
    title[0].textContent = _title
}

const createSectionDraw = () => {

    const sectionDraw = document.createElement('div')
    const title = document.createElement('h6')

    title.textContent = "Draw: " + "Jam Alexander Christie"

    sectionDraw.className = "content-detail-section"
    title.className = "title-section"

    sectionDraw.append(title)
    
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

    const createList = () => {

        // const 
    }
    
    sectionListPrize.append(title)
    sectionListPrize.append(lists)
    
    return sectionListPrize
}

const createSectionPlayers = () => {
    
    const sectionListPlayers = document.createElement('div')
    const title = document.createElement('h6')
    
    title.textContent = "PLAYER"
    
    sectionListPlayers.className = "content-detail-section"
    sectionListPlayers.style.maxWidth = "300px"
    title.className = "title-section"

    sectionListPlayers.append(title)
    
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

window.addEventListener('load', checkLastGame)

// Start
Start()
