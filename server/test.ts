
import {Game} from './src/game/game';
import {Player,Color} from './src/game/player';
import {BallMove} from './src/game/board';

let players:Array<Player>=[new Player("P1",Color.Blue,0),new Player("P2",Color.Green,1),new Player("P3",Color.Black,0),new Player("P4",Color.Red,1)];

let game=new Game(players);
//game.nextRound();
//console.log(game.toString());

players.forEach(p=>{
    console.log("--> "+p.toString());
    
    p.hand.forEach(c=>{
        console.log("Moves for " + c.toString());
        let moves=game.board.getBallMoves(p,c);
        moves.forEach(m=>{ console.log(m)});
    });

    console.log("------------------");
});








