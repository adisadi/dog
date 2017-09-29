export enum Suit { Spades, Clubs, Diamonds, Hearts }
export enum Rank { Ace = 1, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King }

const movingCards: Rank[] = [Rank.Two, Rank.Three, Rank.Five, Rank.Six, Rank.Eight, Rank.Nine, Rank.Ten, Rank.Queen];
const specialCard: Rank[] = [Rank.Ace, Rank.Four, Rank.Seven, Rank.Jack, Rank.King];

export class Card {
	joker: boolean;
	suit: Suit;
	rank: Rank;

	constructor(suit: Suit, rank: Rank, joker: boolean = false) {
		this.suit = suit;
		this.rank = rank;
		this.joker = joker;
	}

	isMovingCard():boolean{
		return movingCards.some(m=>m===this.rank);
	}

	toString(): string {
		if (this.joker) {
			return "Joker";
		}

		return Rank[this.rank] + " of " + Suit[this.suit];
	}
}

export class DeckOfCards {
	//	default order
	suits: Suit[] = [Suit.Spades, Suit.Clubs, Suit.Diamonds, Suit.Hearts];
	ranks: Rank[] = [Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven, Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King];

	deck: Card[] = [];
	sets: number = 1;

	constructor(shuffle: boolean = false, sets: number = 1) {
		this.sets = sets;

		for (let i = 1; i <= this.sets; i++) {

			this.suits.forEach((suit) =>
				this.ranks.forEach((rank) =>
					this.deck.push(new Card(suit, rank))));

			this.deck.push(new Card(null, null, true));
			this.deck.push(new Card(null, null, true));
			this.deck.push(new Card(null, null, true));
		}

		if (shuffle) {
			this.shuffle();
		}
	}

	//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	shuffle(): void {
		for (let i = this.deck.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let swap = this.deck[i];
			this.deck[i] = this.deck[j];
			this.deck[j] = swap;
		}
	}

	deal(players: number, handSize: number = 0): Card[][] {




		if (handSize && players * handSize > this.deck.length) {
			throw new Error("Not enough cards in pack for each player");
		}

		if (!handSize) handSize = Math.floor(this.deck.length / players);
		let hands: Card[][] = [];

		this.shuffle();

		for (let i = 0; i < players; i++) {
			hands[i] = new Array<Card>();
		}

		for (let i = 0; i < handSize; i++) {
			for (let j = 0; j < players; j++) {
				hands[j][i] = this.deck.pop();
			}
		}

		return hands;
	}

	countCards() {
		return this.deck.length;
	}

	toString(): string {
		return this.deck.join("\n")
	}

}