class ScreenSection {

    constructor(state) {

        this.state = typeof state == "object" ? state : {}
        
        if (STATES.ACTIVE_SCREEN && this.id != STATES.ACTIVE_SCREEN?.id) STATES.ACTIVE_SCREEN?.didUnmount?.()
        STATES.ACTIVE_SCREEN = this
    }

    id = generateRandomChar({length: 10})
    generate = () => ""
    state = {
        
    }

    didMount = () => null

    didUnmount = () => null

    setState = (state, reload = true) => {

        if (typeof state == "function") {
            this.state = { ...this.state, ...state(this.state) } 
        } else {
            const _state = typeof state == "object" ? state : {}
            this.state = { ...this.state, ..._state }
        }

        if (reload) this.render(this.generate)
    }

    render(generate = () => "") {
        
        while (STATES.ROOT.hasChildNodes()) root.removeChild(STATES.ROOT.firstChild)
        this?.didMount?.()
        STATES.ROOT.innerHTML = generate?.(this)
        this.generate = generate
    }
    
    refresh = () => (this.generate) && this.render(this.generate)
}