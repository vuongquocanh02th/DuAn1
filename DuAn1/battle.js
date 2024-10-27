const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');

//Tai hinh anh
let playerImage = new Image();
let bulletImage = new Image();
let enemyImage = new Image();
let enemyBulletImage = new Image();
let backgroundImage = new Image();
let ghostImage = new Image();

//Duong dan hinh anh
playerImage.src = 'resource/image/Player.png';
bulletImage.src = 'resource/image/bullet.png';
enemyImage.src = 'resource/image/Enemy.png';
enemyBulletImage.src = 'resource/image/enemy-bullet.png';
backgroundImage.src = 'resource/image/war.png';
ghostImage.src = 'resource/image/ghost.png';
//Cac bien game
let player = {
    x: 100,
    y: 400,
    width: 100,
    height: 100,
    state: ['standing','jumping','sitting','forward','backward'],
    bullets:[]
};

//Theo doi  vi tri background
let backgroundOffsetX = 0;
//
let enemies = [];
let score = 0;
let highScore = localStorage.getItem('highScore') ?
    parseInt(localStorage.getItem('highScore')) : 0;//Diem so cao nhat
let playerHealth = 100;
let ghosts = [];
let ghostHealth = 3000;

//Tao ke thu
function createEnemy() {
    enemies.push({
        x: canvas.width - 50,
        y: 400,
        width: 100,
        height: 100,
        bullets: []
    });
}
//Tao ghost
function  createGhost() {
    ghosts.push({
        x: canvas.width - 50,
        y: 300,
        width: 200,
        height: 200,
    })
}

//Ve game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Code giup background di chuyen song song voi player
    //Ve background vo han
    let bgWidth = backgroundImage.width;
    let bgHeight = backgroundImage.height;
    ctx.drawImage(backgroundImage,
        backgroundOffsetX % bgWidth, 0, bgWidth,
        bgHeight, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage,
        (backgroundOffsetX % bgWidth) - bgWidth, 0, bgWidth,
        bgHeight, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImage, player.x, player.y,
        player.width, player.height);
    ghosts.forEach(ghost => {
        ctx.drawImage(ghostImage, ghost.x, ghost.y,
            ghost.width, ghost.height);
    });
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y,
            enemy.width, enemy.height);
        enemy.bullets.forEach(bullet => {
            ctx.drawImage(enemyBulletImage, bullet.x, bullet.y, 50, 5);
        });
    });
    player.bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, 60, 5);
    });
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`HP: ${playerHealth}`, 10, 60);
    ctx.fillText(`Highest Score: ${highScore}`, 10, 90);
}
//Ban dan
function shoot(){
    player.bullets.push( {x: player.x + player.width,
            y: player.y + player.height - 55} );
}



//Cap nhat trang thai game
function update() {
    //cap nhat ke thu
    enemies.forEach(enemy => {
        enemy.x -= 3;
        if (Math.random() < 0.02) { //Ke thu co kha nang ban
            enemy.bullets.push({x: enemy.x, y: enemy.y + 35})
        }
    });
    //cap nhat ghost
    ghosts.forEach(ghost => {
        ghost.x -= 3;
    });
    //Cap nhat dan
    updateBullets();
    checkCollision();
}
//Kiem tra va cham
function checkCollision() {
    //Kiem tra va cham voi ghost
    ghosts.forEach((ghost, ghostIndex) => {
        if (player.x < ghost.x + ghost.width
          && player.x + player.width > ghost.x
          && player.y < ghost.y + ghost.height
          && player.y + player.height > ghost.y) {
            endGame();
        }
    });
    //Kiem tra va cham voi ke thu
    enemies.forEach((enemy, enemyIndex) => {
        if (player.x < enemy.x + enemy.width
         && player.x + player.width > enemy.x
         && player.y < enemy.y + enemy.height
         && player.y + player.height > enemy.y){
            endGame();
        }

        //Kiem tra va cham voi dan ke thu
        enemy.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.x < player.x + player.width
               && bullet.x + 10 > player.x
               && bullet.y < player.y + player.height
               && bullet.y + 5 > player.y) {
                playerHealth -= 5;
                if( playerHealth <= 0 ) {
                    endGame();
                }
            }

        });
    });
}

function updateBullets() {
    player.bullets.forEach((bullet, index) => {
        bullet.x += 20; //Di chuyen dan
        //Xoa dan khi ra khoi man hinh
        if (bullet.x > canvas.width) {
            player.bullets.splice(index, 1);
        }
        //Kiem tra va cham giua dan va ke thu
        enemies.forEach((enemy, enemyIndex) => {
            if(bullet.x < enemy.x + enemy.width
            && bullet.x + 10 > enemy.x
            && bullet.y < enemy.y + enemy.height
            && bullet.y + 10 > enemy.y) {
                enemies.splice(enemyIndex, 1);//Xoa ke thu
                player.bullets.splice(index, 1);//Xoa dan
                score += 50; // Tang diem khi ban trung ke thu
            }
        });
        //Kiem tra va cham giua dan va ghost
        ghosts.forEach((ghost, ghostIndex) => {
            if (bullet.x < ghost.x + ghost.width
            && bullet.x + 10 > ghost.x
            && bullet.y < ghost.y + ghost.height
            && bullet.y + 10 > ghost.y) {
                ghost.x += 5;
                ghostHealth -= 2;
                ghostImage.src = 'resource/image/headless-zombie.png';
                if(ghostHealth <= 0) {
                    ghosts.splice(ghostIndex, 1); //Xoa ghost
                    player.bullets.splice(index, 1); //Xoa dan
                    score += 100; //Tang diem khi diet ghost
                }
            }
        });
    });

    //Cap nhat dan cua ke thu
    enemies.forEach(enemy => {
        enemy.bullets.forEach((bullet, index) => {
            bullet.x -= 10; //Di chuyen dan
            if (bullet.x < 0) {
                enemy.bullets.splice(index, 1);//Xoa dan khi ra khoi man hinh
            }
        });
    });
}


function updatePlayer() {

    if (player.state === 'jumping') {
        player.y -= 10; // Nhay len
        if (player.y <= 300) {
            player.state = 'standing'; // Tro ve trang thai dung
        }
    } else if (player.state === 'sitting') {
        player.y = 440; // Vi tri ngoi
    } else {
        player.y = 400; // Vi tri dung
    }
}

//Xu ly phim bam
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            backgroundOffsetX += 5;
            player.state = 'forward';
            playerImage.src = 'resource/image/moveforward2.png';
            break;
        case 'ArrowLeft':
            backgroundOffsetX -= 5;
            player.state = 'backward';
            playerImage.src = 'resource/image/movebackward2.png';
            break;
        case 'ArrowUp':
            player.y -= 10;
            player.state = 'jumping';
            playerImage.src = 'resource/image/jump.png';
            if (player.y <= 300) {
                player.state = 'standing';
            }
            break;
        case 'ArrowDown':
            player.y = 420;
            player.state = 'sitting';
            playerImage.src = 'resource/image/sit.png';
            break;
        case 'Enter':
            shoot();
            break;
    }
});

function gameLoop() {
    update();
    draw();
    updatePlayer();
    requestAnimationFrame(gameLoop);
}

document.getElementById('backToMenuButton').onclick = function() {
    window.location.href = 'war.html'; // Quay lại menu chính
};

//Xu ly endgame
function endGame(){
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); //Luu diem so cao nhat
    }
    alert(`Game Over! Your score: ${score}`);
    window.location.href='war.html';
}


setInterval( createEnemy, 1000 );
setInterval( createGhost, 900);
gameLoop();