var x = 0,
    win = false,
    a = [0, 0, 0, 0, 0, 0, 0, 0, 0],
    strikes = ['.p1', '.p2', '.p3', '.q1', '.q2', '.q3', '.r1', '.r2'];

function turn(i) {
    var box = document.querySelector(i),
        turn = document.querySelector('.turn'),
        n = parseInt(i.charAt(2));
    if (a[n] == 0 && wincheck() == -1) {
        if (x % 2 == 0) {
            box.classList.add('circle');
            a[n] = 1;
            turn.classList.remove('circle');
            turn.classList.add('cross');
        } else {
            box.classList.add('cross');
            a[n] = 2;
            turn.classList.remove('cross');
            turn.classList.add('circle');
        }
        x++;
        wincheck();
    }
    if (wincheck() != -1) {
        winstate(wincheck());
        document.querySelector('.refresh').style.border = "3px double black";
    }
}

function wincheck() {
    if (a[0] == a[1] && a[1] == a[2] && a[1] != 0) {
        document.querySelector('.q1').style.display = "block";
        return a[0];
    } else if (a[3] == a[4] && a[4] == a[5] && a[3] != 0) {
        document.querySelector('.q2').style.display = "block";
        return a[3];
    } else if (a[6] == a[7] && a[7] == a[8] && a[6] != 0) {
        document.querySelector('.q3').style.display = "block";
        return a[6];
    } else if (a[0] == a[3] && a[3] == a[6] && a[6] != 0) {
        document.querySelector('.p1').style.display = "block";
        return a[0];
    } else if (a[1] == a[4] && a[4] == a[7] && a[7] != 0) {
        document.querySelector('.p2').style.display = "block";
        return a[1];
    } else if (a[2] == a[5] && a[5] == a[8] && a[8] != 0) {
        document.querySelector('.p3').style.display = "block";
        return a[2];
    } else if (a[0] == a[4] && a[4] == a[8] && a[8] != 0) {
        document.querySelector('.r2').style.display = "block";
        return a[0];
    } else if (a[2] == a[4] && a[4] == a[6] && a[6] != 0) {
        document.querySelector('.r1').style.display = "block";
        return a[2];
    } else if (a.every(item => item > 0)) {
        return 0;
    } else {
        return -1;
    }
}

function winstate(i) {
    document.querySelector('.result').innerHTML = (i > 0 ? (i > 1 ? "cross win" : "circle win") : "stalemate");
}

function refresh() {
    var i;
    for (i = 0; i < 9; i++) {
        document.querySelector(`.a${i}`).classList.remove('circle');
        document.querySelector(`.a${i}`).classList.remove('cross');
        a[i] = 0;
    }
    for (i = 0; i < strikes.length; i++) {
        document.querySelector(strikes[i]).style.display = "none";
    }
    document.querySelector('.result').innerHTML = "";
    document.querySelector('i').style.display = "none";
    document.querySelector('.refresh').style.border = "1px solid black";
}