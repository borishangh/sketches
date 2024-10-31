const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const centerX = 500 / 2;
const centerY = 500 / 2;
const scale = 50;

const dpr = window.devicePixelRatio || 1;
canvas.width = 500 * dpr;
canvas.height = 500 * dpr;
canvas.style.width = '500px';
canvas.style.height = '500px';
context.scale(dpr, dpr);

context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);

let userFunction;

function parseFunction(input) {
    input = input.replace(/\^/g, '**');

    const functions = Object.getOwnPropertyNames(Math).filter(prop => typeof Math[prop] === 'function');
    functions.forEach(func => {
        const regex = new RegExp(`\\b${func}\\b(?=\\()`, 'g');
        input = input.replace(regex, `Math.${func}`);
    });
    
    try {
        const parsedFunction = new Function('x', 'y', `return ${input};`);
        parsedFunction(1, 1);
        return parsedFunction;
    } catch (error) {
        alert("Invalid function input. Please ensure it is in terms of x and y.")
        throw new Error('Invalid function input. Please ensure it is in terms of x and y.');
    }
}

const submit_btn = document.getElementById('submit-function');
const finput_btn = document.getElementById('function-input');

const xSlider = document.getElementById('x-slider');
const ySlider = document.getElementById('y-slider');

function draw() {
    const functionInput = document.getElementById('function-input').value;
    userFunction = parseFunction(functionInput);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    drawPhasePlane();

    const startX = parseFloat(xSlider.value);
    const startY = parseFloat(ySlider.value);

    drawTrajectory(startX, startY);
}

draw();

[xSlider, ySlider].forEach(slider => {
    slider.addEventListener('input', draw); // Call draw() on slider input
});

finput_btn.addEventListener("keypress", (e) => {
    if (e.code === "Enter") 
        draw()
});

submit_btn.addEventListener('click', draw);


function drawLine(start, end) {
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.lineTo(end[0], end[1]);
    context.stroke();
}

function drawAxes() {
    context.fillStyle = 'black';
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    // Draw x-axis and y-axis
    drawLine([0, centerY], [canvas.width, centerY]);
    drawLine([centerX, 0], [centerX, canvas.height]);

    // Draw ticks and labels on x-axis
    for (let i = -5; i <= 5; i++) {
        if (i == 0) continue;
        const x = centerX + i * scale;
        drawLine([x, centerY - 5], [x, centerY + 5]);
        context.fillText(i, x - 3, centerY + 15);
    }

    // Draw ticks and labels on y-axis
    for (let i = -5; i <= 5; i++) {
        if (i == 0) continue;
        const y = centerY - i * scale;
        drawLine([centerX - 5, y], [centerX + 5, y]);
        context.fillText(i, centerX + 10, y + 3);
    }
}

function drawPhasePlane() {
    const arrowLength = 20; // Length of each arrow
    context.fillStyle = 'red';
    context.strokeStyle = 'red';
    context.lineWidth = 0.5;

    for (let i = -5; i <= 5; i += 0.5) {
        for (let j = -5; j <= 5; j += 0.5) {
            const x = i;
            const y = j;
            const slope = userFunction ? userFunction(x, y) : 0; // Calculate slope f(x, y)

            const angle = Math.atan(slope); // Convert slope to angle
            const startX = centerX + x * scale;
            const startY = centerY - y * scale;

            // Calculate end point based on angle and arrow length
            const endX = startX + arrowLength * Math.cos(angle);
            const endY = startY - arrowLength * Math.sin(angle);

            // Draw main line of the arrow
            drawLine([startX, startY], [endX, endY]);

            // Draw arrowhead
            const arrowAngle = Math.PI / 6; // 30 degrees for arrowhead
            const arrowheadLength = 4;

            // Left arrowhead
            const leftX = endX - arrowheadLength * Math.cos(angle - arrowAngle);
            const leftY = endY + arrowheadLength * Math.sin(angle - arrowAngle);
            drawLine([endX, endY], [leftX, leftY]);

            // Right arrowhead
            const rightX = endX - arrowheadLength * Math.cos(angle + arrowAngle);
            const rightY = endY + arrowheadLength * Math.sin(angle + arrowAngle);
            drawLine([endX, endY], [rightX, rightY]);
        }
    }
    
    drawTrajectory();
}

drawAxes();


function drawArrowhead(context, x, y, angle) {
    const headLength = 10; // Length of the arrowhead
    const headAngle = Math.PI / 6; // Angle of the arrowhead

    // Calculate the points for the arrowhead
    const leftX = x - headLength * Math.cos(angle - headAngle);
    const leftY = y - headLength * Math.sin(angle - headAngle);
    const rightX = x - headLength * Math.cos(angle + headAngle);
    const rightY = y - headLength * Math.sin(angle + headAngle);

    // Draw the arrowhead using drawLine
    drawLine([x, y], [leftX, leftY]);   // Left arrowhead
    drawLine([x, y], [rightX, rightY]); // Right arrowhead
}

function drawTrajectory(startX, startY) {
    const deltaTime = 0.1; 
    trajectory = [];
    point = { x: startX, y: startY };

    context.fillStyle = 'blue';
    context.strokeStyle = 'blue';
    context.lineWidth = 1.5;

    // Mark the starting point with a solid circle
    const startingPixelX = centerX + point.x * scale;
    const startingPixelY = centerY - point.y * scale;

    context.beginPath();
    context.arc(startingPixelX, startingPixelY, 7, 0, Math.PI * 2); // Draw a solid circle at the starting position
    context.fill();

    // Add starting point to the trajectory array
    const startingPixel = { x: startingPixelX, y: startingPixelY };
    trajectory.push(startingPixel);

    // Calculate the trajectory
    for (let t = 0; t < 50; t += deltaTime) {
        const dy = userFunction(point.x, point.y); 
        point.x += 0.1;  // Increment x by a fixed value
        point.y += dy * deltaTime; // Update y using dy and dt

        const pixelX = centerX + point.x * scale;
        const pixelY = centerY - point.y * scale;
        trajectory.push({ x: pixelX, y: pixelY });
    }

    // Draw the trajectory
    context.fillStyle = 'blue';
    trajectory.forEach((p, index) => {
        if (index > 0) {
            drawLine([trajectory[index - 1].x, trajectory[index - 1].y], [p.x, p.y], 'blue', 2);
        }
        if (index % 15 === 0 && index > 0) {
            const prevPoint = trajectory[index - 1];
            const nextPoint = p;

            const angle = Math.atan2(nextPoint.y - prevPoint.y, nextPoint.x - prevPoint.x);
            drawArrowhead(context, nextPoint.x, nextPoint.y, angle);
        }
    });

    // Draw the current point at the end of the trajectory
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(point.x * scale + centerX, centerY - point.y * scale, 5, 0, Math.PI * 2); // Draw a circle at the current position
    context.fill();
}