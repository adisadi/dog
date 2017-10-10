import { Card } from './cards';

export enum Color { Red, Green, Blue, Yellow, Black, White };

export class Player {
    team:number;
    name: string;
    color:Color;

    hand: Card[] = [];

    constructor(name = 'anon',color:Color,team:number) {
        this.name = name;
        this.team=team;
    }

    toString(): string {
        return "Player '" + this.name + "' : {" + this.hand.join(", ") + "}";
    }
}