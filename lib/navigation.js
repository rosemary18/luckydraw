const Navigate = (screen = "WELCOME") => {

    switch (screen) {
        case "WELCOME":
            WelcomeScreen()
            break;
        case "FORM":
            FormScreen()
            break;
        case "DASHBOARD":
            DashboardScreen()
            break;
        default:
            alert('[SYSTEM]: Screen Not Found ...')
            console.log("Screen not found ...")
    }
}