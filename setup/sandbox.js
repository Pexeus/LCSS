var path = require("path")

encodedDir = __dirname.replace(/ /g, "%20")

sandboxes = []

sandboxes[0] = {path: path.join(__dirname, '..', '/data/sandbox/'), url: 'file:///' + path.join(encodedDir, '..', '/data/sandbox/index.html')}

function displaySandbox() {
    console.log(sandboxes[0])
    displayProjects(sandboxes)
}

displaySandbox()