"use strict";

const remote = require("electron").remote;

const CONFIG = {
    DATA_PATH: "/data/live",
    DATA_SANDBOX: "/data/sandbox",
    REMOTE_APP: remote.app.getAppPath(),
};

module.exports = CONFIG;
