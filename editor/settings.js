config = ipcRenderer.sendSync('requestConfig', '')
const { shell } = require('electron')

//settings ein/ausblenden
function toggleSettings() {
    win = document.getElementById("windowManager")

    if (win.style.display == "block") {
        if(event.target.id == "windowManager" || event.target.id == "headButton") {
            console.log("Settings: Closed")
            win.style.display = "none"
        }
    }
    else{
        console.log("Settings: Open")
        win.style.display = "block"
    }
}

//files in settings mit status anzeigen
function addFileStatus(file, type) {
    if (document.getElementById("Status" + file) != undefined) {
        console.log("removing: " + file)
        document.getElementById("Status" + file).remove()
    }

    console.log("updating: " + file + " type: " + type)

    target = document.getElementById("fileStatusContainer")

    container = createElement("div", "Status" + file)

    icon = createElement("img", "fileIcon")
    icon.src = "../data/img/css.png"

    fileName = createElement("p", "fileName")
    fileName.innerHTML = file

    if (type == "operational") {
        container.classList.add("StatusContainer_operational")
    }
    if (type == "live") {
        container.classList.add("StatusContainer_live")
    }

    container.appendChild(icon)
    container.appendChild(fileName)
    target.appendChild(container)
}

//files container leeren
function resetFileStatus() {
    document.getElementById("fileStatusContainer").innerHTML = ""
}

//projekt url/path anzeigen
function setProjectStatus() {
    container = document.getElementById("projectStatusContainer")

    url = createElement("p", "URLStatus")
    dir = createElement("p", "PathStatus")

    url.innerHTML = "URL: " + config.url
    dir.innerHTML = "Workspace: " + config.directory

    container.appendChild(url)
    container.appendChild(dir)
}

//standard optionen-objekt erstellen
function defaultOptions() {
    options = {
        menuPosition: "right",
        menuMode: "default",
        devTools: false,
        openDirectory: false,
        openCode: true
    }

    updateOptions(options)
}

//optionen permanent speichern
function updateOptions(options) {
    fs.writeFileSync("./data/config/options.txt", JSON.stringify(options))

    loadOptions()
    executeOptions()
}

//optionen abrufen
function getOptions() {
    string = fs.readFileSync("./data/config/options.txt", "utf-8")

    return JSON.parse(string)
}

//optionen mit den daten aus dem UI updaten
function setOptions() {
    currentOptions = getOptions()

    //editor stuff
    currentOptions.menuPosition = document.getElementsByClassName("config_ePos")[0].value.toLowerCase()
    currentOptions.menuMode = document.getElementsByClassName("config_eSize")[0].value.toLowerCase()

    //devTools anzeigen ja/ne
    if (document.getElementsByClassName("config_pDevTools")[0].value == "Show per Default") {
        currentOptions.devTools = true
    }
    else {
        currentOptions.devTools = false
    }

    //explorer öffnen ja/ne
    if (document.getElementsByClassName("config_sExplorer")[0].value == "Yes") {
        currentOptions.openDirectory = true
    }
    else {
        currentOptions.openDirectory = false
    }

    //code öffnen ja/ne
    if (document.getElementsByClassName("config_sCode")[0].value == "Yes") {
        currentOptions.openCode = true
    }
    else {
        currentOptions.openCode = false
    }

    console.log(currentOptions)

    updateOptions(currentOptions)
}

//UI mit abgespiecherten optionen abgleichen
function loadOptions() {
    currentOptions = getOptions()

    ePos = document.getElementsByClassName("config_ePos")[0]
    eSize = document.getElementsByClassName("config_eSize")[0]
    pDevTools = document.getElementsByClassName("config_pDevTools")[0]
    sExplorer = document.getElementsByClassName("config_sExplorer")[0]
    sCode = document.getElementsByClassName("config_sCode")[0]

    //Menu position
    if(currentOptions.menuPosition == "left") {
        ePos.options[1].selected = "selected"
    }
    else {
        ePos.options[0].selected = "selected"
    }

    //Menu mode
    for(i = 0; i < eSize.options.length; i++) {
        if (eSize.options[i].innerHTML.toLowerCase() == currentOptions.menuMode) {
            eSize.options[i].selected = "selected"
        }
    }

    //devtools
    if(currentOptions.devTools == false) {
        pDevTools.options[1].selected = "selected"
    }
    else {
        pDevTools.options[0].selected = "selected"
    }

    //explorer
    if(currentOptions.openDirectory == false) {
        sExplorer.options[1].selected = "selected"
    }
    else {
        pDevTools.options[0].selected = "selected"
    }

    //code
    //explorer
    if(currentOptions.openCode == false) {
        sCode.options[1].selected = "selected"
    }
    else {
        sCode.options[0].selected = "selected"
    }
}

function executeOptions() {
    currentOptions = getOptions()

    editor = document.getElementById("menu")
    preview = document.getElementById("preview")

    //menu position
    if (currentOptions.menuPosition == "left") {
        //neu
        preview.style.right = 0
        editor.style.left = 0

        //old
        editor.style.right = ""
        preview.style.left = ""
    }
    else {
        //neu
        editor.style.right = 0
        preview.style.left = 0

        //old
        preview.style.right = ""
        editor.style.left = ""
    }

    //menu grösse
    if (currentOptions.menuMode == "normal") {
        menu.style.width = "300px"
        preview.style.width = "calc(100% - 300px)"
    }
    if (currentOptions.menuMode == "large") {
        menu.style.width = "50%"
        preview.style.width = "50%"
    }
    if (currentOptions.menuMode == "hidden") {
        menu.style.width = "0px"
        preview.style.width = "100%"
    }

    //devtools
    if (currentOptions.devTools == true) {
        setTimeout( function() {
            devTools()
        }, 200)
    }
}

//sandbox auf vorlage zurücksetzen
function resetSandbox() {
    clearDir("./data/sandbox")

    ncp("./data/sandboxTemplate", "./data/sandbox", function (err) {
        if (err) {
        console.log(err)
        }
        console.log(file + " [COPY] " + live);
    });

    console.log("Resetted Sandbox")

    location.reload()
}

//verzeichnis leeren
function clearDir(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        console.log("clearing: " + directory)
        for (const file of files) {
            console.log("removing: " + file)
            fs.unlink(pathModule.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}

//sandbox template öffnen
function showSandboxTemplate() {
    template = path.join(__dirname, "..", "\\data\\sandboxTemplate")

    openExplorer(template, err => {
        if(err) {
            console.log(err);
        }
    });
}

function openLink() {
    if (event.target.tagName != "div") {
        url = event.target.parentElement.id
    }
    else {
        url = event.target.id
    }

    console.log(url)


    shell.openExternal(url)
}

//Startup calls
loadOptions()
executeOptions()
setProjectStatus()