let roomId = sessionStorage.getItem('roomId');
let nickname = sessionStorage.getItem('nickname');
let playerNum = ''; // this will be pi or p2
let gameStarted = false;
let rollBtn = document.getElementById('roll-btn');

let ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

ws.onmessage = (event) => {
    let gameData = JSON.parse(event.data);
    console.log('received from server: ', gameData);

    if(!gameStarted) {
        initializeGame(gameData);
        gameStarted = true;
    }

    updateScore(gameData);
    updateDice(gameData);

    rollBtn.disabled = gameData.turn !== playerNum || gameData.rollsLeft <= 0; // button is disabled if not clients turn
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

}

rollBtn.addEventListener('click', () => {
    let event = {
        eventType: 'roll'
    };

    ws.send(JSON.stringify(event));
});

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

    // don't let player keep any dice if they haven't rolled yet
    if(gameData.rollsLeft >= 3) {
        return;
    }

    
    let diceKeptHTML = '';
    for(let i = 0; i < gameData.diceKept.length; i++) {
        let die = gameData.diceKept[i];
        diceKeptHTML += `<div id="die-kept-${i}" class="die-kept">${die}</div>`;
    }
    
    document.getElementById('dice-kept').innerHTML = diceKeptHTML;
    
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
