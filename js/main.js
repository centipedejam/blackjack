/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A',];
const unshuffledDeck = buildUnshuffledDeck();

/*----- state variables -----*/
let shuffledDeck;
let player;
let dealer;
let outcome; // pBlackjackW, pWin, pLose, push
let wallet;
let winnings;

/*----- cached elements  -----*/
const userCardsEl = document.getElementById('u-cards');
const dealerCardsEl = document.getElementById('d-cards');
const wagerInputEl = document.getElementById('wager-input');
const msgEl = document.getElementById('display-msg');
const walletEl = document.getElementById('wallet-info');
const playAgainBtn = document.getElementById('play-again');
const newCard = document.createElement('div');

/*----- event listeners -----*/
document.getElementById('stay-btn').addEventListener('click', handleStay);
document.getElementById('wager-btn').addEventListener('click', handleWager);
document.getElementById('hit-btn').addEventListener('click', handleHit);
document.getElementById('rules-btn').addEventListener('click', toggleRules)
playAgainBtn.addEventListener('click', function () {
    document.querySelector('form').style.display = 'block';
    msgEl.innerText = '';
    msgEl.style.display = 'block'
    init();
});
/*----- functions -----*/
init(200);

function init() {
    shuffledDeck = shuffleNewDeck();
    player = {
        hand: [],
        imgLookup: [],
        handVal: 0,
        wager: 0
    }
    dealer = {
        hand: [],
        imgLookup: [],
        handVal: 0
    }
    outcome = null;
    wallet = wallet || 200;
    render();
}

function handleHit() {
    dealCards(1, player);
    checkBust();
}

function handleStay() {
    hideControls();
    getHandTotal(dealer);
    while (getHandTotal(dealer) < 17) {
        dealCards(1, dealer);
    }
    checkOutcome();
}

function handleWager() {
    const wagerAmt = parseInt(wagerInputEl.value);
    if (wagerAmt > wallet) {
        return msgEl.innerText = 'Not Enough Money!';
    } else if (wagerAmt < 1) {
        return msgEl.innerText = 'Please enter a valid number';
    }
    else {
        player.wager = wagerAmt;
        dealCards(2, player);
        dealCards(2, dealer);
        checkBlackjack();
        msgEl.innerText = ''
        document.querySelector('form').style.display = 'none';
        document.getElementById('hit-btn').style.display = 'block';
        document.getElementById('stay-btn').style.display = 'block';

    }
    document.querySelector('ul').classList.add('hidden');
}

function dealCards(amount, user) {
    for (let i = 0; i < amount; i++) {
        let nextCard = shuffledDeck.shift()
        user.hand.push(nextCard.value);
        user.imgLookup.push(nextCard.face)
    }
}

function getHandTotal(user) {
    user.handVal = 0;
    aceCount = 0;
    user.hand.forEach(function (card, idx) {
        user.handVal += card;
        if (card === 11) {
            aceCount++;
        }
        while (aceCount && user.handVal > 21) {
            user.handVal -= 10;
            aceCount--;
        }
    })
    return user.handVal;
}

function checkBlackjack() {
    getHandTotal(dealer);
    getHandTotal(player);

    if (player.handVal === 21 && dealer.handVal === 21) {
        outcome = 'push';
    }
    else if (player.handVal === 21) {
        outcome = 'pBlackjackW'
    }
    else if (dealer.handVal === 21) {
        outcome = 'pLose'
    }
    updateWallet();
    render();
    if (outcome) {
        hideControls();
    }
}

function checkBust() {
    getHandTotal(player);
    if (player.handVal > 21) {
        outcome = 'pLose';
        hideControls();
    }
    updateWallet();
    render();
}

function checkOutcome() {
    getHandTotal(player);
    getHandTotal(dealer);
    if (player.handVal > 21) {
        outcome = 'pLose'
    } else if (dealer.handVal > 21) {
        outcome = 'pWin';
    } else if (player.handVal > dealer.handVal) {
        outcome = 'pWin';
    } else if (player.handVal === dealer.handVal) {
        outcome = 'push';
    } else {
        outcome = 'pLose';
    }
    document.getElementById('hit-btn').style.display = 'none';
    document.getElementById('stay-btn').style.display = 'none';
    updateWallet();
    render();
}

function updateWallet() {
    if (outcome === 'pWin') {
        wallet += player.wager;
    } else if (outcome === 'pBlackjackW') {
        wallet += player.wager * 1.5;
    } else if (outcome === 'pLose') {
        wallet -= player.wager;
    }
}

function toggleRules() {
    document.querySelector('ul').classList.toggle('hidden');
}

function hideControls() {
    document.getElementById('hit-btn').style.display = 'none';
    document.getElementById('stay-btn').style.display = 'none';
}

function render() {
    playAgainBtn.style.display = 'none';
    renderCards();
    renderWalletMsg();
    if (outcome) {
        renderWinner();
    }
}

function renderWinner() {
    playAgainBtn.style.display = 'block';
    faceDownCard = document.querySelector('.back-red');
    faceDownCard.classList.remove('back-red');
    faceDownCard.classList.add(`${dealer.imgLookup[0]}`);
    if (outcome === 'pWin') {
        msgEl.style.color = 'green';
        msgEl.innerText = `Player Wins! \n${player.handVal} to ${dealer.handVal}`;
    } else if (outcome === 'pLose') {
        msgEl.style.color = 'red';
        msgEl.innerText = `Dealer Wins! \n${dealer.handVal} to ${player.handVal}`;

    } else if (outcome === 'pBlackjackW') {
        msgEl.style.color = 'green';
        msgEl.innerText = 'Player Wins with a Blackjack!';
    } else {
        msgEl.style.color = 'rgb(50, 50, 50)';
        msgEl.innerText = `It's a draw!\n${player.handVal} to ${dealer.handVal}`;
    }
}

function renderWalletMsg() {
    const wagerEl = document.getElementById('wager-amt');
    const walletEl = document.getElementById('wallet-amt');
    wagerEl.innerText = `Wager: ${player.wager}`;
    walletEl.innerText = `Wallet: ${wallet}`;
}

function renderCards() {//clears html/card imgs, renders all cards currently in player and dealer hand
    userCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    player.imgLookup.forEach(function (face) {
        userCardsEl.innerHTML += `<div class="card ${face} u-xlarge shadow"></div>`;
    })
    dealer.imgLookup.forEach(function (face) {
        if (face === dealer.imgLookup[0]) {
            dealerCardsEl.innerHTML += `<div class="card back-red d-xlarge shadow down"></div>`;
        } else {
            dealerCardsEl.innerHTML += `<div class="card ${face} d-xlarge shadow"></div>`;
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