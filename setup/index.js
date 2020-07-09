const remote = require("electron").remote;
const clearDir = require("./helpers/clear");
const { toggleSetup, displayProjects, getList } = require("./helpers/projects");
const displaySandbox = require("./helpers/sandbox");
const { validateInput } = require("./helpers/getSources");

const DATA_PATH = "/data/live";

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

    clearDir(remote.app.getAppPath() + DATA_PATH);
    displayProjects(getList());
    displaySandbox();
    // console.log(remote)
};

initSetup();
