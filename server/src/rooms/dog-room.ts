import { Room } from "colyseus";

import { Game } from '../game/game';
import { Player, Color } from '../game/player';
import { BallMove } from '../game/board';

import * as Messages from './messages';

export class DogRoom extends Room {

    colorIndex: number = -1;
    players: any = {};
    game: Game;

    onInit(options: any) {
        this.maxClients = 4;
        this.setState({});
        console.log("DogRoom created!", options);
    }

    onJoin(client: any) {
        if (this.players[client.id] != null) {
            console.log(`${client.id} already joined.`);
        }

        console.log(`${client.id} joined. Clients:${this.clients.length}`);

        this.colorIndex++;
        let player = new Player("Player1", this.colorIndex, 0);
        this.players[client.id] = player;

        //Send join Message
        let jm = new Messages.JoinMessage(player);
        this.clients.forEach(c => {
            if (c)
                c.send(jm);
        });


        if (this.clients.length == 4) {
            this.game = new Game(this.getPlayers());
            //send cards
            this.clients.forEach(c => {
                if (c) {
                    let pc = new Messages.PlayerCardsMessage(this.players[c.id]);
                    c.send(pc);
                }
            });
        }
    }

    requestJoin(options: any):boolean {
        console.log(options);
        return true;
    }

    onLeave(client: any) {
        console.log(`${client.id} left.`);
        delete this.players[client.id];
    }

    onMessage(client: any, data: any) {
        if (data) {
            if (data.Type === 0) //PlayerJoin
            {
                console.log("Player " + data.PayLoad.name + "joined")
            }
        }
        console.log("DogRoom:", client.id, data);
    }

    onDispose() {
        console.log("Dispose DogRoom");
    }

    getPlayers(): Player[] {
        let playersArray: Player[] = [];
        for (let clientId in this.players) {
            if (this.players.hasOwnProperty(clientId)) {
                playersArray.push(this.players[clientId]);
            }
        }
        return playersArray;
    }

}



class StateHandler {

    players: Player[] = [];
    game: Game;



    constructor() {

    }

    addPlayer(client: any) {
        this.players[client.id] = new Player("Player1", Color.Red, 0);


    }

    removePlayer(client: any) {
        delete this.players[client.id];
    }


    toJSON() {
        return {
            game: this.game,
            player: this.players,
        };
    }
}
