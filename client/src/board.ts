import { u } from 'umbrellajs';

const rings = [
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 0, 1, 0, 0, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 2, 0, 1, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 5],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 4, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 4, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 0, 4, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0],
];

const boardContainerId = "#board";

export class Board {

    myName: string;

    players: Array<IClientPlayer> = [];

    colorsPlayer: Array<IClientPlayer>;
    boardIndexes: Array<any>;


    constructor(name: string) {
        this.myName = name;
    }

    addPlayer(player: IClientPlayer) {
        this.players.push(player);

        if (this.players.length == 4) {
            this.boardIndexes = CalculateBoardIndexes(this.players, this.getMe());
            this.colorsPlayer = CalculateColorIndexs(this.players, this.getMe());
            console.log(this.colorsPlayer);
            this.drawPlayerColors();
            this.drawPlayerNames();
            
        }
    }

    getMe(): IClientPlayer {
        let mePlayer: IClientPlayer | undefined = this.players.find(p => p.name == this.myName);
        if (!mePlayer) throw Error("Myself not found!");
        return mePlayer;
    }

    draw() {

        let board = u(boardContainerId);
        let createRing = function (x: number, y: number) {

            return u('<div>').addClass('square').attr('data-x', x).attr('data-y', y).attr('data-color-index', rings[y][x]).append(
                u('<div>').append(
                    u('<div>').append(
                        u('<div>').addClass('ring'))));
        };

        for (let y = 0; y < rings.length; y++) {
            for (let x = 0; x < rings[y].length; x++) {

                if (rings[y][x] === 0)
                    board.append('<div class ="square"><div><div><div></div></div></div></div>');
                else
                    board.append(() => { return createRing(x, y); });

            }
        }
    }

    drawPlayerColors() {
        this.colorsPlayer.forEach((player: IClientPlayer, index: number) => {
            u('div[data-color-index="' + index + '"] div.ring').attr('style', 'border-color:' + player.color);
        });
    }

    drawPlayerNames() {

        //me
        let st = u('div[data-x="14"][data-y="18"]').first();
        let color=u(st).attr('data-color-index');
        let rect = st.getBoundingClientRect();
        u(boardContainerId).append(u('<div>').attr('style', 'color:'+this.colorsPlayer[color].color+';position:absolute;z-index:1000;transform: rotate(-45deg);transform-origin: 0 0;top:' + rect.bottom + 'px;left:' + rect.right + 'px').append(u('<span>').text(this.colorsPlayer[color].name)));

        //top left
        st = u('div[data-x="18"][data-y="6"]').first();
        color=u(st).attr('data-color-index');
        rect = st.getBoundingClientRect();
        u(boardContainerId).append(u('<div>').attr('style', 'color:'+this.colorsPlayer[color].color+';position:absolute;z-index:1000;transform: rotate(-135deg);transform-origin: 0 0;top:' + rect.top + 'px;left:' + rect.right + 'px').append(u('<span>').text(this.colorsPlayer[color].name)));

        //top rigth
        st = u('div[data-x="6"][data-y="2"]').first();
        color=u(st).attr('data-color-index');
        rect = st.getBoundingClientRect();
        u(boardContainerId).append(u('<div>').attr('style', 'color:'+this.colorsPlayer[color].color+';position:absolute;z-index:1000;transform: rotate(135deg);transform-origin: 0 0;top:' + rect.top + 'px;left:' + rect.left + 'px').append(u('<span>').text(this.colorsPlayer[color].name)));

        //bottom rigth
        st = u('div[data-x="2"][data-y="14"]').first();
        color=u(st).attr('data-color-index');
        rect = st.getBoundingClientRect();
        u(boardContainerId).append(u('<div>').attr('style', 'color:'+this.colorsPlayer[color].color+';position:absolute;z-index:1000;transform: rotate(45deg);transform-origin: 0 0;top:' + rect.bottom + 'px;left:' + rect.left + 'px').append(u('<span>').text(this.colorsPlayer[color].name)));

    }

}

function getNextField(prevField: any, currentField: any): any {
    let x = currentField.x;
    let y = currentField.y;

    // 0 0 0
    // 0 c 0
    // 0 0 0

    const matrix = [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], undefined, [1, 0],
        [-1, 1], [0, 1], [1, 1],
    ];

    const matrix2 = [
        matrix[1],
        matrix[3],
        matrix[5],
        matrix[7],

        matrix[0],
        matrix[2],
        matrix[6],
        matrix[8],
    ]


    for (let v of matrix2) {
        if (!v) continue;

        let x1 = v[0] + x;
        let y1 = v[1] + y;

        if (x1 >= 0 && y1 >= 0 && x1 < rings[0].length && y1 < rings.length) {
            if (prevField.x === x1 && prevField.y === y1)
                continue;

            if (isField(x1, y1)) {
                return { x: x1, y: y1 };
            }

        }
    }

    console.log(currentField);
    throw Error('Could not find nextField');
}

function isField(x: number, y: number) {
    return rings[y][x] != 0;
}

function CalculateBoardIndexes(players: Array<IClientPlayer>, mePlayer: IClientPlayer): Array<any> {
    //Calculate Board Indexes
    let boardIndexes = new Array(4 * 16);

    let start = mePlayer.startindex - 1;

    let currentField = { x: 12, y: 20 };
    let prevField = { x: 12, y: 19 };

    boardIndexes[start + 1] = currentField;

    while (start >= 0) {
        boardIndexes[start] = getNextField(prevField, currentField);
        prevField = currentField;
        currentField = boardIndexes[start];
        start--;
    }

    start = mePlayer.startindex + 1;
    currentField = { x: 12, y: 20 };
    prevField = { x: 11, y: 20 };
    while (start < boardIndexes.length) {
        boardIndexes[start] = getNextField(prevField, currentField);
        prevField = currentField;
        currentField = boardIndexes[start];
        start++;
    }

    return boardIndexes;
}

function CalculateColorIndexs(players: Array<IClientPlayer>, mePlayer: IClientPlayer): Array<IClientPlayer> {
    let colorsPlayer: Array<IClientPlayer> = new Array(4);

    colorsPlayer[4] = mePlayer;

    for (let p of players) {
        if (p.startindex == mePlayer.startindex) continue;

        if (p.startindex > mePlayer.startindex) {
            let c = (p.startindex - mePlayer.startindex) / 16;

            let d = 4 + c;

            if (d > 5) {
                d = d - 5 + 1;
            }
            colorsPlayer[d] = p;

        } else {
            let c = (mePlayer.startindex - p.startindex) / 16;

            let d = 4 - c;
            if (d < 2) {
                d = 5;
            }
            colorsPlayer[d] = p;
        }


    }
    return colorsPlayer
}



export interface IClientPlayer {
    team: number;
    name: string;
    color: string;
    startindex: number;
}