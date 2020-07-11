"use strict";

const remote = require("electron").remote;

const CONFIG = require("./helpers/config");

const clearDir = require("./helpers/clear");
const {
    toggleSetup,
    displayProjects,
    getList,
    addList,
} = require("./helpers/projects");
const displaySandbox = require("./helpers/sandbox");
const { validateInput } = require("./helpers/getSources");

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

initSetup();
