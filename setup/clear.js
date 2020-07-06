const fs = require("fs");
pathModule = require("path");

console.log("clearing up...");

function clearDir(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        console.log("clearing: " + directory);
        for (const file of files) {
            console.log("removing: " + file);
            fs.unlink(pathModule.join(directory, file), (err) => {
                if (err) throw err;
            });
        }
    });
}

clearDir(remote.app.getAppPath() + "/data/live");
