const { ipcRenderer } = require('electron')
const remote = require('electron').remote;

path = ""
url = ""

function getDirectory() {
    path = ipcRenderer.sendSync('requestPath', '')

    console.log(path)
}

function validateInput() {
    url = document.getElementById("urlnput").value
    files = document.getElementById("direcoryInput").files

    if (files.length > 0) {
        dir = files[0].path.replace(files[0].name, "")

        if (url != "") {
            url = url.replace(/ /g, "%20")
            console.log("Path: " + dir + " | URL: " + url)

            saveProject()
            createEditor(dir, url)
        }
        else {
            url = 'file:///' + files[0].path

            url = url.replace(/ /g, "%20")

            addList(dir, url)
            createEditor(dir, url)
        }

        
    }
    else {
        showError("Set a Project Directory")
    }
}

function determineStart(files) {
    value = ""

    for (i = 0; i < files.length; i++) {
        if (files[i].name.includes("index")) {
            value = files[i].name
        }
    }

    if (value == "") {
        for (i = 0; i < files.length; i++) {
            if (files[i].name.includes(".php") || files[i].name.includes(".html")) {
                value = files[i].name
            }
        }
    }

    return value
}

function showError(msg) {
    document.getElementById("errorDisplay").innerHTML = msg
}

function createEditor(dir, url) {
    clearDir(remote.app.getAppPath() + "/data/live/")

    editorConfig = {url: url, directory: dir}
    console.log(editorConfig)
    ipcRenderer.sendSync('createEditor', editorConfig)
}

function closeSetup() {
    var window = remote.getCurrentWindow();
    window.close();
}
