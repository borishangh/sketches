/*
structure is a massive mess
implement
    castling
    check mates (fml)
improve queen move
remove the fucking booleans
*/


var selected = false,

    iposx, iposy,
    fposx, fposy,

    _K = '♔',
    _Q = '♕',
    _B = '♗',
    _N = '♘',
    _R = '♖',
    _P = '♙',
    _k = '♚',
    _q = '♛',
    _b = '♝',
    _n = '♞',
    _r = '♜',
    _p = '♟',

    ti, tj,

    turnCount = document.querySelector('.turn'),
    board = document.getElementsByClassName("board")[0],

    a = [
        [_r, _n, _b, _q, _k, _b, _n, _r],
        [_p, _p, _p, _p, _p, _p, _p, _p],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        [_P, _P, _P, _P, _P, _P, _P, _P],
        [_R, _N, _B, _Q, _K, _B, _N, _R]
    ],
    i, j,
    flip = false;

function flipX() {
    if (flip) {
        flip = false;
        clearSquares();
        play();

    } else {
        flip = true;
        clearSquares();
        play();
    }
}

play();

function play() {
    makeBoard();
}

function clearSquares() {
    while (board.firstChild) {
        board.removeChild(board.lastChild);
    }
}


function makeBoard() {
    var square, i, j, c;

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            c = "square";
            square = document.createElement("div");


            if (flip) {
                ti = Math.abs(i - 7);
                tj = Math.abs(j - 7);

            } else {
                ti = i;
                tj = j;
            }

            if (ti % 2 == 0 && tj % 2 == 1) {
                c += " black";
            }

            if (ti % 2 == 1 && tj % 2 == 0) {
                c += " black";
            }


            c += ` s${ti}${tj}`;

            square.className = c;
            board.appendChild(square);
            square.setAttribute(`onclick`, `move('.s${ti}${tj}');`);

            document.querySelector(`.s${ti}${tj}`).innerHTML = a[ti][tj];
        }
    }
}

function turnUpdate() {
    if (turnCount.textContent === "White's move")
        turnCount.innerHTML = "Black's move";
    else
        turnCount.innerHTML = "White's move";
}

function flash() {
    turnCount.classList.add('animate');
    setTimeout(function() {
        turnCount.classList.remove('animate');
    }, 400);
}

var tem, turn = 0;

function move(pmove) {

    var posx = parseInt(pmove.charAt(2)),
        posy = parseInt(pmove.charAt(3)),
        playerTurn = (turn % 2 == 0 ? tag(posx, posy) == 'white' : tag(posx, posy) == 'black');

    console.log(posx + " " + posy);

    //first click
    if (!selected && a[posx][posy] != '' && playerTurn) {

        iposx = posx;
        iposy = posy;

        valMove(iposx, iposy, a[iposx][iposy]);
        selected = true;

        return 0;
    }

    //second click
    else if (selected) {

        fposx = posx;
        fposy = posy;

        if (document.querySelector(`.s${fposx}${fposy}`).classList.contains('highlight') || document.querySelector(`.s${fposx}${fposy}`).classList.contains('capture')) {

            document.querySelector(`.s${iposx}${iposy}`).innerHTML = '';
            document.querySelector(`.s${fposx}${fposy}`).innerHTML = a[iposx][iposy];

            tem = a[iposx][iposy];
            a[iposx][iposy] = '';
            a[fposx][fposy] = tem;

            turn++;
            turnUpdate();
        }

        iposx = null;
        iposy = null;
        selected = false;

        clean();
        return 0;
    }

    //if not player's turn flash warning
    else if (!playerTurn)
        flash();
}


function clean() {
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            document.querySelector(`.s${i}${j}`).classList.remove('select');
            document.querySelector(`.s${i}${j}`).classList.remove('highlight');
            document.querySelector(`.s${i}${j}`).classList.remove('capture');
        }
    }
}

function valMove(x, y, piece) {
    document.querySelector(`.s${x}${y}`).classList.add('select');


    if (piece == _b || piece == _B)
        bishop(x, y);
    else if (piece == _p)
        pawn(x, y);
    else if (piece == _n || piece == _N)
        knight(x, y);
    else if (piece == _k || piece == _K)
        king(x, y);
    else if (piece == _r || piece == _R)
        rook(x, y);
    else if (piece == _q || piece == _Q)
        queen(x, y);
    else if (piece == _p || piece == _P)
        pawn(x, y);
}


function colour(x, y) {
    document.querySelector(`.s${x}${y}`).classList.add('highlight');
}

function capture(x, y) {
    document.querySelector(`.s${x}${y}`).classList.add('capture');
}

function tag(x, y) {
    if (a[x][y].charCodeAt(0) >= 9812 && a[x][y].charCodeAt(0) <= 9817)
        return 'white';
    else if (a[x][y].charCodeAt(0) <= 9823 && a[x][y].charCodeAt(0) >= 9818)
        return 'black';
    else if (a[x][y] == '')
        return '';
    else
        return 'err';
}

function isWhite(piece) {
    if (piece.charCodeAt(0) >= 9812 && piece.charCodeAt(0) <= 9817)
        return true;
    else if (piece.charCodeAt(0) <= 9823 && piece.charCodeAt(0) >= 9818)
        return false;
    else
        return undefined;
}

function pawn(x, y) {

    ti = x;
    tj = y;
    pieceColour = tag(x, y);

    //add pawn promotion function

    if (pieceColour == 'white' && x != 0) {
        //first move allow two advances
        if (x == 6) {
            while (a[ti - 1][tj] == '' && ti - 1 > 3) {
                colour(ti - 1, tj);
                ti--;
            }
        } else {
            if (a[ti - 1][tj] == '')
                colour(ti - 1, tj);
        }

        //captures: allow captures after checking edges of board
        if (y != 0)
            tag(x - 1, y - 1) == 'black' ? capture(x - 1, y - 1) : false;
        if (y != 7)
            tag(x - 1, y + 1) == 'black' ? capture(x - 1, y + 1) : false;
    } else if (pieceColour == 'black' && x != 8) {
        if (x == 1) {
            while (a[ti + 1][tj] == '' && ti + 1 < 4) {
                colour(ti + 1, tj);
                ti++;
            }
        } else {
            if (a[ti + 1][tj] == '')
                colour(ti + 1, tj);
        }
        //captures
        if (y != 7)
            tag(x + 1, y + 1) == 'white' ? capture(x + 1, y + 1) : false;
        if (y != 0)
            tag(x + 1, y - 1) == 'white' ? capture(x + 1, y - 1) : false;
    }
}

function knight(x, y) {
    pieceColour = tag(x, y);

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (Math.abs(i - x) == 2 && Math.abs(j - y) == 1 || Math.abs(i - x) == 1 && Math.abs(j - y) == 2) {
                if (a[i][j] == '')
                    colour(i, j);

                //captures
                else if (pieceColour != tag(i, j))
                    capture(i, j);
            }
        }
    }
}

function king(x, y) {
    pieceColour = tag(x, y);
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (i < x + 2 && i > x - 2 && j < y + 2 && j > y - 2) {
                if (tag(i, j) == '')
                    colour(i, j);
                else if (pieceColour != tag(i, j))
                    capture(i, j)
            }
        }
    }
}

function rook(x, y) {

    pieceColour = tag(x, y);

    for (var loop = 0; loop < 2; loop++) {
        ti = x;
        tj = y;
        while (ti > -1 && ti < 8) { //checks verticals
            if (tag(ti, y) == '')
                colour(ti, y);
            else {
                if (tag(ti, y) != pieceColour) {
                    capture(ti, y); //capture if piece != player
                    break;
                } else if (ti != x)
                    break; //if same colour in way, stop
            }
            loop == 0 ? ti-- : ti++;
        }
        while (tj > -1 && tj < 8) { //checks horizontals
            if (tag(x, tj) == '')
                colour(x, tj);
            else {
                if (tag(x, tj) != pieceColour) {
                    capture(x, tj);
                    break;
                } else if (tj != y)
                    break;
            }
            loop == 0 ? tj-- : tj++;
        }
    }
}

function bishop(x, y) {

    pieceColour = tag(x, y);

    for (var loop = 0; loop < 4; loop++) {
        ti = x;
        tj = y;
        while (ti > -1 && ti < 8 && tj > -1 && tj < 8) {
            if (tag(ti, tj) == '')
                colour(ti, tj);
            else {
                if (tag(ti, tj) != pieceColour) {
                    capture(ti, tj); //capture if piece != player
                    break;
                } else if (ti != x && tj != y)
                    break;
            }
            parseInt((loop / 2) % 2) == 0 ? ti-- : ti++;
            loop % 2 == 0 ? tj-- : tj++;
        }
    }
}

function queen(x, y) {

    pieceColour = tag(x, y);

    for (var loop = 0; loop < 4; loop++) {
        ti = x;
        tj = y;
        while (ti > -1 && ti < 8 && tj > -1 && tj < 8) {
            if (tag(ti, tj) == '')
                colour(ti, tj);
            else {
                if (tag(ti, tj) != pieceColour) {
                    capture(ti, tj); //capture if piece != player
                    break;
                } else if (ti != x && tj != y)
                    break;
            }
            parseInt((loop / 2) % 2) == 0 ? ti-- : ti++;
            loop % 2 == 0 ? tj-- : tj++;
        }
    } //optimize this nonsense
    for (var loop = 0; loop < 2; loop++) {
        ti = x;
        tj = y;
        while (ti > -1 && ti < 8) { //checks verticals
            if (tag(ti, y) == '')
                colour(ti, y);
            else {
                if (tag(ti, y) != pieceColour) {
                    capture(ti, y); //capture if piece != player
                    break;
                } else if (ti != x)
                    break; //if same colour in way, stop
            }
            loop == 0 ? ti-- : ti++;
        }
        while (tj > -1 && tj < 8) { //checks horizontals
            if (tag(x, tj) == '')
                colour(x, tj);
            else {
                if (tag(x, tj) != pieceColour) {
                    capture(x, tj);
                    break;
                } else if (tj != y)
                    break;
            }
            loop == 0 ? tj-- : tj++;
        }
    }
}