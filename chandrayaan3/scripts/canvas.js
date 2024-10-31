function init_canvas(canvas, width, length = width) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = length * dpr;

    canvas.style.width = width + 'px';
    canvas.style.height = length + 'px';

    ctx.scale(dpr, dpr);
    return ctx;
}

function circle(ctx, x, y, r, c, fill = "true") {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    if (fill) {
        ctx.fillStyle = c
        ctx.fill()
    } else {
        ctx.strokeStyle = c
        ctx.lineWidth = r
        ctx.stoke()
    }
}

function path(ctx, path_data, c = "white", width = 1) {

    ctx.strokeStyle = c
    ctx.lineWidth = width

    ctx.beginPath()
    ctx.moveTo(path_data[0][0], path_data[0][1])
    for (const point of path_data)
        ctx.lineTo(point[0], point[1])
    ctx.stroke()
}

function text(ctx, text, x, y, c = "white", font = "9pt monospace") {
    ctx.fillStyle = c
    ctx.font = font
    ctx.fillText(text, x, y)
}

function scale(val, start, end, size) {
    return (val - start) * size / (end - start)
}

function plotPoints(ctx, data, x_param, y_param, stop, x_lim, y_lim, c) {
    const size = ctx.canvas.clientWidth;
    const points = data.slice(0, stop)
        .map(el => [
            scale(el[x_param], x_lim[0], x_lim[1], size),
            size - scale(el[y_param], y_lim[0], y_lim[1], size),
            size
        ])
    path(ctx, points, c, 0.5)
}

export { circle, path, text, init_canvas, scale, plotPoints }