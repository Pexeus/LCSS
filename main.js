const {ipcMain, dialog, app, BrowserWindow} = require("electron")

editorConfig = {directory: "", url: ""}

function createSetup() {
    //fenster definieren
    setupWindow = new BrowserWindow({
        width: 280,
        height: 350,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration : true
        }
    })

    //html laden
    setupWindow.loadFile("./setup/index.html")

    //devtools
    setupWindow.webContents.openDevTools({mode:'undocked'})
}

function createEditor() {
    const editorWindow = new BrowserWindow({
        width: 900,
        height: 900,
        minHeight: 600,
        minWidth: 600,
        frame: false,
        hasShadow: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    })

    editorWindow.loadFile("./editor/index.html")

    editorWindow.webContents.openDevTools()

    setupWindow.close()

    //status vom preview empfangen und an editor senden
    ipcMain.on('previewStatus', (event, filesList) => {
        console.log("Current Files:")
        console.log(filesList)
        event.returnValue = "OK"

        editorWindow.webContents.send('currentlyLoaded', filesList);
    })

    //ziel von angeklicktem element vom preview empfangen und an das menu senden
    ipcMain.on('requestProprity', (event, target) => {
        console.log("Recieved Target: ")
        console.log(target)
        event.returnValue = "OK"

        editorWindow.webContents.send('setView', target);
    })
}

app.whenReady().then(createSetup)
app.allowRendererProcessReuse = false;

//konfiguration vom editor zurücksenden
ipcMain.on('requestConfig', (event, arg) => {
    event.returnValue = editorConfig
})

//editor erstellen
ipcMain.on('createEditor', (event, data) => {
    event.returnValue = ""
    editorConfig = data

    createEditor()
})