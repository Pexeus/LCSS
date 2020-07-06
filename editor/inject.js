//imports
fs = require("fs");
const { ipcRenderer } = require("electron");
var path = require("path");
const remote = require("electron").remote;

appPath = remote.app.getAppPath();

currentCSS = "";

config = ipcRenderer.sendSync("requestConfig", "");

checklist = "_";

liveDir = appPath + "/data/live/";
css = "";

scrollbarFix = "\n\n::-webkit-scrollbar {display:none;}\n\n";

lastUpdate = "";

cooldownStatus = false;

//livedir watch
fs.watch(liveDir, (eventType, filename) => {
    getFiles();
});

//user workspace watch
fs.watch(config.directory, (eventType, file) => {
    if (path.extname(file) !== ".css") {
        console.log("Change at " + file + " Reloading...");
        location.reload();
    }
});

//status von preview aktualisieren und an main senden
function updateStatus(value) {
    if (value != lastUpdate) {
        ipcRenderer.sendSync("previewStatus", value);
        lastUpdate = value;
    }
}

//alle files aus /live abrufen
function getFiles() {
    fs.readdir(liveDir, (err, files) => {
        css = "";
        removeLinks(files);
        files.forEach((file) => {
            if (checklist.toLowerCase().includes(file.toLowerCase())) {
                createCSS(file);
            }
        });

        updateCSS();
    });
}

//alle css links die raus müssen entfernen
function removeLinks(sources) {
    links = document.querySelectorAll("link");
    imports = getImports();

    sources.forEach((source) => {
        links.forEach((link) => {
            href = String(link.href.toLowerCase());
            if (href.includes(source.toLowerCase())) {
                console.log("match: " + href + "[link]");
                checklist += href;
                remove(link);
            }
        });

        for (i = 0; i < imports.length; i++) {
            if (
                imports[i].innerHTML
                    .toLowerCase()
                    .includes(source.toLowerCase())
            ) {
                importTag = extractCSSImport(imports[i].innerHTML, source);
                console.log(extractCSSImport(imports[i].innerHTML, source));

                console.log("match: " + importTag + " [Import]");
                checklist += importTag;
                remove(imports[i]);
            }
        }
    });
    updateStatus(checklist);
}

//@import entfernen oder so
function extractCSSImport(css, file) {
    string = String(css);
    lines = string.split("\n");

    result = "";

    lines.forEach((line) => {
        if (line.toLowerCase().includes(file.toLowerCase())) {
            result += line;
        }
    });

    return result;
}

function getImports() {
    inlineTags = document.getElementsByTagName("style");

    return inlineTags;
}

//element entfernen
function remove(element) {
    element.parentNode.removeChild(element);
}

//string für inline css erstellen
function createCSS(file) {
    data = fs.readFileSync(liveDir + file, "utf8");
    css += data + scrollbarFix;
}

//CSS aktualisieren
function updateCSS() {
    if (css != "" && css != currentCSS) {
        console.log("pushing: \n" + css);

        if (document.getElementById("dynamicCSS") != null) {
            style = document.getElementById("dynamicCSS");

            style.innerHTML = css;
            currentCSS = css;
        } else {
            style = document.createElement("style");
            style.id = "dynamicCSS";
            style.innerHTML = css;

            document.querySelectorAll("head")[0].appendChild(style);
        }
    } else {
        console.log("not Pushing: " + css);
    }
}

function insertTools() {
    var elements = document.body.getElementsByTagName("*");

    for (i = 0; i < elements.length; i++) {
        if (elements[i].onclick == null) {
            elements[i].onclick = function () {
                if (cooldownStatus == false) {
                    sendElement(event.target);

                    coolDown();
                }
            };
        }
    }
}

function coolDown() {
    cooldownStatus = true;

    setTimeout(function () {
        cooldownStatus = false;
    }, 100);
}

//ziel an den main prozess schicken
function sendElement(element) {
    dispatch = targetElement(element);

    console.log(dispatch);

    ipcRenderer.sendSync("requestProprity", dispatch);
}

//möglichkeit finden die property zu targetten (id usw) [-->BRUH CLASS GITS OH<--]
function targetElement(e) {
    retry = true;
    tries = 0;
    target = "";

    while (retry == true) {
        tries += 1;
        if (e.tagName == "body") {
            target = e.tagName + " " + target;

            retry = false;
        }
        if (e.className != "") {
            target = e.className + " " + target;

            retry = false;
        } else if (e.id != "") {
            target = e.id + " " + target;

            retry = false;
        } else {
            if (e.tagName != undefined) {
                target = e.tagName.toLowerCase() + " " + target;
            }
            tries += 1;

            e = e.parentNode;
        }
        if (tries > 4) {
            retry = false;
        }
    }

    return target.slice(0, target.length - 1);
}

//experimentelle funktion
function targetElement2(clicked) {
    dataset = currentCSS;

    tries = 0;
    target = clicked;
    childs = "";

    while (tries < 5) {
        if (dataset.includes(target.id)) {
            return target.id + childs;
        } else if (dataset.includes(target.className)) {
            return target.className + childs;
        } else {
            childs += target.tagName;
            target = target.parentNode;
        }

        console.log("tries: " + tries + "| target: " + target);
        tries += 1;
    }
}

setTimeout(function () {
  getFiles()
  insertTools()
}, 50)

console.log("LiveCSS connected!")
