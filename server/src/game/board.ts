import { Player } from './player';
import { Card, Rank } from './cards';

const blockingIndexs: Array<number> = [0, 16, 32, 48, 64, 80];

export class Board {
    playersExt: Array<PlayerExt>;

    maxBoardIndex: number;

    constructor(players: Array<Player>) {
        this.playersExt = players.map(p => new PlayerExt(p));
        this.constructBoard();
    }

    constructBoard() {
        this.maxBoardIndex = this.playersExt.length == 2 ? (4 * 16) - 1 : (this.playersExt.length * 16) - 1;
        let teamCount = this.playersExt.length == 2 ? 2 : this.playersExt.length / 2;

        for (let i = 0; i < teamCount; i++) {
            let p = this.playersExt.filter(p => p.player.team == i);
            p[0].startIndex = blockingIndexs[i];
            p[1].startIndex = blockingIndexs[i + teamCount];
        }
    }

    private checkHeavenMove(playerExt: PlayerExt, value: number, heavenIndex: number = 0): boolean {
        if (heavenIndex + value <= 3) {
            for (let i = 1; i < value; i++) {
                if (playerExt.heaven[heavenIndex + i]) return false;
            }
            return true;
        }
        return false;
    }

    private checkBlockingBalls(fromIndex: number, toIndex: number): boolean {
        blockingIndexs.forEach(bindex => {
            if (bindex === 0 && fromIndex > 0 && toIndex > 0 && fromIndex > toIndex) {
                if (this.playersExt.some(p => p.balls.some(b => b.blocking && b.boardIndex == bindex)))
                    return true;
            }
            else {
                if (fromIndex < bindex && toIndex > bindex)
                    if (this.playersExt.some(p => p.balls.some(b => b.blocking && b.boardIndex == bindex)))
                        return true;
            }
        });
        return false;
    }

    private getStackIndex(playerExt: PlayerExt): number {

        for (let i=0;i<playerExt.stack.length;i++){
            if (playerExt.stack[i]===true)
                return i;
        }

        return -1;
    }

    getBallMoves(player: Player, card: Card): Array<BallMove> {

        let playerExt = this.playersExt.find(p => p.player == player);

        if (playerExt.heaven.every(x => x === true)) {
            playerExt = this.playersExt.find(p => p.player.team == player.team && p.player != player);
        }

        if (card.isMovingCard()) {
            return this.getSimpleBallMoves(playerExt, card.rank);
        }

        return this.getSpecialBallMoves(playerExt, card);
    }

    move(player: Player, move: BallMove): void {
        let playerExt = this.playersExt.find(p => p.player == player);

        if (playerExt.heaven.every(x => x === true)) {
            playerExt = this.playersExt.find(p => p.player.team == player.team && p.player != player);
        }

        move.ball.blocking=false;
        if (move.isHeavenMove){
            move.ball.boardIndex=-1;
            move.ball.stackIndex=-1;
            move.ball.heavenIndex=move.toIndex;
            playerExt.heaven[move.toIndex]=true;
        }
        else{
            move.ball.boardIndex=move.toIndex;
            if (move.ball.stackIndex>=0){
                playerExt.stack[move.ball.stackIndex]=false;
                move.ball.stackIndex=-1
            }
        }
    }

    private getSimpleBallMoves(playerExt: PlayerExt, value: number): Array<BallMove> {

        let moves: Array<BallMove> = [];

        playerExt.balls.forEach(b => {
            if (b.heavenIndex >= 0) {
                if (b.heavenIndex < 3) {
                    //Check Heaven
                    if (this.checkHeavenMove(playerExt, value, b.heavenIndex))
                        moves.push(new BallMove(b, b.heavenIndex + value, true));
                }
            }
            else if (b.boardIndex >= 0) {
                let toIndex = b.boardIndex + value > this.maxBoardIndex ? (b.boardIndex + value) - this.maxBoardIndex : b.boardIndex + value;

                //Check Heaven Entry
                if (toIndex >= playerExt.startIndex) {
                    let heavenVal = toIndex - playerExt.startIndex;
                    if (this.checkHeavenMove(playerExt, heavenVal))
                        moves.push(new BallMove(b, heavenVal, true));
                }

                //Check blocking Balls
                if (!this.checkBlockingBalls(b.boardIndex, toIndex))
                    moves.push(new BallMove(b, toIndex));
            }
        });

        return moves;
    }

    private getSpecialBallMoves(playerExt: PlayerExt, card: Card): Array<BallMove> {

        let moves: Array<BallMove> = [];

        //Check Starting move
        if (card.joker || card.rank === Rank.Ace || card.rank === Rank.King) {
            let stackIndex = this.getStackIndex(playerExt);
            if (stackIndex >= 0) {
                moves.push(new BallMove(playerExt.balls.find(b => b.stackIndex === stackIndex), playerExt.startIndex));
            }
        }

        if (card.joker) {
            for (let rank in Rank) {
                if (Number(rank)) {
                    let c = new Card(0, Number(rank));
                    moves = moves.concat(this.getBallMoves(playerExt.player, c));
                }
            }
        }
        else {
            switch (card.rank) {
                case Rank.Ace:
                    moves = moves.concat(this.getSimpleBallMoves(playerExt, 1));
                    moves = moves.concat(this.getSimpleBallMoves(playerExt, 11));
                    break;
                case Rank.Jack:
                    break;
                case Rank.King:
                    moves = moves.concat(this.getSimpleBallMoves(playerExt, 13));
                    break;
                case Rank.Seven:
                    break;
                case Rank.Four:
                    moves = moves.concat(this.getSimpleBallMoves(playerExt, 4));
                    moves = moves.concat(this.getSimpleBallMoves(playerExt, -4));
                    break;
            }
        }
        //Remove Duplicates
        moves = moves.filter((m, index, self) => self.findIndex(t => t.ball === m.ball && t.toIndex === m.toIndex && t.isHeavenMove===m.isHeavenMove) === index); 
        return moves;
    }

    toString(): string {
        return `${this.playersExt.join(',')}`;
    }
}

class PlayerExt {
    constructor(player: Player) {
        this.player = player;
    }
    player: Player;
    heaven: Array<boolean> = [false, false, false, false];
    stack: Array<boolean> = [true, true, true, true];
    balls: Array<Ball> = [new Ball(0), new Ball(1), new Ball(2), new Ball(3)];
    startIndex: number;

    toString(): string {
        return `Player ${this.player.name}: Heaven: ${this.heaven.join(',')} Stack: ${this.stack.join(',')} \n Balls: ${this.balls.join(',')}`;
    }
}

class Ball {
    constructor(stackIndex: number) {
        this.stackIndex = stackIndex;
    }
    boardIndex: number = -1;
    heavenIndex: number = -1;
    stackIndex: number = -1;
    blocking: boolean = true;

    toString(): string {
        return `boardIndex: ${this.boardIndex}: heavenIndex: ${this.heavenIndex} stackIndex: ${this.stackIndex} Blocking: ${this.blocking}`;
    }
}

export class BallMove {
    ball: Ball;
    toIndex: number
    isHeavenMove: boolean;
 
    constructor(ball: Ball, toIndex: number, isHeavenMove: boolean = false) {
        this.ball = ball;
        this.toIndex = toIndex;
        this.isHeavenMove = isHeavenMove;
    }
}