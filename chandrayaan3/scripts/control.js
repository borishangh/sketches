import { init_canvas } from "./canvas.js";
import { resumeAnimation, stopAnimation } from "./app.js";

const monitorDiv = document.querySelector('.monitor');

function createCanvas(name, size) {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')
    canvas.id = name;
    init_canvas(canvas, size)
    monitorDiv.appendChild(canvas)

    return ctx;
}

const startDate = new Date("2023-07-14T19:22:32");

var timeSelect = document.getElementById("select-time");
var nowButton = document.getElementById("now-btn");

nowButton.addEventListener("click", function () {
    var now = new Date();

    timeSelect.value = now.toISOString().slice(0, 16);

    var f = ~~((now - startDate) / (5000 * 60));
    localStorage.setItem("current_frame", f)
    resumeAnimation()
});

timeSelect.addEventListener("change", () => {

    var enteredDate = new Date(timeSelect.value);
    var f = ~~((enteredDate - startDate) / (5000 * 60));
    localStorage.setItem("current_frame", f)

    resumeAnimation()
})

export { createCanvas }