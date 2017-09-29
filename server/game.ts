import { DeckOfCards, Card } from './cards';
import { Player } from './player';
import { Board, BallMove } from './board';

enum GameState { Start, ExchangeCards, Playing, End };

export class Game {
    round: number = 0;
    roundStartPlayerIndex:number=0;
    deck: DeckOfCards;
    players: Player[] = [];
    board: Board;

    state: GameState = GameState.Start;
    playerState: Array<boolean>;
    teamCardExchange: Array<Card>;

    constructor(players: Player[]) {

        const maxPlayers = 6;

        if (players.length % 2 != 0) {
            throw new Error("Number of players must be 2,4,6");
        }

        if (players.length > maxPlayers) {
            throw new Error("Number of players cant exceed 6");
        }

        //Check Teams
        if (players.length == 2) {
            if (players[0].team == players[1].team) {
                throw new Error(`Player ${players[0].name} can't be in same Team as Player ${players[1].name}`);
            }
        }

        if (players.length == 4) {
            if (players.filter(p => p.team == 0).length != 2) {
                throw new Error(`Team 0 wrong!`);
            }
            if (players.filter(p => p.team == 1).length != 2) {
                throw new Error(`Team 1 wrong!`);
            }
        }

        if (players.length == 6) {
            if (players.filter(p => p.team == 0).length != 2) {
                throw new Error(`Team 0 wrong!`);
            }
            if (players.filter(p => p.team == 1).length != 2) {
                throw new Error(`Team 1 wrong!`);
            }
            if (players.filter(p => p.team == 1).length != 2) {
                throw new Error(`Team 3 wrong!`);
            }
        }


        this.deck = new DeckOfCards(true, 2);
        this.players = players;
        this.board = new Board(this.players);

        //Start Game
        this.nextRound();
    }

    private nextRound() {
        this.round++;
        let handSize = 6 - ((this.round - 1) % 5);

        //Check if enough cards
        if (this.players.length * handSize > this.deck.countCards()) {
            this.deck = new DeckOfCards(true, 2);
        }

        //Get Cards
        let playerCards = this.deck.deal(this.players.length, handSize);
        playerCards.forEach((cards, i) => { this.players[i].hand = cards; });

        //Set State
        if (this.players.length > 2) {
            this.state = GameState.ExchangeCards;
            this.teamCardExchange = new Array<Card>(this.players.length / 2);
        } else {
            this.state = GameState.Playing;
            this.playerState = new Array<boolean>(this.players.length);
        }
    }

    exchangeCard(player: Player, card: Card): void {
        if (this.state != GameState.ExchangeCards) throw new Error("Can't exchange cards!");

        let pindex = this.players.findIndex(p => p == player);
        if (this.teamCardExchange[pindex]) throw new Error("Player" + player.name + " already exchanged cards!");
        this.teamCardExchange[pindex] = card;

        if (this.teamCardExchange.some(c => c === null)) return;

        //All exchanged
        for (let i=0;i<this.players.length / 2;i++){
            let team=this.players.filter(p=>p.team===i);

            let p1Index = this.players.findIndex(p => p.team === i && p != team[0]);
            let p2Index = this.players.findIndex(p => p.team === i && p != team[1]);

            this.players[p1Index].hand[this.players[p1Index].hand.findIndex(ca=>ca===this.teamCardExchange[p1Index])]=this.teamCardExchange[p2Index];
            this.players[p2Index].hand[this.players[p2Index].hand.findIndex(ca=>ca===this.teamCardExchange[p2Index])]=this.teamCardExchange[p1Index];
        }

        this.teamCardExchange=[];
        this.state = GameState.Playing;
        this.playerState = new Array<boolean>(this.players.length);
    }

    possibleMoves(player: Player, card: Card): Array<BallMove> {
        if (this.state != GameState.Playing) throw new Error("Can't get possible moves!");
       
        let cardIndex=player.hand.findIndex(c=>c===card);
        if (cardIndex<0) throw new Error("Can't find card");

        return this.board.getBallMoves(player, card);
    }



    toString(): string {
        return this.players.join("\n") + "\nPack : {" + this.deck.deck.length + "} \nRound : " + this.round + "\nBoard:" + this.board.toString();
    }
}