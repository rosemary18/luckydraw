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

    return button
}

// Handlers

const checkLastGame = () => {

    const last_game = localStorage.getItem('draw_game')
    if (last_game) game = JSON.parse(last_game)
    
    localStorage.setItem('test', "Hello")
    // testDraw()
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

const navigateDetail = () => {

    clearContent()
}

const navigateForm = () => {

    clearContent()
    renderScreenForm()
}

const Start = () => {

    renderScreenWelcome()
}

// Renders

const renderScreenWelcome = () => {

    const container = document.createElement('div')
    const buttonContinue = creatNeonButton("Lanjutkan")
    const buttonStartOver = creatNeonButton("Mulai baru") 
    const title = document.createElement('h1')

    container.className = "container-center-blue"
    buttonContinue.className = "button-neon"
    buttonStartOver.className = "button-neon"
    title.className = "title-welcome"

    title.textContent = "Lucky Draw"

    // Append
    container.append(title)
    /* if (Object.keys(game).length > 0)  */container.append(buttonContinue)
    container.append(buttonStartOver)
    root.append(container)

    buttonStartOver.addEventListener('click', navigateForm)
    buttonContinue.addEventListener('click', navigateDetail)
}

const renderScreenForm = () => {

    const container = document.createElement('div')
    const formBox = document.createElement('div')
    const form = document.createElement('form')
    const title = document.createElement('h2')

    container.className = "container-center-blue"
    formBox.className = "form-box"

    title.textContent = "Masukkan data peserta dan hadiah"

    formBox.append(title)
    formBox.append(form)
    root.append(container)
}

const renderScreenDetail = () => {

}

const renderScreenPlay = () => {

}

// Listeners

window.addEventListener('load', checkLastGame)

// Start
Start()
