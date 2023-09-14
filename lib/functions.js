const { stringify } = JSON

const updateTitle = (title = "Lucky Draw") => STATES.TITLE[0].textContent = title

const getAvailableParticipants = () => {

    const available = []

    STATES.GAME.participants?.forEach(p => {
        if (!p?.defined_prize && p?.available && !STATES?.STAGE_WINNER?.some(w => (w?.winner_id == p?.id))) {
            available.push(p)
        }
    });

    return available.sort((a, b) => a?.name?.localeCompare(b?.name))
}

const generateRandomChar = ({ text = true, number = true, length = 6 }) => {

    const TEXT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const NUM = "0123456789";
    
    let POSSIBLE = ""
    let res = ""
    
    if (text) POSSIBLE += TEXT
    if (number) POSSIBLE += NUM

    for (let i = 0; i < length; i++) res += POSSIBLE?.[Math.floor(Math.random() * POSSIBLE.length)];

    return res
}

const sortPlayer = (data = []) => {

    const available = [];
    const winners = [];
    const fall = [];

    if (data?.length > 0) data?.map(item => {
        
        if (item?.available) available.push(item)
        else {
            if (STATES.GAME?.winners?.some(itm => itm?.winner_id == item?.id)) winners.push(item)
            else fall.push(item)
        }
    })

    return [...available.sort((a, b) => a?.name?.localeCompare(b?.name)), ...winners.sort((a, b) => a?.name?.localeCompare(b?.name)), ...fall.sort((a, b) => a?.name?.localeCompare(b?.name))]
}

const getRandomRangeNumber = (max = 0) => Math.floor(Math.max(0, Math.random() * max))

const handlerChangeStorageMain = (e) => {

    const data = JSON.parse(e?.newValue)
    
    switch (e.key) {
        
        case 'spin-screen':
            STATES.SPIN_SCREEN = !(!data)
            break;
    
        default:
            break;
    }
}