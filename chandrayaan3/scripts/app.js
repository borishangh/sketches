import { showView } from './views.js';
import { createCanvas } from './control.js';

const viewBtn = document.getElementById('view-btn');
const choice = document.getElementById("view-choice")
const allBtn = document.getElementById("view-all")
const stopBtn = document.getElementById("stop-btn")
const resumeBtn = document.getElementById("resume-btn")
const monitorDiv = document.querySelector('.monitor');
const speedSlider = document.getElementById('speed');

const options = ["ch3_earth", "ch3_earth_small", "ch3_moon"]

var intervals = []

document.onload = init()

function init() {
    localStorage.setItem("current_frame", 1)
    speedSlider.disabled = true;

    if (document.body.clientWidth <= 600)
        viewScreens("ch3_earth")
    else
        viewScreens()
}

var size;

allBtn.addEventListener("click", () => { viewScreens() })
viewBtn.addEventListener('click', async () => { viewScreens(choice.value) })

function viewScreens(name) {
    localStorage.setItem("current_frame", 1)

    if (name) {
        size = Math.min(~~(document.body.clientWidth * 0.018) * 52, 600)

        while (monitorDiv.firstChild)
            monitorDiv.removeChild(monitorDiv.firstChild)
        startScreen(name, size, 1)
    } else {

        if (document.body.clientWidth <= 600)
            size = ~~(document.body.clientWidth * 0.018) * 26
        else if (document.body.clientWidth <= 900)
            size = ~~(document.body.clientWidth * 0.018) * 16
        else
            size = ~~(document.body.clientWidth * 0.018) * 18

        while (monitorDiv.firstChild)
            monitorDiv.removeChild(monitorDiv.firstChild)

        for (const option of options)
            startScreen(option, size, 1)
    }
}

async function startScreen(name, size, start_at = 0) {
    speedSlider.disabled = true;

    for (const node of monitorDiv.childNodes)
        if (node.id == name) return

    const ctx = createCanvas(name, size);

    const interval_id = await showView(ctx, name, start_at);
    intervals.push(interval_id)
}

function resumeAnimation() {
    const frame = parseInt(localStorage.getItem("current_frame"))
    speedSlider.disabled = true;

    var nodes = []
    while (monitorDiv.firstChild) {
        nodes.push(monitorDiv.firstChild.id)
        monitorDiv.removeChild(monitorDiv.firstChild);
    }

    for (const node of nodes)
        startScreen(node, size, frame)
}

stopBtn.addEventListener("click", () => { stopAnimation() })
resumeBtn.addEventListener("click", () => { resumeAnimation() })

function stopAnimation() {
    speedSlider.disabled = false;

    for (const interval of intervals)
        clearInterval(interval)
}

export { stopAnimation, resumeAnimation }