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
document.getElementById('wager-btn').addEventListener('click', handleWager);
document.getElementById('hit-btn').addEventListener('click', handleHit);

/*----- functions -----*/
init();

function init() {
    shuffledDeck = shuffleNewDeck();
    player = {
        hand: [10, 2, 11, 11, 11],
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


function handleHit() {
    dealCards(1, player);
    render();
    //check outcome?
    player.handVal = 22;
    //     if (player.handVal > 21) {
    //         setTimeout(function () {
    //             alert('busted');
    //         }, 100)
    //     }
    // }
}

function handleWager() { //checks to see if player has enough money, removes money from wallet
    const wagerAmt = parseInt(wagerInputEl.value)
    if (wagerAmt > player.wallet) {
        alert('not enough money');
    }
    else {
        player.wallet -= parseInt(wagerInputEl.value);
        dealCards(2, player);
        dealCards(2, dealer);
    }
}
function dealCards(amount, user) {
    for (let i = 0; i < amount; i++) {
        let nextCard = shuffledDeck.shift()
        user.hand.push(nextCard.value);
        user.imgLookup.push(nextCard.face)
    }
    render();
}

function handleStay() {
    getHandTotal(user);
    render();
}
function getHandTotal(user) {
    user.hand.forEach(function (card) {
        user.handVal += card;
        aceCount = 0;
        if (card === 11) {
            aceCount++;
        }
        user.handVal -= 10 * aceCount
    })
    return user.handVal;
}

function render() {
    renderCards();
    renderWalletMsg();
}

function checkOutcome() {

}

function renderWalletMsg() {

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
