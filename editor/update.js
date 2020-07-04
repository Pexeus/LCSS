const { ipcRenderer } = require('electron')
const ncp = require('ncp').ncp
var path = require('path')
const chokidar = require('chokidar');
const fs  = require("fs")

config = ipcRenderer.sendSync('requestConfig', '')


//bei änderung menu rebuilden
fs.watch(config.directory, (eventType, file) => {
    console.log("Change in workspace: " + file)
    getObject(file)

    if (path.extname(file) == ".css") {
        live = "./data/live/" + file
        file = config.directory + file

        if (fs.existsSync(live)) {
            fs.createReadStream(file).pipe(fs.createWriteStream(live));
            console.log(file + " [WRITE] " + live);
        }

        else {
            ncp(file, live, function (err) {
                if (err) {
                return console.error(err);
                }
                console.log(file + " [COPY] " + live);
            });
        }
    }
    else {
        console.log("Change of non-CSS File dedected. Initializing Reload...")
    }
})

//alle files scannen und in /live kopieren
function fullScan(config) {
    files = fs.readdirSync(config.directory)

    files.forEach(file => {
        console.log("initial scan: " + file)
        moveLive(file)
        quickAccess(file)
    });
}

function saveChanges() {
    source = "./data/live/"
    target = config.directory

    console.log("Saving...")

    fs.readdirSync(source).forEach(file => {
        console.log(source + file + " [write] " + target + file)

        content = fs.readFileSync(source + file, "utf8")

        fs.writeFileSync(target + file, content, "utf8")
    });
}


function moveLive(file) {
    if (path.extname(file) == ".css") {
        live = "./data/live/" + file
        file = config.directory + file

        if (fs.existsSync(live)) {
            fs.createReadStream(file).pipe(fs.createWriteStream(live));
            console.log(file + " [copy] " + live);
        }
        else {
            ncp(file, live, function (err) {
                if (err) {
                  return console.error(err);
                }
                console.log(file + " [write] " + live);
            });
        }
    }
}

function updateEditor(config) {
    ipcRenderer.sendSync('createEditor', config)
}

//beim start ein update durchführen
setTimeout(function() {
    fullScan(config)
}, 500)