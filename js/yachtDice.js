let roomId = sessionStorage.getItem('roomId');
let nickname = sessionStorage.getItem('nickname');
let playerNum = ''; // this will be pi or p2
let gameStarted = false;
let rollBtn = document.getElementById('roll-btn');

let ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

ws.onmessage = (event) => {
    let gameData = JSON.parse(event.data);
    // console.log('received from server: ', gameData);

    if(!gameStarted) {
        initializeGame(gameData);
        gameStarted = true;
    }

    updateScore(gameData);
    updateDice(gameData);
    showScoreHints(gameData);

    rollBtn.disabled = gameData.turn !== playerNum || gameData.rollsLeft <= 0; // button is disabled if not clients turn

    // allow scores to be selected if it's the players turn and they've rolled at least once
    if(gameData.turn === playerNum && gameData.rollsLeft < 3) {
        enableScoreSelection(gameData.scoreCard[playerNum]);
    }
    else {
        disableScoreSelection();
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
}

// player param should be "p1" or "p2"
function updateScoreForPlayer(player, scoreCard) {
    if(scoreCard.isAcesScore) {
        document.getElementById(`${player}-aces`).innerHTML = scoreCard.aces;
        document.getElementById(`${player}-aces`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-aces`).innerHTML = '';
    }

    if(scoreCard.isDeucesScore) {
        document.getElementById(`${player}-deuces`).innerHTML = scoreCard.deuces;
        document.getElementById(`${player}-deuces`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-deuces`).innerHTML = '';
    }
    
    if(scoreCard.isThreesScore) {
        document.getElementById(`${player}-threes`).innerHTML = scoreCard.threes;
        document.getElementById(`${player}-threes`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-threes`).innerHTML = '';
    }
    
    if(scoreCard.isFoursScore) {
        document.getElementById(`${player}-fours`).innerHTML = scoreCard.fours;
        document.getElementById(`${player}-fours`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-fours`).innerHTML = '';
    }
    
    if(scoreCard.isFivesScore) {
        document.getElementById(`${player}-fives`).innerHTML = scoreCard.fives;
        document.getElementById(`${player}-fives`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-fives`).innerHTML = '';
    }
    
    if(scoreCard.isSixesScore) {
        document.getElementById(`${player}-sixes`).innerHTML = scoreCard.sixes;
        document.getElementById(`${player}-sixes`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-sixes`).innerHTML = '';
    }
    
    if(scoreCard.isFourOfAKindScore) {
        document.getElementById(`${player}-fourOfAKind`).innerHTML = scoreCard.fourOfAKind;
        document.getElementById(`${player}-fourOfAKind`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-fourOfAKind`).innerHTML = '';
    }
    
    if(scoreCard.isFullHouseScore) {
        document.getElementById(`${player}-fullHouse`).innerHTML = scoreCard.fullHouse;
        document.getElementById(`${player}-fullHouse`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-fullHouse`).innerHTML = '';
    }
    
    if(scoreCard.isSmallStraightScore) {
        document.getElementById(`${player}-smallStraight`).innerHTML = scoreCard.smallStraight;
        document.getElementById(`${player}-smallStraight`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-smallStraight`).innerHTML = '';
    }
    
    if(scoreCard.isLargeStraightScore) {
        document.getElementById(`${player}-largeStraight`).innerHTML = scoreCard.largeStraight;
        document.getElementById(`${player}-largeStraight`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-largeStraight`).innerHTML = '';
    }
    
    if(scoreCard.isChanceScore) {
        document.getElementById(`${player}-chance`).innerHTML = scoreCard.chance;
        document.getElementById(`${player}-chance`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-chance`).innerHTML = '';
    }
    
    if(scoreCard.isYachtScore) {
        document.getElementById(`${player}-yacht`).innerHTML = scoreCard.yacht;
        document.getElementById(`${player}-yacht`).className = 'scored-cell';
    }
    else {
        document.getElementById(`${player}-yacht`).innerHTML = '';
    }
}

function showScoreHints(gameData) {
    Object.keys(gameData.scoreHints).forEach(hint => {
        document.getElementById(`${gameData.turn}-${hint}`).innerHTML = gameData.scoreHints[hint];
    });
}

function enableScoreSelection(scoreCard) {
    if(!scoreCard.isAcesScore) {
        document.getElementById(`${playerNum}-aces`).onclick = score;
        document.getElementById(`${playerNum}-aces`).style.cursor = 'pointer';
    }

    if(!scoreCard.isDeucesScore) {
        document.getElementById(`${playerNum}-deuces`).onclick = score;
        document.getElementById(`${playerNum}-deuces`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isThreesScore) {
        document.getElementById(`${playerNum}-threes`).onclick = score;
        document.getElementById(`${playerNum}-threes`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isFoursScore) {
        document.getElementById(`${playerNum}-fours`).onclick = score;
        document.getElementById(`${playerNum}-fours`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isFivesScore) {
        document.getElementById(`${playerNum}-fives`).onclick = score;
        document.getElementById(`${playerNum}-fives`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isSixesScore) {
        document.getElementById(`${playerNum}-sixes`).onclick = score;
        document.getElementById(`${playerNum}-sixes`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isFourOfAKindScore) {
        document.getElementById(`${playerNum}-fourOfAKind`).onclick = score;
        document.getElementById(`${playerNum}-fourOfAKind`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isFullHouseScore) {
        document.getElementById(`${playerNum}-fullHouse`).onclick = score;
        document.getElementById(`${playerNum}-fullHouse`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isSmallStraightScore) {
        document.getElementById(`${playerNum}-smallStraight`).onclick = score;
        document.getElementById(`${playerNum}-smallStraight`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isLargeStraightScore) {
        document.getElementById(`${playerNum}-largeStraight`).onclick = score;
        document.getElementById(`${playerNum}-largeStraight`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isChanceScore) {
        document.getElementById(`${playerNum}-chance`).onclick = score;
        document.getElementById(`${playerNum}-chance`).style.cursor = 'pointer';
    }
    
    if(!scoreCard.isYachtScore) {
        document.getElementById(`${playerNum}-yacht`).onclick = score;
        document.getElementById(`${playerNum}-yacht`).style.cursor = 'pointer';
    }
}

function disableScoreSelection() {
    document.getElementById(`${playerNum}-aces`).onclick = null;
    document.getElementById(`${playerNum}-aces`).style.cursor = 'default';
    document.getElementById(`${playerNum}-deuces`).onclick = null;
    document.getElementById(`${playerNum}-deuces`).style.cursor = 'default';
    document.getElementById(`${playerNum}-threes`).onclick = null;
    document.getElementById(`${playerNum}-threes`).style.cursor = 'default';
    document.getElementById(`${playerNum}-fours`).onclick = null;
    document.getElementById(`${playerNum}-fours`).style.cursor = 'default';
    document.getElementById(`${playerNum}-fives`).onclick = null;
    document.getElementById(`${playerNum}-fives`).style.cursor = 'default';
    document.getElementById(`${playerNum}-sixes`).onclick = null;
    document.getElementById(`${playerNum}-sixes`).style.cursor = 'default';
    document.getElementById(`${playerNum}-fourOfAKind`).onclick = null;
    document.getElementById(`${playerNum}-fourOfAKind`).style.cursor = 'default';
    document.getElementById(`${playerNum}-fullHouse`).onclick = null;
    document.getElementById(`${playerNum}-fullHouse`).style.cursor = 'default';
    document.getElementById(`${playerNum}-smallStraight`).onclick = null;
    document.getElementById(`${playerNum}-smallStraight`).style.cursor = 'default';
    document.getElementById(`${playerNum}-largeStraight`).onclick = null;
    document.getElementById(`${playerNum}-largeStraight`).style.cursor = 'default';
    document.getElementById(`${playerNum}-chance`).onclick = null;
    document.getElementById(`${playerNum}-chance`).style.cursor = 'default';
    document.getElementById(`${playerNum}-yacht`).onclick = null;
    document.getElementById(`${playerNum}-yacht`).style.cursor = 'default';
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
