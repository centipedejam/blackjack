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

/*----- event listeners -----*/
document.getElementById('stay-btn').addEventListener('click', handleStay);

/*----- functions -----*/
init();

function init() {
    player = {
        hand: [5, 10],
        imgLookup: ['d03', 'dK', 's07'],
        wallet: 200,
        handVal: 0
    }
    dealer = {
        hand: [7, 10, 3],
        imgLookup: ['d07', 'hJ', 'c03', 's05'],
        handVal: 0
    }
    render();
}

function handleStay() {
    renderDealerHand();
}

function render() {
    shuffledDeck = shuffleNewDeck();
    renderCards();
}

function renderDealerHand() {
    dealerCardsEl.innerHTML = '';
    dealer.imgLookup.forEach(function (card) {
        dealerCardsEl.innerHTML += `<div class="card ${card} d-xlarge"></div>`
    })

}

function checkOutcome() {

}

function renderCards() {
    if (player.hand.length < 3) {
        for (let i = 0; i < player.hand.length; i++) {
            userCardsEl.innerHTML += `<div class="card ${player.imgLookup[i]} u-xlarge"></div>`;
            if (dealer.imgLookup[i] === dealer.imgLookup[0]) {
                dealerCardsEl.innerHTML += `<div class="card back-red d-xlarge"></div>`;
            } else {
                dealerCardsEl.innerHTML += `<div class="card ${dealer.imgLookup[i]} d-xlarge"></div>`;
            }
        }
    } else {
        userCardsEl.innerHTML += `<div class="card ${player.imgLookup.at(-1)} u-xlarge"></div>`;
    }
}

function buildUnshuffledDeck() {
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
function shuffleNewDeck() {
    const tempDeck = [...unshuffledDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}
