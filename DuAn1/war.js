document.getElementById('playButton').onclick = function() {
    window.location.href = 'battle.html';
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

// Đóng modal khi click ra ngoài
window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};



