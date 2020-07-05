const fs = require("fs")

function saveProject() {
    url = document.getElementById("urlnput").value
    files = document.getElementById("direcoryInput").files

    if (files != undefined && url != undefined) {
        path = files[0].path.replace(files[0].name, "")

        addList(path, url)
    }
    else {
        showError("Set Path and URL")
    }
}

//Projekt zur projektliste hinzufügen
function addList(path, url) {
    list = getList()
    project = {path: path, url: url}

    console.log(project)

    console.log(JSON.stringify(list))
    console.log(project.url)

    if (JSON.stringify(list).includes(project.path) == false) {
        list.push(project)
    }
    else {
        console.log("double")
    }

    updateList(list)
}

//projektliste aktualisieren
function updateList(list) {
    fs.writeFileSync(remote.app.getAppPath() + "/data/config/projects.txt", JSON.stringify(list))
}

//projektliste abrufen
function getList() {
    list = fs.readFileSync(remote.app.getAppPath() + "/data/config/projects.txt", "utf-8")

    if (list == "") {
        //toggleSetup() wegen sandbox
        list = []
    }
    else {
        list = JSON.parse(list)
    }

    if (list.length > 3) {
        list.shift()
    }

    return list
}

//projekte anzeigen
function displayProjects(projects) {
    container = document.getElementById("projects")

    projects.forEach(project => {
        selector = projectBox(project)

        container.appendChild(selector)
    });
}

function projectBox(config) {
    box = document.createElement("div")
    box.id = "projectSelector"
    previewText = document.createElement("p")
    urlText = document.createElement("p")
    pathText = document.createElement("p")

    folders = config.path.split("\\")
    previewText.innerHTML = folders[folders.length - 2]

    urlText.innerHTML = config.url
    pathText.innerHTML = config.path

    previewText.id = "pPreview"
    urlText.id = "pURL"
    pathText.id = "pPath"

    box.appendChild(previewText)
    box.appendChild(urlText)
    box.appendChild(pathText)

    box.addEventListener("click", function () {

        target = event.target

        if (target.tagName != "div") {
            target = target.parentElement
        }

        console.log(target)

        pURL = target.getElementsByTagName("p")[1].innerText
        pPath = target.getElementsByTagName("p")[2].innerText

        console.log(pURL, pPath)
        createEditor(pPath, pURL)
    })

    //sandbox hervorheben
    console.log(config.path)
    if (config.path.includes("sandbox")) {
        
    }

    return box
}

function toggleSetup() {
    if (document.getElementById("showSelection").style.display != "none") {
        document.getElementById("selection").style.display = "inline-block"
        document.getElementById("under").style.display = "block"
        document.getElementById("showProjects").style.display = "inline-block"

        document.getElementById("showSelection").style.display = "none"
        document.getElementById("projects").style.display = "none"
        document.getElementById("modeHeader").innerHTML = "New Project"
    }
    else {
        document.getElementById("selection").style.display = "none"
        document.getElementById("under").style.display = "none"

        document.getElementById("showSelection").style.display = "inline-block"
        document.getElementById("projects").style.display = "inline-block"
        document.getElementById("showProjects").style.display = "none"
        document.getElementById("modeHeader").innerHTML = "Open Project"
    }
}

document.getElementById("close").addEventListener("click", function (e) {
    var window = remote.getCurrentWindow();
    window.close();
});

displayProjects(getList())