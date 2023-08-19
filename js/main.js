/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A',];
const unshuffledDeck = buildUnshuffledDeck();

/*----- state variables -----*/
let shuffledDeck;
let player;
let dealer;
let outcome;

/*----- cached elements  -----*/
const userCardsEl = document.getElementById('u-cards');
const dealerCardsEl = document.getElementById('d-cards');
const wagerInputEl = document.getElementById('wager-input');

/*----- event listeners -----*/
document.getElementById('stay-btn').addEventListener('click', handleStay);
document.getElementById('wager-btn').addEventListener('click', handleWager)

/*----- functions -----*/
init();

function init() {
    shuffledDeck = shuffleNewDeck();
    player = {
        hand: [],
        imgLookup: [],
        wallet: 200,
        handVal: 0
    }
    dealer = {
        hand: [],
        imgLookup: [],
        handVal: 0
    }
    render();
}
function handleWager() { //checks to see if player has enough money, removes money from wallet
    if (wagerInputEl.value > player.wallet) {
        alert('not enough money');
    } else {
        player.wallet -= parseInt(wagerInputEl.value);
        dealCards();
    }
}

function dealCards() {
    for (let i = 0; i < 2; i++) {
        let nextCard = shuffledDeck.shift();
        player.hand.push(nextCard.value);
        player.imgLookup.push(nextCard.face);
        nextCard = shuffledDeck.shift();
        dealer.hand.push(nextCard.value);
        dealer.imgLookup.push(nextCard.face);
        render();
    }
}

function handleStay() {

    render();
}

function render() {
    renderCards();
}

function checkOutcome() {

}

function renderCards() {//clears html/card imgs, renders all cards currently in player and dealer hand
    userCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    player.imgLookup.forEach(function (face) {
        userCardsEl.innerHTML += `<div class="card ${face} u-xlarge"></div>`;
    })
    dealer.imgLookup.forEach(function (face) {
        if (face === dealer.imgLookup[0]) {
            dealerCardsEl.innerHTML += `<div class="card back-red d-xlarge"></div>`;
        } else {
            dealerCardsEl.innerHTML += `<div class="card ${face} d-xlarge"></div>`;
        }
    })
}

function buildUnshuffledDeck() {//creates a clean deck
    const deck = [];
    suits.forEach(function (suit) {
        ranks.forEach(function (rank) {
            deck.push({
                face: `${suit}${rank}`,
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    });
    return deck;
}
function shuffleNewDeck() {//shuffles a clean deck
    const tempDeck = [...unshuffledDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}
