//new dropdown data using text files

//query a dropdown list
function getDropdownData(query) {
    const database = JSON.parse(
        fs.readFileSync(appPath + "/data/config/dropdowns.txt", "utf8"),
    );

    const properties = Object.keys(database);

    for (i = 0; i < properties.length; i++) {
        if (
            query.includes(database[properties[i]]) ||
            database[properties[i]].includes(query) ||
            properties[i].includes(query) ||
            query.includes(properties[i])
        ) {
            return database[properties[i]];
        }
    }

    return false;
}

//adding data to dropdown
function addDropdownData(query, value) {
    let database = JSON.parse(
        fs.readFileSync(appPath + "/data/config/dropdowns.txt", "utf8"),
    );

    const properties = Object.keys(database);

    for (i = 0; i < properties.length; i++) {
        if (query.includes(properties[i]) || properties[i].includes(query)) {
            if (database[properties[i]].includes(value) == false) {
                database[properties[i]].push(value);
            }
        }
    }

    fs.writeFileSync(
        appPath + "/data/config/dropdowns.txt",
        JSON.stringify(database),
    );
}

//return whole database as string
function dropdownChecklist() {
    return fs.readFileSync(appPath + "/data/config/dropdowns.txt", "utf8");
}

//return all properties that have dropdowns available
function dropdownProperties() {
    const database = JSON.parse(
        fs.readFileSync(appPath + "/data/config/dropdowns.txt", "utf8"),
    );
    const properties = Object.keys(database);

    return properties;
}

//default dropdown values
function resetDropdownData() {
    const defaultDatabase = {
        display: ["inline", "block", "flex", "grid", "inline-block", "inherit"],
        units: [
            "px",
            "vh",
            "pt",
            "%",
            "em",
            "in",
            "mm",
            "cm",
            "pt",
            "pc",
            "s",
            "ms",
            " ",
        ],
        colors: ["blue", "red", "black", "white", "yellow"],
        align: ["center", "left", "right", "top", "bottom"],
        cursor: ["pointer", "default"],
    };

    fs.writeFileSync(
        appPath + "/data/config/dropdowns.txt",
        JSON.stringify(defaultDatabase),
    );
}

//empty dropdown values
function clearDropdownData() {
    const defaultDatabase = {
        display: [],
        units: [],
        color: [],
        align: [],
    };

    fs.writeFileSync(
        appPath + "/data/config/dropdowns.txt",
        JSON.stringify(defaultDatabase),
    );
}

//collect data from CSS object
function collectDropdownData(data) {
    resetDropdownData();
    entries = Object.keys(data);

    entries.forEach((entry) => {
        searchTarget(data[entry]);
    });
}

//search a target (#box or something) for dropdown data
function searchTarget(properties) {
    entries = Object.keys(properties);

    entries.forEach((entry) => {
        searchProperty(entry, properties[entry]);
    });
}

//search properties for dropdown data
function searchProperty(property, value) {
    if (typeof value == "object") {
        searchTarget(value);
    } else {
        dropdownProperties().forEach((dropdownProperty) => {
            if (
                dropdownProperty.includes(property) ||
                property.includes(dropdownProperty)
            ) {
                addDropdownData(property, value);
            }
        });
    }
}

resetDropdownData();
