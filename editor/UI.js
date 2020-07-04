const remote = require('electron').remote;


//css property lists für dropdowns
CSS_display = "inline block flex grid inline-block inherit"
CSS_units = "px vh pt % em in mm cm pt pc"
CSS_colors = "blue red black white yellow"
CSS_align = "center left right top bottom"



function createInterface(container, property, values) {

    if (values != null) {
        inputs = createInputs(property, values)
        container.appendChild(inputs)
    }
}

//scope in den files adden
function createScope(scope) {
    scopeContainer = createElement("div", scope)
    scopeTitle = createElement("h3", "scopeHead")
    scopeTitle.innerHTML = scope

    scopeContainer.appendChild(scopeTitle)

    return scopeContainer
}

function createInputs(property, rawValues) {
    values = splitValues(rawValues)

    propertyContainer = createElement("div", property)
    propertyContainer.classList.add("propertyContainer")

    propertyDisplay = createElement("p", "propertyDisplay")
    propertyDisplay.innerHTML = property + ": "

    propertyContainer.appendChild(propertyDisplay)

    values.forEach(value => {
        if (value.search("rgb") > -1) {
            hex = rgbToHex(value)
            input = colorPicker(hex, property)
        }
        else if (value.search("#") > -1) {
            input = colorPicker(value, property)
        }
        else {
            letters = value.match(/[a-zA-Z-%]+/g)
            numbers = value.match(/\d+/g)

            if (numbers != null) {
                input = slider(property, numbers, letters)
            }
            else if (checkDropdown(letters) == true) {
                input = dropdown(property, letters)
            }
            else {
                input = universalInput(letters, property)
            }
        }
        propertyContainer.appendChild(input)
    });

    return propertyContainer
}

function dropdown(property, userValue) {
    options = ""

    dropdownContainer = createElement("div", "dropdownBox")
    selection = createElement("select", "dropdown")

    //schauen in welcher liste der wert vorkommt
    if (CSS_display.includes(userValue)) {
        options = CSS_display.split(" ")
    }
    else if (CSS_colors.includes(userValue)) {
        options = CSS_colors.split(" ")
    }
    else if (CSS_align.includes(userValue)) {
        options = CSS_align.split(" ")
    }

    //dropdown optionen einfügen
    options.forEach(option => {
        container = createElement("option", "dropdownOption")
        container.text = option

        selection.add(container, null)

        if (option == userValue) {
            container.selected = true
        }
    });

    selection.oninput = function() {
        //console.log(event.target.parentNode, property)
        createDataset(event.target, property)
    }

    dropdownContainer.appendChild(selection)
    return dropdownContainer
}

function checkDropdown(data) {
    checklist = CSS_display + CSS_colors + CSS_align

    if (checklist.includes(data)) {
        return true
    }
    else {
        return false
    }
}

function colorPicker(value, property) {
    inputContainer = createElement("div", "pickerContainer")
    input = document.createElement("input")
    input.id = "colorPicker"

    input.addEventListener('change', function(e){
        createDataset(this, property)
    })

    picker = new jscolor(input)
    picker.fromString(value)

    inputContainer.appendChild(input)
    return inputContainer
}

function splitValues(string) {
    rgbCheck = string.search("rgb")
    hexCheck = string.search("#")

    colorRGB = ""
    colorHEX = ""

    if (hexCheck > -1) {
        colorHEX = string.substring(hexCheck, string.length)
        string = string.replace(colorHEX, "")
    }
    else if (rgbCheck > -1) {
        //console.log("0: " + string)
        colorRGB = string.substring(rgbCheck, string.length)
        string = string.replace(colorRGB, "")
        //console.log("1: " + string)
    }

    values = string.split(" ")

    if (colorRGB !== "") {
        values[values.length -1] = colorRGB
    }

    if (colorHEX !== "") {
        values[values.length -1] = colorHEX
    }
    //console.log(values)
    return values
}

function universalInput(unit, property) {
    inputContainer = createElement("div", "universalInput")

    simpleInput = createElement("input", "valueField")
    simpleInput.type = "text"
    simpleInput.value = unit

    simpleInput.oninput = function() {
        console.log(event.target, property)
        createDataset(event.target, property)
    }

    inputContainer.appendChild(simpleInput)

    return inputContainer
}

function slider(property, value, unit) {

    sliderBox = createElement("div", "sliderBox")

    valueBox = createElement("div", "valueBox")

    valueDisplay = valueInput(value)

    valueDisplay.oninput = function() {
        createDataset(event.target.parentNode.parentNode.childNodes[0], property)
    }

    unitDisplay = unitInput(unit)

    unitDisplay.addEventListener("change", () => {
        createDataset(event.target.parentNode.parentNode.childNodes[0], property)
    })

    valueBox.appendChild(valueDisplay)
    valueBox.appendChild(unitDisplay)

    sliderElement = createElement("input", "slider")
    range = getRange(value, unit)
    sliderElement.type = "range"
    sliderElement.min = range.min
    sliderElement.max = range.max
    sliderElement.value = value

    //slider wert in das textfeld
    sliderElement.addEventListener("input", () => {
        container = event.target.parentNode
        display = container.querySelector("#valueInput")

        display.value = event.target.value
    });

    sliderElement.addEventListener("input", () => {
        createDataset(event.target, property)
    });

    sliderBox.appendChild(sliderElement)
    sliderBox.appendChild(valueBox)


    return sliderBox
}

function unitInput(unit) {
    options = CSS_units.split(" ")

    selection = createElement("select", "unitInput")

    options.forEach(option => {
        container = createElement("option", "unitOption")
        container.text = option

        selection.add(container, null)

        //console.log(unit + " / " + option)

        if (option == unit) {
            container.selected = true
        }
    });

    return selection
}

function valueInput(value) {
    field = createElement("input", "valueInput")
    field.value = value

    return field
}

function getRange(value, unit) {
    if (unit == "%" || unit == "vh") {
        min = 0
        max = 100
    }
    else {
        min = value / 4
        max = value * 4
    }

    if (min < 10) {
        min = -10
    }

    if (max < 10) {
        max = max + 10
    }

    if (max > 500 && value < 500) {
        max = 500
    }

    range = {min: Math.round(min), max: Math.round(max)}

    return range
}

//menu panel erstellen (core, sau wichtig)
function createBox(target, container) {
    box = createElement("div", target)
    box.classList.add("box")
    title = createElement("h3", "title")
    title.innerHTML = target
    container.appendChild(box)
    box.appendChild(title)


    return box
}

//JS element erstellen (core, sau wichtig)
function createElement(type, id) {
    element = document.createElement(type)
    if (id != "") {
        element.id = id
    }

    return element
}

//----------WINDOW SHIT----------
    document.getElementById("min").addEventListener("click", function (e) {
        var window = remote.getCurrentWindow();
        window.minimize(); 
    });

    document.getElementById("close").addEventListener("click", function (e) {
        var window = remote.getCurrentWindow();
        window.close();
    });

    //Menu ein/ausblenden
    function toggleMenu() {

        currentOptions = getOptions()

        menu = document.getElementById("menu")
        preview = document.getElementById("preview")

        console.log(menu.style.width)

        if (menu.style.width == "") {
            menu.style.width = "300px"
            preview.style.width = "calc(100% - 300px)"
            currentOptions.menuMode = "normal"
        }
        else if (menu.style.width == "0px") {
            menu.style.width = "300px"
            preview.style.width = "calc(100% - 300px)"
            currentOptions.menuMode = "normal"
        }
        else if (menu.style.width == "300px") {
            menu.style.width = "50%"
            preview.style.width = "50%"
            currentOptions.menuMode = "large"
        }
        else if (menu.style.width == "50%") {
            menu.style.width = "0px"
            preview.style.width = "100%"
            currentOptions.menuMode = "hidden"
        }

        console.log(currentOptions)
        updateOptions(currentOptions)
    }
//----------WINDOW SHIT----------


//-----------geklauter code-----------
function componentFromStr(numStr, percent) {
    var num = Math.max(0, parseInt(numStr, 10));
    return percent ?
    Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
}

function rgbToHex(rgb) {
    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var result, r, g, b, hex = "";
    if ( (result = rgbRegex.exec(rgb)) ) {
        r = componentFromStr(result[1], result[2]);
        g = componentFromStr(result[3], result[4]);
        b = componentFromStr(result[5], result[6]);

        hex = (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;
}
//-----------geklauter code-----------