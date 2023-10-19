// States

const STATES = {
    ROOT: document.getElementById('root'),
    TITLE: document.getElementsByTagName("title"),
    GAME: {},
    ACTIVE_PRIZE: {},
    TIME_ID: null,
    STAGE_WINNER: [],
    ACTIVE_SCREEN: null,
    SOUNDS: {
        WIN: document.getElementById('sound-win'),
        SPIN: document.getElementById('sound-spin')
    },
    SLOTS: 1
}
const timeIds = []

// Functions

const clearTimeIds = (id) => timeIds.forEach(async (time, i) => {
    if (time?.slot == id) {
        clearInterval(time?.id)
        timeIds.splice(i, 1)
    }
    if (timeIds?.length == 0) STATES?.SOUNDS?.SPIN.pause?.()
})

const handlerOnLoad = async () => {

    const lastGame = JSON.parse(localStorage.getItem('draw_game'))
    const prize = JSON.parse(localStorage.getItem('active_prize'))
    const stageWinners = JSON.parse(localStorage.getItem('stage_winners'))
    const slots = JSON.parse(localStorage.getItem('slots'))
    if (lastGame) STATES.GAME = lastGame
    if (prize) {
        STATES.ACTIVE_PRIZE = prize
        STATES.SLOTS = (STATES.ACTIVE_PRIZE?.total-(STATES.ACTIVE_PRIZE?.winners?.length || 0)) || 1
        updateTitle(`Spin: ${prize?.prize}`)
    }
    if (stageWinners) STATES.STAGE_WINNER = stageWinners
    if (slots) {
        STATES.SLOTS = slots || 1
        STATES.ACTIVE_SCREEN?.refresh?.()
    }
}

const handlerUnLoad = async () => {
    
    STATES?.SOUNDS?.SPIN.pause?.()
    localStorage.removeItem('spin-screen')
    localStorage.removeItem('slots')
}

const handlerChangeStorage = (e) => {

    const data = JSON.parse(e?.newValue)

    if (e.key == 'draw_game') STATES.GAME = data || {}
    if (e.key == 'active_prize') {
        if (!data) return window.close()
        updateTitle(`Spin: ${data?.prize}`)
        STATES.ACTIVE_PRIZE = data || {}
        STATES.SLOTS = (STATES.ACTIVE_PRIZE?.total-(STATES.ACTIVE_PRIZE?.winners?.length || 0)) || 1
    }
    if (e.key == 'slots') STATES.SLOTS = data || 1
    
    STATES.ACTIVE_SCREEN?.refresh?.()

    if (e.key == 'stage_winners') {

        const available = getAvailableParticipants()
        STATES.STAGE_WINNER = data || []
        STATES.ACTIVE_SCREEN?.refresh?.()

        if (data?.length > 0) {
            setTimeout(() => {
                data?.forEach((e, i) => {
                    const slot = document.getElementById(`slot-${i}`)
                    if (e?.spin) {
                        STATES?.SOUNDS?.SPIN.play?.()
                        const time = {
                            slot: i,
                            id: setInterval(() => {
                                slot.textContent = available[getRandomRangeNumber((available.length-1) || 0)]?.name
                            }, 50)
                        }
                        timeIds.push(time)
                    } else {
                        clearTimeIds(i)
                        clearTimeIds(i)
                        clearTimeIds(i)
                        clearTimeIds(i)
                        slot.textContent = e?.winner_name
                    }
                });
            }, 50)
        }
    }
}

const Start = () => {

    setTimeout(() => SpinScreen(), 500);
}

// Screens

// Welcome screen

const SpinScreen = () => {

    const screen = new ScreenSection()

    screen.render(() => {

        const SLOTS = Array(Math.max(0, Math.min(STATES.SLOTS, 20))).fill({})

        return `
            <div class="flex flex-1 flex-col items-center m-10 pt-[28vh]">
                <h1 class="text-[2.85em] text-gray/90 font-bold uppercase">${STATES.ACTIVE_PRIZE?.prize}</h1>
                ${
                    STATES.ACTIVE_PRIZE?.image ? `
                        <div class="absolute left-[6em] pt-6.5">
                            <img src="${STATES.ACTIVE_PRIZE?.image}" class="h-[18em] w-[22em]" />
                        </div>
                    ` : '' 
                }
                ${
                    ((STATES.ACTIVE_PRIZE?.total-(STATES.ACTIVE_PRIZE?.winners?.length || 0)) > 0) ? `
                        <div id="spin-slots" class="flex flex-wrap justify-center w-[67%] mt-2">
                            ${
                                SLOTS.map((_, i) => `
                                    <div class="flex justify-center items-center m-3">
                                        <div class="flex items-center justify-center py-${SLOTS.length >= 9 ? "2" : "3"} px-${SLOTS.length >= 9 ? "3" : "6"} rounded-full shadow-[5px_5px_18px_-5px_rgb(0,0,0,.3)] w-[${SLOTS.length >= 9 ? "15" : "23"}em] bg-white/80">
                                            <p id="slot-${i}" class="text-gray-800 text-[1.7em] text-center line-clamp-1">-</p>
                                        </div>
                                    </div>
                                `)?.join('')
                            }
                        </div>
                    ` : `
                        <div class="h-[40vh] transition-all mt-4 overflow-hidden mask">
                            <ul class="marquee h-[40vh]">
                                ${
                                    STATES.ACTIVE_PRIZE?.winners?.map(w => `
                                        <li class="py-1 flex items-center justify-center">
                                            <span class="font-bold text-[3em] text-gray-800 drop-shadow-lg uppercase">${w?.winner_name}</span>
                                        </li>
                                    `)?.join('')
                                }
                            </ul>
                        </div>
                    `
                }
            </div>
        `
    })
}

// Register

window.addEventListener('load', handlerOnLoad)
window.addEventListener('unload', handlerUnLoad)
window.addEventListener('storage', handlerChangeStorage)

Start()