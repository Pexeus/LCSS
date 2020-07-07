const fs = require("fs");
const path = require("path");

// console.log("clearing up...");

function clearDir(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        console.log("clearing: " + directory);
        for (const file of files) {
            console.log("removing: " + file);
            fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
            });
        }
    });
}

module.exports = clearDir;
