const path = require("path");
const { displayProjects } = require("./projects");

const ENCODED_DIR = remote.app.getAppPath().replace(/ /g, "%20");

function displaySandbox() {
    let sandboxes = [];

    sandboxes[0] = {
        path: path.join(remote.app.getAppPath(), "/data/sandbox/"),
        url: "file:///" + path.join(ENCODED_DIR, "/data/sandbox/index.html"),
    };

    console.log(sandboxes[0]);
    displayProjects(sandboxes);
}

module.exports = displaySandbox;
