"use strict";

const remote = require("electron").remote;

const CONFIG = require("./helpers/config");

const clearDir = require("./helpers/clear");
const { toggleSetup, displayProjects, getList } = require("./helpers/projects");
const displaySandbox = require("./helpers/sandbox");
const { saveProject, addList } = require("./helpers/projects");
const { ipcRenderer } = require("electron");

const jsClose = document.getElementById("close");
const jsShowProjects = document.getElementById("showProjects");
const jsNewProjects = document.getElementById("showSelection");
const jsLaunchProjects = document.getElementById("launchProject");

const initSetup = () => {
    jsClose.addEventListener("click", () => {
        remote.getCurrentWindow().close();
    });
    jsShowProjects.addEventListener("click", toggleSetup);
    jsNewProjects.addEventListener("click", toggleSetup);
    jsLaunchProjects.addEventListener("click", validateInput);

    clearDir(CONFIG.REMOTE_APP + CONFIG.DATA_PATH);
    displayProjects(getList());
    displaySandbox();
};

function getDirectory() {
    return ipcRenderer.sendSync("requestPath", "");
}

function validateInput() {
    let urlInputVal = document.getElementById("urlInput").value;
    const files = document.getElementById("direcoryInput").files;

    if (files.length > 0) {
        const dir = files[0].path.replace(files[0].name, "");

        if (urlInputVal !== "") {
            urlInputVal = urlInputVal.replace(/ /g, "%20");
            console.log("Path: " + dir + " | URL: " + urlInputVal);

            saveProject();
            createEditor(dir, urlInputVal);
        } else {
            urlInputVal = "file:///" + dir + determineStart(files);

            urlInputVal = urlInputVal.replace(/ /g, "%20");

            addList(dir, urlInputVal);
            createEditor(dir, urlInputVal);
        }
    } else {
        showError("Set a Project Directory");
    }
}

function determineStart(files) {
    console.log(files);
    let value = "";

    for (let i = 0; i < files.length; i++) {
        if (files[i].name.includes("index")) {
            value = files[i].name;

            return value;
        }
    }

    for (let i = 0; i < files.length; i++) {
        if (files[i].name.includes(".php") || files[i].name.includes(".html")) {
            value = files[i].name;
        }
    }

    return value;
}

function showError(msg) {
    document.getElementById("errorDisplay").innerHTML = msg;
}

function createEditor(dir, url) {
    const editorConfig = { url: url, directory: dir };

    clearDir(CONFIG.REMOTE_APP + CONFIG.DATA_PATH);
    ipcRenderer.sendSync("createEditor", editorConfig);
}

initSetup();
