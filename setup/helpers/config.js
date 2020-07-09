"use strict";

const remote = require("electron").remote;

const CONFIG = {
    DATA_PATH: "/data/live",
    DATA_SANDBOX: "/data/sandbox",
    DATA_PROJECTS: "/data/config/projects.txt",
    REMOTE_APP: remote.app.getAppPath(),
};

module.exports = CONFIG;
