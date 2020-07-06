const cssToObject = require("css-to-object");

//aktualisierungsintervall
delay = "inactive";

//konfiguration anfordern
config = ipcRenderer.sendSync("requestConfig", "");

//im preview geladene files anfordern
ipcRenderer.on("currentlyLoaded", function (event, data) {
    //console.log("Dedected Files: " + data);
    filesChecklist = data;
    buildMenu();
});

//beim empfangen von einem neuen primären ziel (Fokus vom menu fesztlegen)
ipcRenderer.on("setView", function (event, target) {
    console.log("New Focus: " + target);

    setFocus(target);
});

//checklist für alle files die geladen wrden müssen (previev sendet das)
filesChecklist = "";

//CSS datenobjekt, Anfbau: [file][ziel][eigenschaft]
data = [];

//zeilen die der parser nicht verarbeiten kann (z.b. @import)
extracted = {};

//Verzeichnis zum zwischenspeichern der daten
liveDir = appPath + "/data/live";

console.log(
    "Loading menu with URL: " + config.url + " Direcory: " + config.directory,
);

function setFocus(target) {
    block = getBlock(target);

    if (block != undefined) {
        //console.log("scrolling to: ")
        //console.log(block)
        block.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center",
        });
    }
}

function getBlock(target) {
    files = document.getElementById("editors").childNodes;

    for (i = 0; i < files.length; i++) {
        blocks = files[i].childNodes;
        for (l = 1; l < blocks.length; l++) {
            if (blocks[l].id.includes(target)) {
                return blocks[l];
            }
        }
    }
}

//beim start alles laden
function buildMenu() {
    console.log("rebuilding menu");

    files = fs.readdirSync(config.directory);

    resetFileStatus();

    //console.log("files: " + files)
    files.forEach((file) => {
        getObject(file);
    });
}

//css objekt erstellen
function getObject(file) {
    if (fs.existsSync(config.directory + file)) {
        if (path.extname(file) == ".css") {
            block = path.parse(file).name;
            content = fs.readFileSync(config.directory + file, "utf8");

            content = fixFileContent(content, file);

            try {
                data[file] = cssToObject(content);
                //file als voll funktionsfähig vermerken
                addFileStatus(file, "operational");
                //editor clear
                document.getElementById("editors").innerHTML = "";
            } catch (error) {
                console.log("Cant parse " + file + ", skipping...");
                addFileStatus(file, "live");
            }

            if (data[file] != undefined) {
                updateFile(file, data);
                //console.log(data)

                files = Object.keys(data);

                //Durch alle files loopen
                files.forEach((entry) => {
                    //console.log(entry + " // " + filesChecklist)

                    //filecontainer erstellen

                    if (
                        filesChecklist
                            .toLowerCase()
                            .includes(entry.toLowerCase())
                    ) {
                        fileContainer = createElement("div", entry);
                        fileContainer.className = "fileContainer";

                        fileName = createElement("h2", "fileContainerName");
                        fileName.innerHTML = entry;

                        fileContainer.appendChild(fileName);

                        document
                            .getElementById("editors")
                            .appendChild(fileContainer);

                        loopTargets(entry, data[entry], fileContainer);
                    }
                });
            }
        }
    } else {
        console.log("File not Found: " + file);
    }
}

function fixFileContent(content, file) {
    lines = content.split("\n");
    fixed = "";
    hits = [];

    lines.forEach((line) => {
        if (line.toLowerCase().includes("@import")) {
            hits.push(line);
        } else {
            fixed += line + "\n";
        }
    });

    extracted[file] = hits;
    return fixed;
}

//durch alle ziele loopen
function loopTargets(file, data, container) {
    targets = Object.keys(data);

    targets.forEach((target) => {
        if (target.includes("@media") == false) {
            //box erstellem und einfügen
            box = createBox(target, container);

            //metadaten einfügen
            insertMeta(box, file);

            //menu in die box einfügen
            getProperties(data[target], box);

            //console.log(box)
        } else {
            //console.log("Found Dynamic CSS: ")
            //console.log(data[target])

            scopeContainer = createScope(target, container);
            scopeContainer.classList.add("scopeContainer");
            loopTargets(file, data[target], scopeContainer);

            container.appendChild(scopeContainer);
        }
    });
}

//metadaten ins UI schreiben
function insertMeta(target, file) {
    text = createElement("p", "JS_DATA");
    text.innerHTML = file;
    text.style.display = "none";

    target.insertBefore(text, target.childNodes[0]);
}

//durch alle eigenschaften loopen
function getProperties(data, target) {
    properties = Object.keys(data);

    properties.forEach((property) => {
        value = data[property];
        createInterface(target, property, value);
    });
}

//Dataset zum aktualisieren des CSS objekts erstellen
function createDataset(input, property) {
    file = input.parentNode.parentNode.parentNode.childNodes[0].innerHTML;

    scope = getScope(input);

    //mit scope einfügen
    if (scope != undefined) {
        target = input.parentNode.parentNode.parentNode.childNodes[1].innerHTML;
        elements = input.parentNode.parentNode.childNodes;
        set = "";

        elements.forEach((element) => {
            value = getValues(element);

            if (value != false) {
                set += " " + value;
            }
        });

        set = set.substr(1);

        console.log(
            "file: " +
                file +
                "\n" +
                "scope: " +
                scope +
                "\n" +
                "target: " +
                target +
                "\n" +
                "property: " +
                property +
                "\n" +
                "value: " +
                set +
                "\n",
        );
        updateObjectScope(file, scope, target, property, set);
    }
    //ohne scope einfügen
    else {
        target = input.parentNode.parentNode.parentNode.childNodes[1].innerHTML;

        elements = input.parentNode.parentNode.childNodes;
        set = "";

        elements.forEach((element) => {
            value = getValues(element);

            if (value != false) {
                set += " " + value;
            }
        });

        set = set.substr(1);

        console.log(
            "file: " +
                file +
                "\n" +
                "target: " +
                target +
                "\n" +
                "property: " +
                property +
                "\n" +
                "value: " +
                set +
                "\n",
        );
        updateObject(file, target, property, set);
    }
}

function getScope(e) {
    if (
        e.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerHTML.includes(
            "@",
        )
    ) {
        scope =
            e.parentNode.parentNode.parentNode.parentNode.childNodes[0]
                .innerHTML;
    } else {
        return undefined;
    }

    return scope;
}

//werte aus den verschiedenen UI elementen auslesen
function getValues(element) {
    if (element.id == "sliderBox") {
        return (
            element.childNodes[1].childNodes[0].value +
            element.childNodes[1].childNodes[1].selectedOptions[0].text
        );
    } else if (element.id == "universalInput") {
        return element.childNodes[0].value;
    } else if (element.id == "pickerContainer") {
        return element.childNodes[0].style.backgroundColor;
    } else if (element.id == "dropdownBox") {
        return element.childNodes[0].value;
    } else {
        return false;
    }
}

//css objekt mit dataset aktualisieren
function updateObject(file, target, property, value) {
    data[file][target][property] = value;

    updateFile(file, data);
}

//css objekt mit dataset aktualisieren (in scope)
function updateObjectScope(file, scope, target, property, value) {
    data[file][scope][target][property] = value;

    updateFile(file, data);
}

//css objekt in ein file in /live schreiben
function updateFile(file, data) {
    dataString = parseCSS(data[file], insertExtracted(file));
    target = liveDir + "/" + file;

    fs.writeFileSync(target, dataString);
}

function insertExtracted(file) {
    extractedLines = extracted[file];

    result = "";

    extractedLines.forEach((line) => {
        result += line + "\n\n";
    });

    return result;
}
