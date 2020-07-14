"use strict";

const { ipcRenderer } = require("electron");
const CONFIG = require("./config");
const clearDir = require("./clear");
const { saveProject, addList } = require("./projects");

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

module.exports = {
    getDirectory,
    validateInput,
    determineStart,
    showError,
    createEditor,
};
