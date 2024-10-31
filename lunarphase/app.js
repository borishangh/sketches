console.log(getLunarAgeFraction())


function getJulianDate() {
    let date = new Date();
    let tmzOffset = date.getTimezoneOffset()
        / 1440; // minutes in a day;
    let julianDay =
        ~~((date.getTime() / 86400000)
            - tmzOffset + 2440587.5);

    return julianDay;
}

function getLunarAgeFraction() {
    const LUNAR_MONTH = 29.53059;

    let daysSinceNewMoon = getJulianDate() - 2459581.68;
    let lunarAge = daysSinceNewMoon % LUNAR_MONTH;

    return lunarAge / LUNAR_MONTH;
}

getFrame(getLunarAgeFraction());

function getFrame(fraction) {

    // setup video
    let video = document.createElement('video');
    let source = document.createElement('source');
    source.src = 'moon.mp4'
    video.appendChild(source);

    //setup canvas
    let canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    video.currentTime = fraction * 23.786646;

    video.onloadeddata = () => {
        let w = video.videoWidth,
            h = video.videoHeight

        canvas.width = h - 4;
        canvas.height = h - 4;

        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(video, (h - w) / 2, 0, w, h);

        let dataURI = canvas.toDataURL('image/jpeg');
        let img = document.getElementById('moon-img');

        img.src = dataURI;
    }
}