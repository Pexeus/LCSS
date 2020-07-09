"use strict";

const fs = require("fs");
const { showError, createEditor } = require("./getSources");
const CONFIG = require("./config");

function saveProject() {
    const urlInputVal = document.getElementById("urlInput").value;
    const files = document.getElementById("direcoryInput").files;

    if (files !== undefined && urlInputVal !== undefined) {
        const path = files[0].path.replace(files[0].name, "");

        addList(path, url);
    } else {
        showError("Set Path and URL");
    }
}

// Projekt zur projektliste hinzufügen
function addList(path, url) {
    const project = { path: path, url: url };

    console.log(project);

    console.log(JSON.stringify(list));
    console.log(project.url);

    if (JSON.stringify(list).includes(project.path) === false) {
        list.push(project);
    } else {
        console.log("double");
    }

    updateList(getList());
}

// projektliste aktualisieren
function updateList(list) {
    fs.writeFileSync(
        CONFIG.REMOTE_APP + CONFIG.DATA_PROJECTS,
        JSON.stringify(list),
    );
}

// projektliste abrufen
function getList() {
    let list = fs.readFileSync(
        CONFIG.REMOTE_APP + CONFIG.DATA_PROJECTS,
        "utf-8",
    );

    if (list === "") {
        // toggleSetup() wegen sandbox
        list = [];
    } else {
        list = JSON.parse(list);
    }

    if (list.length > 3) {
        list.shift();
    }

    return list;
}

// projekte anzeigen
function displayProjects(projects) {
    const container = document.getElementById("projects");

    projects.forEach((project) => {
        const selector = projectBox(project);

        container.appendChild(selector);
    });
}

function projectBox(config) {
    const box = document.createElement("div");
    const previewText = document.createElement("p");
    const urlText = document.createElement("p");
    const pathText = document.createElement("p");
    const folders = config.path.split("\\");

    box.id = "projectSelector";
    previewText.innerHTML = folders[folders.length - 2];

    urlText.innerHTML = config.url;
    pathText.innerHTML = config.path;

    previewText.id = "pPreview";
    urlText.id = "pURL";
    pathText.id = "pPath";

    box.appendChild(previewText);
    box.appendChild(urlText);
    box.appendChild(pathText);

    box.addEventListener("click", function () {
        const pURL = document.getElementById("pURL").innerHTML;
        const pPath = document.getElementById("pPath").innerHTML;
        let target = event.target;

        if (target.tagName != "div") {
            target = target.parentElement;
        }

        console.log(pURL, pPath);
        createEditor(pPath, pURL);
    });

    // sandbox hervorheben
    console.log(config.path);
    if (config.path.includes("sandbox")) {
    }

    return box;
}

function toggleSetup() {
    if (document.getElementById("showSelection").style.display != "none") {
        document.getElementById("selection").style.display = "inline-block";
        document.getElementById("under").style.display = "block";
        document.getElementById("showProjects").style.display = "inline-block";

        document.getElementById("showSelection").style.display = "none";
        document.getElementById("projects").style.display = "none";
        document.getElementById("titleWindow").innerHTML =
            "LCSS - Create new project";
        document.getElementById("modeHeader").innerHTML = "New Project";
    } else {
        document.getElementById("selection").style.display = "none";
        document.getElementById("under").style.display = "none";

        document.getElementById("showSelection").style.display = "inline-block";
        document.getElementById("projects").style.display = "inline-block";
        document.getElementById("showProjects").style.display = "none";
        document.getElementById("titleWindow").innerHTML = "LCSS";
        document.getElementById("modeHeader").innerHTML = "Open Project";
    }
}

module.exports = {
    saveProject,
    addList,
    updateList,
    getList,
    displayProjects,
    projectBox,
    toggleSetup,
};
