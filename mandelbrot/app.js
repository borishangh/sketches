const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const maxIter = 250;

console.log(window.innerWidth);

const dpr = window.devicePixelRatio || 1;
const size = window.innerWidth < 720 ? window.innerWidth * 0.8 : 600;

let zoom = size * dpr * .4;
let center = [-0.75, 0];

ctx.scale(dpr, dpr);
canvas.width = size * dpr;
canvas.height = size * dpr;

canvas.style.width = `${size}px`;
canvas.style.height = `${size}px`;

const imgData = ctx.createImageData(canvas.width, canvas.height);
const drawMandelbrot = (zoom, center) => {
  console.time('mandelbrot');

  for (let x = 0; x < canvas.width; x++) {
    const zx = (x - canvas.width / 2) / zoom + center[0];
    for (let y = 0; y < canvas.height; y++) {
      let zy = (y - canvas.height / 2) / zoom + center[1];

      let a = zx;
      let b = zy;
      let n = 0;
      while (n < maxIter) {
        const aa = a * a;
        const bb = b * b;
        const twoab = 2 * a * b;

        a = aa - bb + zx;
        b = twoab + zy;

        if (aa + bb > 4)
          break;
        n++;
      }

      const i = (x + y * canvas.width) * 4;
      const bright = (n / maxIter) * 255;

      imgData.data[i] = bright;
      imgData.data[i + 1] = bright;
      imgData.data[i + 2] = bright;
      imgData.data[i + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  console.timeEnd('mandelbrot');
  return { center, zoom };
};

drawMandelbrot(zoom, center);

canvas.addEventListener('click', function (event) {
  const rect = canvas.getBoundingClientRect();
  const clickedX = (event.clientX - rect.left) * dpr;
  const clickedY = (event.clientY - rect.top) * dpr;
  center = [(clickedX - canvas.width / 2) / zoom + center[0], (clickedY - canvas.height / 2) / zoom + center[1]];
  zoom *= document.getElementById('zoom-in').checked ? 4 : 0.25;
  let data = drawMandelbrot(zoom, center);
  // console.log(data);
});

// canvas.addEventListener('contextmenu', function (event) {
//   event.preventDefault();
//   const rect = canvas.getBoundingClientRect();
//   const clickedX = (event.clientX - rect.left) * dpr;
//   const clickedY = (event.clientY - rect.top) * dpr;
//   center = [(clickedX - canvas.width / 2) / zoom + center[0], (clickedY - canvas.height / 2) / zoom + center[1]];
//   zoom /= 4;
//   let data = drawMandelbrot(zoom, center);
//   console.log(data);
// });