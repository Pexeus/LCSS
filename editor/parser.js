//CSS objekt zu string machen (mit formatierung)

tabsCount = 0

//css objekt zu string parsen
function parseCSS(object, extractedData) {
    //console.log(object)
    string = ""

    string += extractedData

    targets = Object.keys(object)

    targets.forEach(target => {
        string += insertTarget(target, object[target], 0)
    });

    //console.log(string)
    return string
}

//targets einfügen (z.b. #box)
function insertTarget(target, block, tabsCount) {
    string = ""

    head = target + " {\n"

    string += setTabulators(tabsCount) + head
    tabsCount += 1
    string += insertProperties(block, tabsCount)
    tabsCount -= 1
    string += setTabulators(tabsCount) + "}\n\n"

    return string
}

//eigenschaften einfügen (springt zu target bei objekt)
function insertProperties(dataset, tabsCount) {
    //console.log(dataset)
    properties = Object.keys(dataset)
    string = ""

    properties.forEach(property => {
        if (typeof(dataset[property]) === "string") {
            value = dataset[property]

            string += setTabulators(tabsCount) + property + ": " + value + ";\n"
        }
        else if (typeof(dataset[property]) === "object") {
            tabsCount += 1
            string += insertTarget(property, dataset[property], tabsCount - 1)
            tabsCount -= 1
        }
    });



    return string
}

//tabulatoren verwalten
function setTabulators(amount) {
    returnValue = ""
    for (i = 0; i < amount; i++) {
        returnValue += "\t"
    }

    return returnValue
}