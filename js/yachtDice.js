let roomId = sessionStorage.getItem('roomId');
let nickname = sessionStorage.getItem('nickname');
let playerNum = ''; // this will be pi or p2
let gameStarted = false;
let rollBtn = document.getElementById('roll-btn');
let p1Total = document.getElementById('p1-total');
let p2Total = document.getElementById('p2-total');
let messageText = document.getElementById('message-text');
let rollsLeftText = document.getElementById('rolls-left-text');

const categories = [
    'aces',
    'deuces',
    'threes',
    'fours',
    'fives',
    'sixes',
    'fourOfAKind',
    'fullHouse',
    'smallStraight',
    'largeStraight',
    'chance',
    'yacht'
];

let ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
// let ws = new WebSocket(`wss://yachtdiceservice.xyz/ws/${roomId}`);

ws.onmessage = (event) => {
    let gameData = JSON.parse(event.data);
    console.log('received from server: ', gameData);

    if(!gameStarted) {
        initializeGame(gameData);
        gameStarted = true;
    }

    updateScore(gameData);
    updateDice(gameData);
    
    if(gameData.winner.trim() != '') {
        if(gameData.winner === 'tie') {
            messageText.innerHTML = 'tie';
        }
        else {
            messageText.innerHTML = `${gameData.winner} wins!`;
        }

        messageText.style.color = 'blue';

        return;
    }

    updateMessage(gameData);
    showScoreHints(gameData);
    rollBtn.disabled = gameData.turn !== playerNum || gameData.rollsLeft <= 0; // button is disabled if not clients turn
    rollsLeftText.innerHTML = `rolls left: ${gameData.rollsLeft}`

    // allow scores to be selected if it's the players turn and they've rolled at least once
    if(gameData.turn === playerNum && gameData.rollsLeft < 3) {
        enableScoreSelection(gameData.scoreCard[playerNum]);
    }
    else {
        disableScoreSelection(gameData.scoreCard[playerNum]);
    }
};

ws.onopen = (_) => {
    // create the player on the server
    ws.send(JSON.stringify({
        eventType: 'name',
        payload: {
            name: nickname
        }
    }));
}

rollBtn.addEventListener('click', () => {
    let event = {
        eventType: 'roll'
    };

    ws.send(JSON.stringify(event));
});

function initializeGame(gameData) {
    if(document.getElementById('waiting-text')) {
        document.getElementById('waiting-text').remove();
    }
    
    document.getElementById('game').style.visibility = 'visible';

    playerNum = gameData.p1.nickname === nickname ? 'p1' : 'p2';
    document.getElementById('you-title').innerHTML = `You are ${playerNum}`;

    document.getElementById('p1-head').innerHTML = `p1<br>${gameData.p1.nickname}`;
    document.getElementById('p2-head').innerHTML = `p2<br>${gameData.p2.nickname}`;
}

function updateScore(gameData) {
    updateScoreForPlayer("p1", gameData.scoreCard.p1);
    updateScoreForPlayer("p2", gameData.scoreCard.p2);

    p1Total.innerHTML = gameData.totals.p1;
    p2Total.innerHTML = gameData.totals.p2;
}

// player param should be "p1" or "p2"
function updateScoreForPlayer(player, scoreCard) {
    let categoriesScored = Object.keys(scoreCard);

    // for each scored category, set the score and class
    categoriesScored.forEach(category => {
        document.getElementById(`${player}-${category}`).innerHTML = scoreCard[category];
        document.getElementById(`${player}-${category}`).className = 'scored-cell';
    });

    // for unscored categories, blank them out so we don't have left over score hints
    categories.forEach(category => {
        if(!categoriesScored.includes(category)) {
            document.getElementById(`${player}-${category}`).innerHTML = '';
        }
    });
}

function showScoreHints(gameData) {
    Object.keys(gameData.scoreHints).forEach(hint => {
        document.getElementById(`${gameData.turn}-${hint}`).innerHTML = gameData.scoreHints[hint];
    });
}

function enableScoreSelection(scoreCard) {
    let categoriesScored = Object.keys(scoreCard);

    // set mouse type to pointer for unscored categories so the player knows they can click on it
    categories.forEach(category => {
        if(!categoriesScored.includes(category)) {
            document.getElementById(`${playerNum}-${category}`).onclick = score;
            document.getElementById(`${playerNum}-${category}`).className = 'selectable-cell';
        }
    });
}

function disableScoreSelection(scoreCard) {
    let categoriesScored = Object.keys(scoreCard);

    categories.forEach(category => {
        document.getElementById(`${playerNum}-${category}`).onclick = null;
        
        if(!categoriesScored.includes(category)) {
            document.getElementById(`${playerNum}-${category}`).className = 'unscored-cell';
        }
    });
}

function score(e) {
    let idParts = e.target.id.split('-');
    let category = idParts[idParts.length - 1];
    
    let eventData = {
        eventType: 'score',
        payload: {
            category: category
        }
    };

    ws.send(JSON.stringify(eventData));
}

function keepDie(e) {
    let idParts = e.target.id.split('-');
    let dieIndex = parseInt(idParts[idParts.length - 1]);

    let event = {
        eventType: 'keep',
        payload: {
            die: dieIndex
        }
    };
    
    ws.send(JSON.stringify(event));
}

function unkeepDie(e) {
    let idParts = e.target.id.split('-');
    let dieIndex = parseInt(idParts[idParts.length - 1]);

    let event = {
        eventType: 'unkeep',
        payload: {
            die: dieIndex
        }
    };
    
    ws.send(JSON.stringify(event));
}

function updateDice(gameData) {
    let diceInPlayHTML = '';
    for(let i = 0; i < gameData.diceInPlay.length; i++) {
        let die = gameData.diceInPlay[i];
        diceInPlayHTML += `<div id="die-in-play-${i}" class="die-in-play">${die}</div>`;
    }

    document.getElementById('dice-in-play').innerHTML = diceInPlayHTML;
    
    
    let diceKeptHTML = '';
    for(let i = 0; i < gameData.diceKept.length; i++) {
        let die = gameData.diceKept[i];
        diceKeptHTML += `<div id="die-kept-${i}" class="die-kept">${die}</div>`;
    }
    
    document.getElementById('dice-kept').innerHTML = diceKeptHTML;
    
    // don't let player keep any dice if they haven't rolled yet
    if(gameData.rollsLeft >= 3) {
        return;
    }
    
    // don't let player operate on dice if it's not their turn
    if(gameData.turn === playerNum) {
        let diceInPlayElements = document.getElementsByClassName('die-in-play');
        for(let d of diceInPlayElements) {
            d.addEventListener('click', keepDie);
        }

        let diceKeptElements = document.getElementsByClassName('die-kept');
        for(let d of diceKeptElements) {
            d.addEventListener('click', unkeepDie);
        }
    }
}

function updateMessage(gameData) {
    if(gameData.turn === playerNum) {
        messageText.innerHTML = 'your turn';
    }
    else {
        messageText.innerHTML = `${gameData.turn} is rolling...`;
    }

    messageText.style.color = 'red';
}
