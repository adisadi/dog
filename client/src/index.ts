import { u } from 'umbrellajs';
import * as tingle from 'tingle.js';

import { Board, IClientPlayer } from './board';

const colors = [
    "#008000", //green
    "#0000FF", //blue
    "#FF0000",//red
    "#581845" //yellow
]


let icount = 1;
let inter;
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");

    window.onresize = (ev: UIEvent): any => {
        setBoardSize(<Window>ev.target);
    };

    setBoardSize(window);



    getPlayerName(name => {
        const board = new Board(name);
        board.draw();
        board.addPlayer({ name: name, startindex: 48, color: colors[3], team: 0 } as IClientPlayer);
        inter = setInterval(createPlayer, 1000, board);
    });
});

function createPlayer(board: Board) {
    if (icount > 3) {
        clearInterval(inter);
        return;
    }
    console.log(board);
    board.addPlayer({ name: "Player" + icount, startindex: (icount - 1) * 16, color: colors[icount - 1], team: 0 } as IClientPlayer);
    console.log("player added");
    icount++;
}

function setBoardSize(window: Window) {
    let h = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;

    u('#board').attr('style', 'width:' + h + 'px');
}

function getPlayerName(callback) {
    var modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['button'],
        closeLabel: "Close",
        beforeOpen: function () {
            u(u('#myName').first()).on('keypress', function (e) {
                if (e.keyCode == 13)
                    modal.close();

            });
        },
        beforeClose: function () {
            // here's goes some logic
            // e.g. save content before closing the modal
            let name = u('.tingle-modal-box__content input').first().value;

            if (name) {
                callback(name);
                return true;
            }
            return false; // nothing happens
        }
    });

    // set content
    modal.setContent('<h1>Your Name</h1><input id="myName" type="text" autofocus>');
    // add a button
    modal.addFooterBtn('OK', 'tingle-btn tingle-btn--primary tingle-btn--pull-right', function () {
        modal.close();
    });

    modal.open();
}

