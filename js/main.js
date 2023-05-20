import '../styles/style.css';

let joinBtn = document.getElementById('join-btn');
joinBtn.onclick = handleRoomInput;

function handleRoomInput() {
    let roomId = document.getElementById('room-id-inp').value;
    let nickname = document.getElementById('nickname-id-inp').value;
    sessionStorage.setItem('roomId', roomId);
    sessionStorage.setItem('nickname', nickname);

    window.location.href = 'yacht.html';
}
