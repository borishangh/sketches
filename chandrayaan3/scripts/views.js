import { params } from "./params.js"
import { fetchJSONFile } from "./jsonparse.js"
import { circle, text, scale, plotPoints } from "./canvas.js"

const speedSlider = document.getElementById('speed');

async function showView(ctx, name, start = 1) {
    const size = ctx.canvas.clientWidth;
    const param_data = params[name];
    const { x_lim, y_lim, x_param, y_param } = param_data;
    const { path_data, path_length, primary_object } = param_data;

    const speed = speedSlider.value / 250;
    console.log(speed);

    var paths = [];
    for (const path of path_data) {
        const data = await fetchJSONFile(path[0])
        paths.push(data)
    }

    // start from i th frame and draw per frame
    let i = start;

    const interval_id = setInterval(() => {
        // stop when i exceeds path length

        if (i > path_length)
            i = i % path_length + 1;

        // draw the background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, size, size);

        // write date
        const { date, time } = paths[0][i];
        text(ctx, date + "\t" + time.slice(0, -3), 5, 12, "#ddd")

        // draw the primary object
        var po_r = scale(primary_object[0], 0, x_lim[1] - x_lim[0], size);
        var po_x = scale(0, x_lim[0], x_lim[1], size),
            po_y = size - scale(0, y_lim[0], y_lim[1], size);
        var po_c = primary_object[1];

        circle(ctx, po_x, po_y, po_r > 3 ? po_r : 3, po_c)

        // draw all paths and objects
        for (var j = 0; j < paths.length; j++) {
            var colour = path_data[j][1]
            plotPoints(ctx, paths[j],
                x_param, y_param, i, x_lim, y_lim, colour)

            // objects
            var x = scale(paths[j][i][x_param], x_lim[0], x_lim[1], size);
            var y = size - scale(paths[j][i][y_param], y_lim[0], y_lim[1], size);
            circle(ctx, x, y, 2, colour)
        }

        i += 1;
        localStorage.setItem("current_frame", i)

    }, 50 / speed)

    return interval_id
}

export { showView }