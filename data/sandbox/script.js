function gen(name) {
    container = document.getElementById("container")

    box = document.createElement("div")
    title = document.createElement("h1")
    text = document.createElement("p")

    box.id = "box"
    title.innerHTML = name
    text.innerHTML = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."

    box.appendChild(title)
    box.appendChild(text)
    container.appendChild(box)
}

names = ["dolor", "sadipscing", "tempor", "sed","babub", "dolor", "sadipscing", "tempor", "sed","babub"]

names.forEach(name => {
    gen(name)
});