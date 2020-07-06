const rimraf = require("rimraf");

config = ipcRenderer.sendSync("requestConfig", "");
liveDir = appPath + "/data/live";

//
var path = require("path");
const openExplorer = require("open-file-explorer");
const { exec } = require("child_process");
//

function setURL(config) {
    preview = document.getElementById("preview");
    preview.innerHTML =
        "<webview src=" +
        config.url +
        " preload=inject.js id=previewWindow allowpopups/>";
}

function devTools() {
    webview = document.getElementById("previewWindow");

    webview.openDevTools();
}

function quickAccess(file) {
    if (path.extname(file) == ".html" || path.extname(file) == ".php") {
        //console.log("Adding to quickbar: " + file)

        container = document.getElementById("filesList");
        button = insertQAButton(file);

        container.appendChild(button);
    }
}

//Buttons für den wechsel zwischen den files (im head)
function insertQAButton(file) {
    btn = document.createElement("button");
    btn.innerHTML = file;
    btn.id = "fileSelector";

    if (config.url.includes(file) || file.includes("index")) {
        QASetActive(btn);
    }

    btn.onclick = function () {
        if (config.url.includes(".html")) {
            console.log(config.url.replace(/^.*[\\\/]/, ""));

            file = config.url.replace(/^.*[\\\/]/, "");
            url = config.url.replace(file, "");
        }
        url = url + event.target.innerHTML;

        newConf = { url: url, directory: config.directory };
        console.log(newConf);
        setURL(newConf);

        QASetActive(event.target);
    };

    return btn;
}

function QASetActive(btn) {
    files = document.getElementById("filesList").childNodes;

    for (var i = 0; i < files.length; i++) {
        if (files[i].id == "fileSelector") {
            files[i].classList.remove("activeButton");
        }
    }

    btn.classList.add("activeButton");
}

//Projektverzeichnis im file expolorer öffnen
function openWorkspace(config) {
    options = JSON.parse(
        fs.readFileSync(appPath + "/data/config/options.txt", "utf-8"),
    );

    if (options.openDirectory == true) {
        openExplorer(config.directory, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

//vscode öffnen
function openCode(config) {
    options = JSON.parse(
        fs.readFileSync(appPath + "/data/config/options.txt", "utf-8"),
    );

    if (options.openCode == true) {
        executeCommand("code " + config.directory);
    }
}

//command ausführen
function executeCommand(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
}

openWorkspace(config);
openCode(config);
setURL(config);
