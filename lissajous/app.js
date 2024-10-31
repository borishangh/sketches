const dtr = (d) => Math.PI * d / 180;
const id = (id) => document.getElementById(id);
const idval = (id) => parseInt(document.getElementById(id).value)

const polarToXY = (r, theta) => {
    return {
        x: r * Math.cos(dtr(theta)),
        y: r * Math.sin(dtr(theta))
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


if (window.innerWidth < 750) {
    ctx.canvas.width = window.innerWidth * 0.85;
    ctx.canvas.height = window.innerWidth * 0.8;
    id('r1').max = window.innerWidth * 0.425;
    id('r2').max = window.innerWidth * 0.4;
    id('r1').value = window.innerWidth * 0.25;
    id('r2').value = window.innerWidth * 0.22;
    console.log(id('r1')['range']);
} else {
    ctx.canvas.width = 600;
    ctx.canvas.height = 400;
}

const w = canvas.width,
    h = canvas.height;


let thetaInterval;

function animateTheta() {
    let dps = idval('dps');
    if (thetaInterval) return;
    let t = idval('theta');
    thetaInterval = setInterval(
        () => {
            if (t > 360) t -= 360;
            drawFigure(t += 0.02 * dps)
        }, 20);
        document.getElementById('theta').disabled = true;
        document.getElementById('dps').disabled = true;
        document.getElementById('start-animate-btn').disabled = true;
        document.getElementById('stop-animate-btn').disabled = false;
    }
    
    function stopAnimate() {
    document.getElementById('theta').disabled = false;
    document.getElementById('dps').disabled = false;
    document.getElementById('start-animate-btn').disabled = false;
    document.getElementById('stop-animate-btn').disabled = true;

    clearInterval(thetaInterval);
    thetaInterval = undefined;
}


drawFigure();


function drawFigure(th) {
    let res = idval('resolution');
    let theta = th ? th : idval('theta');
    let r1 = idval('r1'),
        r2 = idval('r2');
    let f1 = idval('f1'),
        f2 = idval('f2');

    ctx.clearRect(0, 0, w, h);
    drawGird(res, r1, r2);
    drawCurve(theta, res, r1, r2, f1, f2);
}

function drawCurve(theta, res, r1, r2, f1, f2) {
    let n = Math.pow(2, res);

    ctx.font = "12px Consolas";
    ctx.fillText(`ratio: ${f1}:${f2}`, 5.5, 15.5);
    ctx.fillText(`theta: ${theta.toFixed(1)}°`, 5.5, 30.5);
    ctx.fillText(`r1: ${r1}`, 5.5, 45.5);
    ctx.fillText(`r2: ${r2}`, 5.5, 60.5);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,0,0,1)';

    x_i = polarToXY(r1, 0).x + (w / 2);
    y_i = polarToXY(r2, (90 + theta) * f2).y + (h / 2);

    for (t = (360 / n); t <= 360; t += (360 / n)) {
        x_f = polarToXY(r1, t * f1).x + (w / 2);
        y_f = polarToXY(r2, (t + 90 + theta) * f2).y + (h / 2);

        ctx.beginPath();
        ctx.moveTo(x_i, y_i);
        ctx.lineTo(x_f, y_f);
        ctx.stroke();

        x_i = x_f;
        y_i = y_f;
    }
    document.getElementById('theta').value = theta;

}


function drawGird(res, r1, r2) {
    let n = Math.pow(2, res);

    ctx.lineWidth = 0.2;
    ctx.strokeStyle =
        `rgba(0,0,0,0.5)`;

    ctx.beginPath();
    ctx.arc(w / 2, h, r1, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, h / 2, r2, Math.PI, -Math.PI);
    ctx.stroke();

    ctx.lineWidth = 0.2;
    ctx.strokeStyle =
        `rgba(0,0,0,${res < 11 ? (0.55 - 0.05 * res) : 0})`;
    for (theta = 0; theta <= 360; theta += (360 / n)) {
        x = polarToXY(r1, theta).x + (w / 2);
        y = polarToXY(r1, theta).y + (h / 2);

        ctx.beginPath();
        ctx.moveTo(x, 00);
        ctx.lineTo(x, h);
        ctx.stroke();
    }

    for (theta = 0; theta <= 360; theta += (360 / n)) {
        x = polarToXY(r2, theta).x + (w / 2);
        y = polarToXY(r2, theta).y + (h / 2);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}











