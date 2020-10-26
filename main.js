const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const maxPoints = 21;

class Card {
    constructor(value, suit, weight) {
        this.value = value;
        this.suit = suit;
        this.weight = weight;
    }
}

class Player {
    constructor(playerIndex) {
        this.name = `Player ${playerIndex}`;
        this.id = playerIndex;
        this.points = 0;
        this.hand = [];
    }

    // Push a new card
    pushCard(card) {
        this.hand.push(card);
        this.points += card.weight;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        for (let i = 0 ; i < values.length; i++) {
            for(let j = 0; j < suits.length; j++) {
                let weight = parseInt(values[i]);
                if (values[i] === 'J' || values[i] === 'Q' || values[i] === 'K')
                    weight = 10;
                if (values[i] === 'A')
                    weight = 11;
                let card = new Card(values[i], suits[i], weight);
                this.cards.push(card);
            }
        }
    }

    // Shuffle cards
    shuffle() {
        for (let i = 0; i < 1000; i++)
        {
            let location1 = Math.floor((Math.random() * this.cards.length));
            let location2 = Math.floor((Math.random() * this.cards.length));
            let tmp = this.cards[location1];

            this.cards[location1] = this.cards[location2];
            this.cards[location2] = tmp;
        }
    }

    // Take out the very top card from the deck
    pop() {
        return this.cards.pop();
    }
}

class Game {
    constructor(playerCount) {
        this.players = [];
        this.currentPlayer = 0;
        this.deck = new Deck();
        this.deck.shuffle();

        for(let i = 0; i < playerCount; i++) {
            let player = new Player(i+1);
            this.players.push(player);
        }
    }

    //Deal cards to players, 2 cards for each player
    dealCards() {
        for(let i = 0; i < 2; i++) {
            for (let j = 0; j < this.players.length; j++) {
                let card = this.deck.pop();
                this.players[j].pushCard(card);
                this.renderPlayerPoints(j);
                this.renderCard(card, j);
            }
        }

        game.renderDeckCount();
    }

    // Render UI of the game
    renderUI() {
        document.getElementById('players').innerHTML = '';
        for(let i = 0; i < this.players.length; i++) {
            let div_player = document.createElement('div');
            let div_playerid = document.createElement('div');
            let div_hand = document.createElement('div');
            let div_points = document.createElement('div');

            div_points.className = 'points';
            div_points.id = 'points_' + i;
            div_player.id = 'player_' + i;
            div_player.className = 'player';
            div_hand.id = 'hand_' + i;

            div_playerid.innerHTML = 'Player ' + this.players[i].id;
            div_player.appendChild(div_playerid);
            div_player.appendChild(div_hand);
            div_player.appendChild(div_points);
            document.getElementById('players').appendChild(div_player);
        }
    }

    // Render a card
    renderCard(card, player) {
        let el = document.createElement('div');
        let icon = '';

        switch(card.suit) {
            case 'Hearts':
                icon = '&hearts;';
            case 'Spades':
                icon = '&spades;';
            case 'Diamonds':
                icon = '&diams;';
            case 'Clubs':
                icon = '&clubs;';
        }
        
        el.className = 'card';
        el.innerHTML = card.value + '<br/>' + icon;

        let hand = document.getElementById('hand_' + player);
        hand.appendChild(this.getCardUI(card));
    }

    // Generate UI for a card
    getCardUI(card) {
        var el = document.createElement('div');
        var icon = '';
        if (card.suit == 'Hearts')
        icon='&hearts;';
        else if (card.suit == 'Spades')
        icon = '&spades;';
        else if (card.suit == 'Diamonds')
        icon = '&diams;';
        else
        icon = '&clubs;';
        
        el.className = 'card';
        el.innerHTML = card.value + '<br/>' + icon;
        return el;
    }

    // Render points for each player
    renderPlayerPoints(playerIndex) {
        document.getElementById('points_' + playerIndex).innerHTML = this.players[playerIndex].points;
    }

    // Render the remaining cards count in the deck
    renderDeckCount() {
        document.getElementById('deckcount').innerHTML = this.deck.cards.length;
    }

    // Take out a card from the deck
    popCard() {
        return this.deck.pop();
    }

    // Assign a new card to the current player
    pushPlayerCard(card) {
        this.players[this.currentPlayer].pushCard(card);
    }

    // Check if any player's point is over 21
    check() {
        if (this.players[this.currentPlayer].points > maxPoints) {
            document.getElementById('status').innerHTML = 'Player: ' + this.players[this.currentPlayer].id + ' LOST';
            document.getElementById('status').style.display = 'inline-block';
            document.getElementById('btnDeal').style.display = 'none';
            document.getElementById('btnPass').style.display = 'none';
        }
    }

    // End the game if all players passed
    end() {
        let winner = -1;
        let score = 0;

        for(let i = 0; i < this.players.length; i++) {
            if (this.players[i].points > score && this.players[i].points <= maxPoints) {
                winner = i;
            }
            score = this.players[i].points;
        }

        document.getElementById('status').innerHTML = 'Winner: Player ' + this.players[winner].id;
        document.getElementById('status').style.display = 'inline-block';
        document.getElementById('btnDeal').style.display = 'none';
        document.getElementById('btnPass').style.display = 'none';
    }

    // Shuffle Cards
    shuffle() {
        this.deck.shuffle();
    }
}

let game = new Game();

// Start Game
function startGame() {
    document.getElementById('btnStart').value = 'Restart';
    document.getElementById('btnDeal').style.display = 'inline-block';
    document.getElementById('btnPass').style.display = 'inline-block';
    document.getElementById('status').style.display='none';
    // deal 2 cards to every player object
    game = new Game(2);
    game.renderUI();
    game.dealCards();
    document.getElementById('player_' + game.currentPlayer).classList.add('active');
}

// Ask for a new card
function deal() {
    // pop a card from the deck to the current player
    // check if current player new points are over 21
    let card = game.popCard();
    game.players[game.currentPlayer].pushCard(card);
    game.renderCard(card, game.currentPlayer);
    game.renderPlayerPoints(game.currentPlayer);
    game.renderDeckCount();
    game.check();
}

// Pass to next player
function pass() {
    // move on to next player, if any
    if (game.currentPlayer !== game.players.length-1) {
        document.getElementById('player_' + game.currentPlayer).classList.remove('active');
        game.currentPlayer++;
        document.getElementById('player_' + game.currentPlayer).classList.add('active');
    } else {
            game.end();
    }
}

// Initialize the game
window.addEventListener('load', function() {
    game.shuffle();
    document.getElementById('btnDeal').style.display = 'none';
    document.getElementById('btnPass').style.display = 'none';
});