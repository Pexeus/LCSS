const { MSICreator } = require("electron-wix-msi");
const { exec } = require("child_process");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const { create } = require("domain");

function packageInstaller(installer) {
    const outputDir = "./LiveCSS-win32-x64";

    if (fs.existsSync(outputDir)) {
        console.log("old build found, overwriting...");

        rimraf(outputDir, function () {
            console.log("Removed " + outputDir);
        });
    }

    console.log("packaging...");

    exec(`npm run package`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);

        console.log("packaging finished");

        if (installer == true) {
            createInstaller();
        }
    });
}

//create installer
function createInstaller() {
    console.log("Creating installer...");
    // 2. Define input and output directory.
    // Important: the directories must be absolute, not relative e.g
    // appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64",
    const APP_DIR = path.resolve(__dirname, "./LiveCSS-win32-x64");
    // outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer",
    const OUT_DIR = path.resolve(__dirname, "./windows_installer");

    // 3. Instantiate the MSICreator
    const msiCreator = new MSICreator({
        appDirectory: APP_DIR,
        outputDirectory: OUT_DIR,

        // Configure metadata
        description: "CSS editor",
        exe: "LiveCSS",
        name: "LiveCSS",
        manufacturer: "Verion",
        version: "1.0.0",

        // Configure installer User Interface
        ui: {
            chooseDirectory: true,
        },
    });

    // 4. Create a .wxs template file
    msiCreator.create().then(function () {
        // Step 5: Compile the template to a .msi file
        msiCreator.compile();
    });
}

console.log("Just package or create installer as well? (default: package)");
readline.question(`"i" for installer, "p" for package:`, (input) => {
    readline.close();

    if (input.toLowerCase() == "i") {
        packageInstaller(true);
    } else {
        packageInstaller(false);
    }
});
