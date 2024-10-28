document.getElementById('playButton').onclick = function() {
    //window.location.href = 'battle.html';
    document.getElementById('nameInputModal').style.display = 'block';
};
//Xu ly nut submit name
document.getElementById('submitNameBtn').onclick = function() {
    let playerName = document.getElementById('playerName').value;
    let errorMsg = document.getElementById('errorMessage');
    //Xoa thong bao loi truoc khi kiem tra
    errorMsg.textContent = '';

    if(playerName) {
        window.location.href = `battle.html?playerName=${encodeURIComponent(playerName)}`;
    }
    else {
        //Hien thi thong bao loi
        errorMsg.textContent = 'Please input your name!';
        errorMsg.style.color = 'red';
    }
};
//
document.getElementById('closeNameModal').onclick = function() {
    document.getElementById('nameInputModal').style.display = 'none';
};

document.getElementById('settingsButton').onclick = function() {
    document.getElementById('settingsModal').style.display = "block";
};

document.getElementById('exitButton').onclick = function() {
    if (confirm("Sure to exit?")) {
        window.close();
    }
};

document.getElementById('closeModal').onclick = function() {
    document.getElementById('settingsModal').style.display = "none";
};

document.getElementById('saveSettings').onclick = function() {
    const bgMusic = document.getElementById('backgroundMusic').checked;
    const gameSound = document.getElementById('gameSound').checked;
    alert(`Saved: BackGround Music - ${bgMusic}, In-Game Sound - ${gameSound}`);
    document.getElementById('settingsModal').style.display = "none";
};

// Dong modal khi click ra ngoai
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

//Xu ly su kien nut reset data
document.getElementById('resetBtn').onclick = function() {
    if(confirm('Sure to reset all game data?')) {
        localStorage.removeItem('highScore');
        localStorage.removeItem('playerScore');
        alert('Game data has been reset.')
    }
}



