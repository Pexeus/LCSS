"use strict";

const path = require("path");
const CONFIG = require("./config");
const { displayProjects } = require("./projects");

const ENCODED_DIR = CONFIG.REMOTE_APP.replace(/ /g, "%20");

function displaySandbox() {
    const sandboxes = [];

    sandboxes[0] = {
        path: path.join(CONFIG.REMOTE_APP, `${CONFIG.DATA_SANDBOX}/`),
        url: `file:///${path.join(
            ENCODED_DIR,
            `${CONFIG.DATA_SANDBOX}/index.html`,
        )}`,
    };

    displayProjects(sandboxes);
}

module.exports = displaySandbox;
