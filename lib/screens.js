const f = "STATES.ACTIVE_SCREEN."
const timeIds = []

// Welcome screen

const LoadingScreen = ({time = 1000, cb}) => {

    const screen = new ScreenSection()

    screen.render(() => `
        <div class="flex-1 flex justify-center items-center m-10 transition-all">
            <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
            </svg>
        </div>
    `)

    if (typeof cb == "function") setTimeout(cb, time)
}

// Welcome screen

const WelcomeScreen = () => {

    const screen = new ScreenSection()

    screen.navigateForm = () => Navigate('FORM')

    screen.navigateDashboard = () => LoadingScreen({ cb: () => Navigate('DASHBOARD') })
    
    screen.render(() => `
        <div class="flex flex-1 flex-col items-center justify-center m-10">
            <h1 class="text-white text-5xl">Lucky Draw</h1>
            <div class="my-8 mt-[2rem] flex-col flex">
                <button class="p-7 py-2 text-xl bg-[#2196f3] rounded my-2 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 text-white hover:bg-[#2196f3] hover:text-black transition-all" onclick="${f}navigateForm()">Mulai</button>
                ${
                    Object.keys(STATES.GAME).length > 0 ? (
                        `<button class="p-7 py-2 text-md rounded my-2 text-[#2196f3] hover:underline" onclick="${f}navigateDashboard()">Lanjutkan</button>` 
                    ) : ""
                }
            </div>
        </div>
    `)
}

// Form screen

const FormScreen = () => {

    const screen = new ScreenSection()

    screen.goBack = () => Navigate('WELCOME')

    screen.downloadTemplate = () => {

        console.log("Downloading...")

        // Elements
        const link = document.createElement('a');
        const link1 = document.createElement('a');
    
        // Contents
        let participants = "*Note: Masukkan nama pemain/peserta dipisahakan dengan baris baru / enter. (Note ini jangan dihapus dan tetap terpisah dengan satu baris)\n\nBagus Ardana\nDeliana Mufas\nArkham Jala\nIvan Vilo\nGarim Aklu\nZuya Axe\nCoppa Vanhi\nArian Tuguf\nLuffy\nToni Hamka\nAbdu Rizy\nArya Manud"
        let prizes = "*Note: Masukkan hadiah dan jumlah hadiah dipisahkan dengan koma. Setiap hadiah dipisahkan dengan baris baru atau enter. (Note ini jangan dihapus dan tetap terpisah dengan satu baris)\n\nJam Alexander Christie, 2\nTiket Wisata Marbabu, 5\nMobil Civic Full Hybrid, 3"
    
        // Downloading
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(participants));
        link.setAttribute('download', `template-peserta.txt`);
        link.click()
    
        link1.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(prizes));
        link1.setAttribute('download', `template-hadiah.txt`);
        setTimeout(() => link1.click(), 400);
    }

    screen.start = async () => {

        let err = false
        const newGame = {
            participants: [],
            prizes: [],
            winners: []
        }
    
        const participants = document.getElementById('file_participants')
        const prizes = document.getElementById('file_prizes')
    
        console.log(participants?.files?.[0])
        
        if (!participants?.files?.[0] || !prizes?.files?.[0]) return alert("Data belum lengkap ...")

        const readParticipants = new FileReader();
        const readPrizes = new FileReader();
    
        readParticipants.addEventListener('load', (event) => {
    
            if (typeof event.target.result == "string") {
    
                let id = 0;
                const data = event.target.result.split('\n\n')?.[1]?.split('\n')
    
                if (data?.length > 0) {
                    data?.map(name => {
                        newGame.participants.push({
                            id,
                            name: name?.trim(),
                            defined_prize: false,
                            available: true
                        })
                        id++;
                    })
                } else err = true
            }
        })
    
        readPrizes.addEventListener('load', (event) => {
    
            if (typeof event.target.result == "string") {
    
                let id = 0;
                const data = event.target.result.split('\n\n')?.[1]?.split('\n')
    
                if (data?.length > 0) {
                    data?.map(prize => {
                        newGame.prizes.push({
                            id,
                            prize: prize?.split(",")?.[0]?.trim(),
                            total: parseInt(prize?.split(",")?.[1] || 1),
                            defined_winners: [],
                            winners: []
                        })
                        id++;
                    })
                } else err = true
            }
        })
    
        readParticipants.readAsText(participants.files[0])
        readPrizes.readAsText(prizes.files[0])
    
        setTimeout(() => {
            if (err) return alert("Terjadi kesalahan, periksa kembali file, mohon ikuti arahan cara pengisian yan tertera didalam template ...")
            else {                
                localStorage.setItem("draw_game", JSON.stringify(newGame))
                STATES.GAME = newGame                
                LoadingScreen({cb: () => Navigate("DASHBOARD")})
            }
        }, 1000);


    }

    screen.render(() => `
        <div class="flex flex-1 flex-col items-center pt-[10em]">
            <div>
                <div class="flex bg-[#374251] flex-col rounded w-[23em] shadow-[0_2px_50px_-10px_rgba(33,150,243,.3)] p-[2px]">
                    <h1 class="text-center m-2 text-white">Mulai Baru</h1>
                    <div class="flex flex-col bg-[#101827] rounded p-3">
                        <div class="flex flex-col">
                            <label class="block mb-2 text-xs font-medium text-gray-900 text-white" for="file_input">Upload file hadiah</label>
                            <input class="block w-full p-1 text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400" aria-describedby="file_input_prizes" id="file_prizes" type="file" accept=".txt">
                        </div>
                        <div class="flex flex-col mt-2">
                            <label class="block mb-2 text-xs font-medium text-gray-900 text-white" for="file_input">Upload file peserta</label>
                            <input class="block w-full p-1 text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400" aria-describedby="file_input_participants" id="file_participants" type="file" accept=".txt">
                        </div>
                        <a class="text-[#4F46E4] text-sm mt-4 hover:underline hover:cursor-pointer" onclick="${f}downloadTemplate()">File template peserta dan hadiah ←</a>
                    </div>
                </div>
                <div class="flex my-4">
                    <button class="p-2 px-4 flex flex-1 bg-[#374251] text-[#FFFFFF] mr-2 rounded justify-center hover:text-white hover:bg-[#2196f3]" onclick="${f}goBack()">Kembali</button>
                    <button class="p-2 px-4 flex flex-1 text-[#2196f3] border border-[#2196f3] bg-transparent ml-2 rounded justify-center text-md hover:text-white hover:bg-[#2196f3]" onclick="${f}start()">Mulai</button>
                </div>
            </div>
        </div>
    `)
}

// Register screen

const DashboardScreen = () => {

    STATES.GAME.play = true
    localStorage.setItem("draw_game", stringify(STATES.GAME))
    updateTitle("Dashboard: Lucky Draw")

    const screen = new ScreenSection()
    const clearTimeIds = () => timeIds.forEach(async (time, i) => {
        clearInterval(time?.id)
        timeIds.splice(i, 1)
    })

    screen.selectPrize = async (id) => {

        let run = true

        if (STATES.STAGE_WINNER?.some(w => w?.spin == true)) return alert(`Masih ada undian yang belum selesai!`)
        if (STATES.STAGE_WINNER?.length > 0) {
            const force = confirm('Selesaikan undian terlebih dahulu!\nAtau apakah anda ingin langsung pindah ?')
            if (!force) run = false
            else STATES.STAGE_WINNER = []
        } 
        
        if (run) {
            if (id == STATES.ACTIVE_PRIZE?.id) {
                STATES.ACTIVE_PRIZE = {}
                screen.refresh()
            } else {
                STATES.GAME?.prizes?.forEach((prize) => {
                    if (prize?.id == id) {
                        STATES.ACTIVE_PRIZE = prize
                        localStorage.setItem('active_prize', stringify(prize))
                        screen.refresh()
                    }
                })
            }
        }
        
        if (!STATES.SPIN_SCREEN) {
            STATES.SPIN_SCREEN = true
            localStorage.setItem('spin-screen', stringify(true))
            setTimeout(() => window.open('./spin.html', 'tab-spin'), 500)
        }

        STATES.ACTIVE_SCREEN.contentParticipant()
    }

    screen.export = () => {
        let now = new Date()
        const link = document.createElement('a');
        let text = `Pemenang Lucky Draw ${now.getFullYear()}/${now.getMonth()}/${now.getDate()}\n\n`

        STATES.GAME?.winners?.map((winner, i) => text += `${i+1}. ${winner.winner_name} - (${winner.prize_name})\n`)

        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        link.setAttribute('download', `List Pemenang Lucky Draw ${now.getFullYear()}/${now.getMonth()}/${now.getDate()}.txt`);
        link.click()
    }

    screen.close = () => {
        if (Object.keys(STATES.GAME).length > 0) {
        
            STATES.GAME.play = false
            STATES.ACTIVE_PRIZE = {}
            STATES.STAGE_WINNER = []
        
            localStorage.setItem("draw_game", stringify(STATES.GAME))
            localStorage.removeItem('active_prize')
            localStorage.removeItem('stage_winners')
    
            LoadingScreen({time: 1000, cb: () => Navigate("WELCOME")}) 
        }
    }

    screen.checkParticipant = (item) => {

        let res = {
            win: false,
            available: item?.available,
            color: "white",
            prize: ""
        }

        if (STATES.GAME?.winners?.some(itm => itm?.winner_id == item?.id)) {
            const _prize = STATES.GAME?.winners?.find(itm => itm?.winner_id == item?.id)
            res.prize_id = _prize?.prize_id
            res.prize = `(${_prize?.prize_name})`
            res.color = "[#00a97e]"
            res.win = true
        } else if (!item?.available) res.color = "[#FF0000]"

        return res
    }

    screen.uploadImagePrize = () => {
        const e = document.createElement('input')
        e.type = "file"
        e.accept = ".png,.jpg,.jpeg"

        e.addEventListener('change', (e) => {

            if (e.target?.files?.[0]) {

                // Get a reference to the file
                const file = e.target.files[0];

                // Encode the file using the FileReader API
                const reader = new FileReader();
                reader.onloadend = () => {
                    STATES.ACTIVE_PRIZE.image = reader.result
                    STATES.GAME?.prizes?.forEach((item, i) => {
                        if (item?.id == STATES.ACTIVE_PRIZE?.id) STATES.GAME.prizes[i] = STATES.ACTIVE_PRIZE
                    })
                    localStorage.setItem("active_prize", stringify(STATES.ACTIVE_PRIZE))
                    localStorage.setItem("draw_game", stringify(STATES.GAME))
                    STATES.ACTIVE_SCREEN?.refresh?.()
                };
                reader.readAsDataURL(file);
            }
        })
        e.click()
    }

    screen.onActiveDraw = (index) => {

        const active = []
        const slots = document.getElementsByName('slot-draw')
        const e = document.getElementById(`draw-${index}`)
        const ct = document.getElementById(`con-text-${index}`)
        const t = document.getElementById(`text-${index}`)
        const f = document.getElementById(`fall-${index}`)

        if (e?.checked) {
            ct.classList.remove('bg-gray-700')
            ct.classList.add('bg-white')
        } else {
            ct.classList.remove('bg-white')
            ct.classList.add('bg-gray-700')
        }

        slots.forEach(e => e?.checked && active.push(e))
        localStorage.setItem('slots', `${active?.length}`)
    }

    screen.draw = () => {
        
        let active = []
        const available_participants = getAvailableParticipants()
        const stage_winners = []
        const slots = document.getElementsByName('slot-draw')

        if (slots?.length > 0) {

            let slot_avail = 0
            slots.forEach?.(slot => {
                if (slot?.checked) slot_avail += 1
            })

            if (available_participants.length < slot_avail) return alert(`Peserta tidak cukup untuk melakukan pengundian!`)

            const drawBtn = document.getElementById('draw')
            const stopDrawBtn = document.getElementById('stop-draw')

            slots.forEach((e, i) => {
                const cd = document.getElementById(`con-draw-${i}`)
                e.classList.add('hidden')
                if (!e?.checked) cd.classList.add('hidden')
                if (e?.checked) {
                    active.push(e)
                    const available = getAvailableParticipants()
                    STATES.STAGE_WINNER = stage_winners
                    const selectedParticipant = STATES.ACTIVE_PRIZE?.defined_winners[i] || available[getRandomRangeNumber(available.length-1)]
                    stage_winners.push({
                        slot: i,
                        spin: true,
                        winner_id: selectedParticipant?.id,
                        winner_name: selectedParticipant?.name
                    })
                }
            })

            drawBtn.classList.add('hidden')
            stopDrawBtn.classList.remove('hidden')
            localStorage.setItem('slots', `${active?.length}`)
            localStorage.setItem('stage_winners', stringify(stage_winners))

            stage_winners.forEach(slot => {
                const text = document.getElementById(`text-${slot?.slot}`)
                let time = {
                    slot: slot?.slot,
                    id: setInterval(() => {
                        text.textContent = available_participants[getRandomRangeNumber(available_participants.length-1)]?.name
                    }, 50)
                }
                timeIds.push(time)
            })

            document.getElementById("btn-define-winner").classList.add('hidden')
        }
    }

    screen.stopSpin = async (index) => {

        if (index) {

            const fall = document.getElementById(`fall-${index}`)
            const stopBtn = document.getElementById(`stop-${index}`)
            const text = document.getElementById(`text-${index}`)

            timeIds.forEach(async (time, i) => {
                if (time?.slot == index) {
                    clearInterval(time?.id)
                    timeIds.splice(i, 1)
                }
            })
            timeIds.forEach(async (time, i) => {
                if (time?.slot == index) {
                    clearInterval(time?.id)
                    timeIds.splice(i, 1)
                }
            })

            STATES.STAGE_WINNER[index] = {
                ...STATES.STAGE_WINNER[index],
                spin: false
            }

            text.textContent = STATES.STAGE_WINNER[index]?.winner_name
            fall.classList.remove('hidden')
            stopBtn.classList.add('hidden')
        } else {

            const stopDrawBtn = document.getElementById('stop-draw')
            const decisionBtn = document.getElementById('decision')

            clearTimeIds()
            clearTimeIds()
            clearTimeIds()
            clearTimeIds()

            STATES.STAGE_WINNER?.forEach((slot, i) => {
                const text = document.getElementById(`text-${slot?.slot}`)
                const fall = document.getElementById(`fall-${slot?.slot}`)
                text.textContent = slot?.winner_name
                fall.classList.remove('hidden')
                STATES.STAGE_WINNER[i].spin = false
            });

            stopDrawBtn.classList.add('hidden')
            decisionBtn.classList.remove('hidden')
        }

        localStorage.setItem('stage_winners', stringify(STATES.STAGE_WINNER))
    }

    screen.redraw = (index) => {

        const slots = document.getElementsByName('slot-draw')
        const available_participants = getAvailableParticipants()
        let slot_active = 0

        slots.forEach(e => e?.checked && (slot_active += 1))

        if (index) {
            if (available_participants.length < 1) return alert(`Peserta tidak cukup untuk melakukan pengundian!`)
            if (STATES.STAGE_WINNER?.[index]?.spin) return alert(`Masih ada undian yang belum selesai!`)
            else {
                
                const fall = document.getElementById(`fall-${index}`)
                const stopBtn = document.getElementById(`stop-${index}`)
                
                // Falling the participant
                STATES.GAME.participants?.forEach((p, i) => {
                    if (p?.id == STATES.STAGE_WINNER[index]?.winner_id) {
                        STATES.GAME.participants[i].available = false
                        STATES.GAME.participants[i].defined_prize = false
                    }
                })

                // Set new winner
                STATES.STAGE_WINNER?.forEach(winner => {
                    if (winner?.winner_id == STATES.STAGE_WINNER[index]?.winner_id) {
                        const available = getAvailableParticipants()
                        const selectedParticipant = available[getRandomRangeNumber(available.length-1)]
                        STATES.STAGE_WINNER[index] = {
                            ...STATES.STAGE_WINNER[index],
                            spin: true,
                            winner_id: selectedParticipant?.id,
                            winner_name: selectedParticipant?.name
                        }
                    }
                })

                STATES.ACTIVE_SCREEN.contentParticipant()
                
                setTimeout(() => {

                    // Save to storage
                    localStorage.setItem('draw_game', stringify(STATES.GAME))
                    localStorage.setItem('stage_winners', stringify(STATES.STAGE_WINNER))

                    fall.classList.add('hidden')
                    stopBtn.classList.remove('hidden')

                    const text = document.getElementById(`text-${index}`)
                    let time = {
                        slot: index,
                        id: setInterval(() => {
                            text.textContent = available_participants[getRandomRangeNumber(available_participants.length-1)]?.name
                        }, 50)
                    }
                    timeIds.push(time)
                }, 100);
            }
        } else {
            if (available_participants.length < slot_active) return alert(`Peserta tidak cukup untuk pengundian selanjutnya! Jika dalam daftar masih banyak peserta, mohon periksa kembali peserta tersebut apakah sudah di definisikan kepada hadiah tertentu.`)
            if (STATES.STAGE_WINNER?.some(w => w?.spin == true)) return alert(`Masih ada undian yang belum selesai!`)
            else {
                const stage_winners = []
                const stopDrawBtn = document.getElementById('stop-draw')
                const decisionBtn = document.getElementById('decision')
                
                if (slots?.length > 0) {

                    STATES.STAGE_WINNER?.forEach(winner => {
                        STATES.GAME.participants?.forEach((p, i) => {
                            if (p?.id == winner?.winner_id) {
                                STATES.GAME.participants[i].available = false
                                if (STATES.GAME.participants[i].defined_prize) {

                                    STATES.ACTIVE_PRIZE.defined_winners.forEach((dw, i) => {
                                        if (dw?.id == p?.id) STATES.ACTIVE_PRIZE.defined_winners[i] = null
                                    })
                        
                                    STATES.GAME.prizes?.forEach((prize, i) => {
                                        if (prize?.id == STATES.ACTIVE_PRIZE?.id) STATES.GAME.prizes[i] = STATES.ACTIVE_PRIZE
                                    })
                                }
                                STATES.GAME.participants[i].defined_prize = false
                            }
                        })
                    })

                    localStorage.setItem('active_prize', stringify(STATES.ACTIVE_PRIZE))
                    localStorage.setItem('draw_game', stringify(STATES.GAME))

                    STATES.ACTIVE_SCREEN.contentParticipant()
                    
                    setTimeout(() => {

                        slots.forEach((e, i) => {
                            const available = getAvailableParticipants()
                            STATES.STAGE_WINNER = stage_winners
                            const selectedParticipant = available[getRandomRangeNumber(available.length-1)]
                            if (e?.checked) {
                                stage_winners.push({
                                    slot: i,
                                    spin: true,
                                    winner_id: selectedParticipant?.id,
                                    winner_name: selectedParticipant?.name
                                })
                            }
                        })
                        
                        stopDrawBtn.classList.remove('hidden')
                        decisionBtn.classList.add('hidden')
                        STATES.STAGE_WINNER = stage_winners
                        localStorage.setItem('draw_game', stringify(STATES.GAME))
                        localStorage.setItem('stage_winners', stringify(stage_winners))
    
                        stage_winners.forEach(slot => {
                            document.getElementById(`fall-${slot?.slot}`).classList.add('hidden')
                            const text = document.getElementById(`text-${slot?.slot}`)
                            let time = {
                                slot: slot?.slot,
                                id: setInterval(() => {
                                    text.textContent = available_participants[getRandomRangeNumber(available_participants.length-1)]?.name
                                }, 50)
                            }
                            timeIds.push(time)
                        })
                    }, 100);
                }
            }            
        }

    }

    screen.save = () => {
        if (STATES.STAGE_WINNER?.some(w => w?.spin == true)) return alert(`Masih ada undian yang belum selesai!`)
        else {
            
            STATES.STAGE_WINNER?.map(w => {

                const winner = {
                    prize_id: STATES.ACTIVE_PRIZE?.id,
                    prize_name: STATES.ACTIVE_PRIZE?.prize,
                    winner_id: w?.winner_id,
                    winner_name: w?.winner_name
                }
                
                STATES.GAME?.participants?.forEach((p, i) => {
                    if (p?.id == w?.winner_id) {
                        STATES.GAME.participants[i].defined_prize = false
                        STATES.GAME.participants[i].available = false
                    }
                })
                
                STATES.GAME?.prizes?.forEach((item, i) => {
                    if (item?.id == STATES.ACTIVE_PRIZE?.id) STATES.GAME.prizes[i].winners?.push(winner)
                })
            
                STATES.GAME?.winners?.push(winner)
            })

            if (STATES.ACTIVE_PRIZE?.defined_winners?.length > 0) {
                STATES.ACTIVE_PRIZE?.defined_winners?.splice(0, STATES.STAGE_WINNER?.length)
                STATES.GAME.prizes?.forEach((prize, i) => {
                    if (prize?.id == STATES.ACTIVE_PRIZE?.id) STATES.GAME.prizes[i] = STATES.ACTIVE_PRIZE
                })
            }
            
            STATES.STAGE_WINNER = []
            localStorage.setItem("draw_game", stringify(STATES.GAME))
            localStorage.setItem("active_prize", stringify(STATES.ACTIVE_PRIZE))
            localStorage.removeItem('stage_winners')
            STATES.ACTIVE_SCREEN.refresh?.()
        }
    }

    screen.addParticipant = () => {

        let p = prompt('Tambah peserta, masukkan nama peserta')
        if (p != null || p != "") {
            STATES.GAME.participants?.push({
                id: STATES.GAME.participants?.length,
                name: p?.trim(),
                defined_prize: false,
                available: true
            })
            localStorage.setItem("draw_game", stringify(STATES.GAME))
            screen.refresh()
        }
    }

    screen.addPrize = () => {

        let t, n;
        n = prompt('Tambah hadiah, masukkan nama hadiah')
        if (n != null ) t = prompt('Masukkan total hadiah')
        if ((n != null || n != "") && t != null) {
            STATES.GAME.prizes?.push({
                id: STATES.GAME.prizes?.length,
                prize: n,
                total: parseInt(t) || 1,
                defined_winners: [],
                winners: []
            })
            localStorage.setItem("draw_game", stringify(STATES.GAME))
            screen.refresh()
        }
    }

    screen.showModalDefineWinner = () => document.getElementById("modal-define-winner").classList.remove('hidden')

    screen.closeModalDefineWinner = () => {
        document.getElementById("modal-define-winner").classList.add('hidden')
        STATES.ACTIVE_SCREEN?.refresh?.()
    }

    screen.saveDefineWinners = () => {

        const defined = []
        const definedWinners = []
        document.getElementsByName('defined-winner').forEach(e => definedWinners.push(e.value))

        if (definedWinners?.length > 0) {

            if (hasDuplicate(definedWinners.filter(e => e !== "-"))) return alert('Peserta yang sama terdeteksi pada lebih dari satu slot!')

            definedWinners.forEach(w => {
                if (w == "-") defined.push(null)
                else {
                    STATES.GAME.participants.forEach((p, i) => {
                        if (p?.id == w) {
                            STATES.GAME.participants[i].defined_prize = true
                            defined.push(p)
                        }
                    })
                }
            })

            STATES.ACTIVE_PRIZE.defined_winners.forEach((dw, i) => {

                let exist = false
                defined.forEach(d => {
                    if (d?.id == dw?.id) exist = true
                })

                if (!exist) {
                    STATES.GAME.participants.forEach((p, i) => {
                        if (p?.id == dw.id) {
                            STATES.GAME.participants[i].defined_prize = false
                        }
                    })
                }
            })

            STATES.ACTIVE_PRIZE.defined_winners = defined

            STATES.GAME.prizes?.forEach((prize, i) => {
                if (prize?.id == STATES.ACTIVE_PRIZE?.id) STATES.GAME.prizes[i] = STATES.ACTIVE_PRIZE
            })

            localStorage.setItem('active_prize', stringify(STATES.ACTIVE_PRIZE))
            localStorage.setItem('draw_game', stringify(STATES.GAME))
            document.getElementById("modal-define-winner").classList.add('hidden')
            STATES.ACTIVE_SCREEN?.refresh?.()
        }
    }

    screen.getBackParticipant = (id) => {

        STATES.GAME.participants?.forEach((p, i) => {
            if (id == p?.id) STATES.GAME.participants[i].available = true
        })
        STATES.ACTIVE_SCREEN?.refresh?.()
    }

    screen.contentParticipant = () => document.getElementById('participant-content').innerHTML = `
        <ul class="mt-4">
            ${
                sortPlayer(STATES.GAME?.participants)?.map((participant, i) => `
                    <li class="my-3 flex items-center">
                        <div class="flex flex-1 items-center">
                            <span class="whitespace-nowrap text-white">${i + 1}. ${participant?.name || "-"}</span>
                            <span class="whitespace-nowrap text-[#2196f3] hover:underline cursor-pointer ml-1" onclick="${f}selectPrize('${STATES.ACTIVE_SCREEN?.checkParticipant?.(participant).prize_id}')">
                                ${STATES.ACTIVE_SCREEN?.checkParticipant?.(participant).prize}
                            </span>                                
                        </div>
                        ${
                            (!STATES.ACTIVE_SCREEN?.checkParticipant?.(participant).win && !STATES.ACTIVE_SCREEN?.checkParticipant?.(participant).available && !Object.keys(STATES.ACTIVE_PRIZE)?.length > 0) ? `
                                <span onclick="${f}getBackParticipant('${participant?.id}')" class="text-sm text-[#2196f3] mx-2 hover:underline cursor-pointer">
                                    Kembalikan
                                </span>
                            ` : ''
                        }
                        <span class="h-3 w-3 rounded-full bg-${STATES.ACTIVE_SCREEN?.checkParticipant?.(participant).color}" />
                    </li>\n
                `).join('')
            }
        </ul>
    `

    screen.render(({ checkParticipant }) => `

        <nav class="fixed top-0 z-50 w-full border-b border-gray-200 bg-gray-800 border-gray-700">
            <div class="px-3 py-3 lg:px-5 lg:pl-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center justify-start">
                        <a class="flex items-center">
                            <div class="h-8 w-8 mr-3">
                                <img src="./assets/logos/fav.ico" class="h-8" alt="Lucky Draw Logo" />
                            </div>
                            <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">Lucky Draw</span>
                        </a>
                    </div>
                    <div class="flex items-center">
                        <div class="flex items-center ml-3">
                            <div class="hidden w-full md:block md:w-auto mr-2" id="navbar-solid-bg">
                                <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent bg-gray-800 md:bg-transparent border-gray-700">
                                    <li>
                                        <a class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent" onclick="${f}export()">Export</a>
                                    </li>
                                    <li>
                                        <a class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent" onclick="${f}close()">Keluar</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <aside class="fixed top-0 left-0 z-40 w-64 h-screen pt-[4.5em] transition-transform -translate-x-full border-r border-gray-200 sm:translate-x-0 bg-gray-800 border-gray-700" aria-label="Sidebar">
            <div class="h-full px-3 pb-4 overflow-y-auto bg-gray-800">
                <ul class="space-y-2 font-medium">
                    ${
                        STATES.GAME?.prizes?.map((item) => `
                            <li class="cursor-pointer">
                                <a class="flex items-center p-2 rounded-lg text-white ${STATES.ACTIVE_PRIZE?.id == item?.id ? 'bg-[#2196f3]' : 'hover:bg-gray-700'} group" onclick="${f}selectPrize('${item?.id}')">
                                    <span class="flex-1 ml-1 whitespace-nowrap">${item?.prize || "-"}</span>
                                    ${
                                        (item?.total - item?.winners?.length) > 0 ? `<span class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium rounded-full bg-gray-700 text-gray-300">${(item?.total - item?.winners?.length)}</span>` 
                                        : `<span class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-white bg-[#32C38D] rounded-full">✓</span>`
                                    }
                                </a>
                            </li>\n
                        `).join('')
                    }
                    ${
                        !(Object.keys(STATES.ACTIVE_PRIZE).length > 0) ? `
                            <li class="flex justify-center items-center py-4">
                                <button
                                    type="button"
                                    onclick="${f}addPrize()"
                                    class="rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]">
                                    Tambah
                                </button>            
                            </li>
                        ` : ''
                    }
                </ul>
            </div>
        </aside>

        <div class="p-4 sm:ml-64 flex pt-[4.6em] h-full">
            <div class="flex flex-[2] flex-col mr-4 rounded-lg">
                <div class="flex flex-col overflow-y-auto flex-1 rounded-lg bg-gray-50 bg-gray-800 p-4">
                    ${
                        (Object.keys(STATES.ACTIVE_PRIZE).length > 0) ? `
                            <div class="flex">
                                <img src="${ STATES?.ACTIVE_PRIZE?.image || './assets/img/no-img.png'}" class="h-40 w-48 rounded-md cursor-pointer" onclick="${f}uploadImagePrize()" />                        
                                <div class="flex flex-col flex-1 px-4">
                                    <h3 class="text-white font-bold tracking-widest text-lg">${STATES.ACTIVE_PRIZE?.prize}</h3>
                                    <p class="text-white text-sm mt-3">Total hadiah : ${STATES.ACTIVE_PRIZE?.total}</p>
                                    <p class="text-white text-sm">Sisa undian : ${(STATES.ACTIVE_PRIZE?.total-STATES.ACTIVE_PRIZE?.winners.length) || 0}</p>
                                </div>
                            </div>
                            ${
                                (STATES.ACTIVE_PRIZE?.winners?.length > 0) ? `
                                    <h2 class="text-white font-bold tracking-widest mt-4">Pemenang</h2>
                                    <ul>
                                        ${
                                            STATES.ACTIVE_PRIZE?.winners?.map((winner, i) => (true) ? `
                                                <li class="my-1 flex items-center">
                                                    <span class="whitespace-nowrap text-[#94A4B8]">${i + 1}. ${winner?.winner_name || "-"}</span>
                                                </li>\n
                                            ` : '').join('')
                                        }
                                    </ul>
                                ` : ''
                            }
                        ` : `
                            <h2 class="text-white font-bold tracking-widest">PEMENANG ${STATES.GAME?.winners?.length > 0 ? `(${STATES.GAME?.winners?.length})` : ''}</h2>
                            ${
                                STATES.GAME?.winners?.length > 0 ? `
                                    <ul class="mt-4">
                                        ${
                                            STATES.GAME?.winners?.map((winner, i) => `
                                                <li class="my-3 flex items-center">
                                                    <span class="whitespace-nowrap text-white">${i + 1}. ${winner?.winner_name || "-"}</span>
                                                    <span class="whitespace-nowrap text-[#2196f3] hover:underline cursor-pointer ml-1" onclick="${f}selectPrize('${winner?.prize_id}')">(${winner?.prize_name})</span>
                                                </li>\n
                                            `).join('')
                                        }
                                    </ul>
                                ` : '<span class="text-white mt-4">-</span>'
                            }
                        `
                    }
                </div>
                ${
                    (Object.keys(STATES.ACTIVE_PRIZE).length > 0 && (STATES.ACTIVE_PRIZE?.total - STATES.ACTIVE_PRIZE?.winners?.length) > 0) ? `
                        <div class="flex h-[20em] rounded-lg bg-gray-50 bg-gray-800 mt-4 p-4">
                            <div class="flex flex-col flex-1">
                                <div class="flex flex-col max-h-[100%] overflow-y-auto">
                                    ${
                                        Array(Math.max(0, Math.min(((STATES.ACTIVE_PRIZE?.total-STATES.ACTIVE_PRIZE?.winners.length) || 0), 20))).fill({}).map((_, i) => `
                                            <div id="con-draw-${i}" class="flex items-center my-2">
                                                <input id="draw-${i}" name="slot-draw" ${(i == 0) ? 'disabled' : ''} type="checkbox" checked onchange="${f}onActiveDraw('${i}')" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-600 ring-offset-gray-800 bg-gray-700 border-gray-600 mr-4">
                                                <div id="con-text-${i}" class="rounded w-[20em] bg-white h-7 mr-4 flex justify-center items-center">
                                                    <p id="text-${i}" class="text-sm text-gray-800">Slot ${i+1}</p>
                                                </div>
                                                <button id="fall-${i}" onclick="${f}redraw('${i}')" class="cursor-pointer bg-gray-700 hover:bg-red-800 text-gray-400 text-sm py-[.3em] px-[.6em] border-[.5px] border-gray-700 hover:text-white rounded shadow hidden">Hangus</button>
                                                <button id="stop-${i}" onclick="${f}stopSpin('${i}')" class="cursor-pointer bg-gray-700 hover:bg-red-800 text-gray-400 text-sm py-[.3em] px-[.6em] border-[.5px] border-gray-700 hover:text-white rounded shadow hidden">Stop</button>
                                            </div>
                                        `).join('')
                                    }
                                </div>
                            </div>
                            <div class="flex flex-col items-end">
                                <button id="btn-define-winner" onclick="${f}showModalDefineWinner()">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#E4E4E4" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <div class="flex flex-col flex-1 justify-end items-end p-1">
                                    <a id="draw" onclick="${f}draw()" class="px-5 py-2.5 relative rounded group font-medium text-white font-medium inline-block cursor-pointer ml-3">
                                        <span class="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
                                        <span class="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
                                        <span class="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
                                        <span class="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
                                        <span class="relative">Spin</span>
                                    </a>
                                    <a id="stop-draw" onclick="${f}stopSpin()" class="px-5 py-2.5 relative rounded group font-medium font-medium inline-block cursor-pointer bg-gray-700 hover:bg-red-800 hover:text-white text-gray-400 hidden">
                                        <span class="relative">Stop</span>
                                    </a>
                                    <div id="decision" class="flex hidden">
                                        <a id="fall-all" onclick="${f}redraw()" class="px-5 py-2.5 relative rounded group font-medium font-medium inline-block cursor-pointer bg-gray-700 hover:bg-red-800 hover:text-white text-gray-400">
                                            <span class="relative">Hangus</span>
                                        </a>
                                        <a id="save" onclick="${f}save()" class="px-5 py-2.5 relative rounded group font-medium font-medium inline-block cursor-pointer bg-green-800 hover:bg-green-600 text-white ml-2">
                                            <span class="relative">Simpan</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''
                }
            </div>
            <div class="flex flex-1 max-h-[100%] overflow-y-auto p-4 flex-col border-2 border-gray-200 border-dashed rounded-lg border-gray-700">
                <div class="flex items-center justify-between">
                    <h2 class="text-white font-bold tracking-widest">PESERTA</h2>
                    ${
                        !(Object.keys(STATES.ACTIVE_PRIZE).length > 0) ? `
                            <button
                                type="button"
                                onclick="${f}addParticipant()"
                                class="rounded bg-neutral-50 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)]">
                                Tambah
                            </button>
                        ` : ''
                    }
                </div>
                <div id="participant-content">
                    <ul class="mt-4">
                        ${
                            sortPlayer(STATES.GAME?.participants)?.map((participant, i) => `
                                <li class="my-3 flex items-center">
                                    <div class="flex flex-1 items-center">
                                        <span class="whitespace-nowrap text-white mr-1">${i + 1}. ${participant?.name || "-"}</span>
                                        ${ participant?.defined_prize ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M19 22V4c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2v18l7-4.666L19 22zM8.006 8.056c0-.568.224-1.083.585-1.456.361-.372.86-.603 1.412-.603 0 0 .996-.003 1.997 1.029 1.001-1.032 1.997-1.029 1.997-1.029.552 0 1.051.23 1.412.603s.585.888.585 1.456-.224 1.084-.585 1.456L12 13.203 8.591 9.512a2.083 2.083 0 0 1-.585-1.456z" fill="#C6E635"></path></svg>` : "" }
                                        <span class="whitespace-nowrap text-[#2196f3] hover:underline cursor-pointer ml-1" onclick="${f}selectPrize('${checkParticipant?.(participant).prize_id}')">${checkParticipant?.(participant).prize}</span>                                
                                    </div>
                                    ${
                                        (!checkParticipant?.(participant).win && !checkParticipant?.(participant).available && !Object.keys(STATES.ACTIVE_PRIZE)?.length > 0) ? `
                                            <span onclick="${f}getBackParticipant('${participant?.id}')" class="text-sm text-[#2196f3] mx-2 hover:underline cursor-pointer">
                                                Kembalikan
                                            </span>
                                        ` : ''
                                    }
                                    <span class="h-3 w-3 rounded-full bg-${checkParticipant?.(participant).color}" />
                                </li>\n
                            `).join('')
                        }
                    </ul>
                </div>
            </div>
        </div>
    
        <div id="modal-define-winner" class="hidden transition-all duration-800 fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-white/1 z-50 w-full overflow-x-hidden overflow-y-auto max-h-full">
            <div class="flex flex-1 flex-col items-end h-full max-h-full">
                <div class="flex flex-col h-full max-h-full rounded-l-md shadow bg-gray-800 w-[24em]">
                    <div class="flex items-center px-4 py-2">                    
                        <h3 class="text-lg font-medium text-gray-900 text-white">Definisikan Pemenang</h3>
                        <button onclick="${f}closeModalDefineWinner()" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                    <div id="list-defined-winner" class="flex flex-col flex-1 max-h-[100%] overflow-y-auto border-b border-t border-gray-600 p-4">
                        ${
                            Object.keys(STATES.ACTIVE_PRIZE).length > 0 ? Array(Math.max((STATES.ACTIVE_PRIZE?.total-(STATES.ACTIVE_PRIZE?.winners?.length || 0)), 1)).fill({}).map((_, i) => `
                                <div class="mb-2">
                                    <p class="text-xs text-gray-400 mb-1">Slot ${i+1}</p>
                                    <select id="defined-winner-${i}" name="defined-winner" class="flex p-2 border outline-none text-white text-sm rounded-md block w-full bg-gray-700 border-gray-600 placeholder-gray-400 appearance-none">
                                        <option ${(STATES?.ACTIVE_PRIZE?.defined_winners[i]) ? '' : 'selected'} value="-">Random</option>
                                        ${
                                            (STATES?.ACTIVE_PRIZE?.defined_winners[i]) ? `
                                                <option value="${STATES?.ACTIVE_PRIZE?.defined_winners[i]?.id}" selected>${STATES?.ACTIVE_PRIZE?.defined_winners[i]?.name}</option>`
                                            : ''
                                        }
                                        ${ getAvailableParticipants().map((p) => `<option value="${p?.id}">${p?.name}</option>`).join('') }
                                    </select>
                                </div>
                            `).join('') : ''
                        } 
                    </div>
                    <div class="flex px-2 py-3"> 
                        <a onclick="${f}saveDefineWinners()" class="px-5 py-2.5 relative rounded group font-medium font-medium inline-block cursor-pointer bg-green-800 hover:bg-green-600 text-white ml-2">
                            <span class="relative">Simpan</span>
                        </a>    
                    </div>
                </div>
            </div>
        </div>
        
    `)
}