
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameBoard = document.querySelector('.game-board');

const startScreen = document.querySelector('#start-screen');
const gameOverScreen = document.querySelector('#game-over-screen');

const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');

const pointsDisplay = document.querySelector('#points');
const finalPointsDisplay = document.querySelector('#final-points');

let points = 0;
let gameRunning = false;
let loop;

// FUNÇÃO DE PULO
const jump = () => {
    if (!gameRunning || mario.classList.contains('jump')) {
        return;
    }

    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 900);
};

// INICIAR JOGO
const startGame = () => {
    clearInterval(loop);

    points = 0;
    pointsDisplay.textContent = points;

    gameRunning = true;

    startScreen.classList.add('hidden');
    gameOverScreen.classList.remove('show');

    gameBoard.classList.add('playing');

    // Reinicia a galinha
    mario.src = './images/galinha.gif';
    mario.style.width = '180px';
    mario.style.left = '0px';
    mario.style.right = 'auto';
    mario.style.marginLeft = '0px';
    mario.style.animation = '';
    mario.style.transform = 'translateY(0)';
    mario.classList.remove('jump');

    // Reinicia o cano
    pipe.style.animation = 'none';
    pipe.style.left = 'auto';
    pipe.style.right = '-80px';

    // Reinicia as nuvens
    clouds.style.animation = 'none';
    clouds.style.right = '-550px';

    // Reinicia as animações
    void pipe.offsetWidth;
    void clouds.offsetWidth;

    pipe.style.animation = 'pipe-animation 1.5s infinite linear';
    clouds.style.animation = 'clouds-animation 20s infinite linear';

    loop = setInterval(checkCollision, 10);
};

// VERIFICAR COLISÃO
const checkCollision = () => {
    if (!gameRunning) return;

    const pipeRect = pipe.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();

    // Margens para ignorar partes transparentes
    const margemHorizontalGalinha = 65;
    const margemHorizontalCano = 55;

    const marioLeft = marioRect.left + margemHorizontalGalinha;
    const marioRight = marioRect.right - margemHorizontalGalinha;
    const marioTop = marioRect.top + 25;
    const marioBottom = marioRect.bottom - 10;

    const pipeLeft = pipeRect.left + margemHorizontalCano;
    const pipeRight = pipeRect.right - margemHorizontalCano;
    const pipeTop = pipeRect.top + 20;

    const horizontalOverlap =
        marioRight > pipeLeft &&
        marioLeft < pipeRight;

    const verticalOverlap =
        marioBottom > pipeTop &&
        marioTop < pipeRect.bottom;

    if (horizontalOverlap && verticalOverlap) {
        endGame();
        return;
    }
};

// PONTUAÇÃO: 50 PONTOS POR PASSAGEM
pipe.addEventListener('animationiteration', () => {
    if (!gameRunning) return;

    points += 50;
    pointsDisplay.textContent = points;
});

// FIM DE JOGO
const endGame = () => {
    if (!gameRunning) return;

    gameRunning = false;
    clearInterval(loop);

    gameBoard.classList.remove('playing');

    mario.classList.remove('jump');

    // Congela o cano
    const pipeLeft = pipe.getBoundingClientRect().left;

    pipe.style.animation = 'none';
    pipe.style.left = `${pipeLeft}px`;
    pipe.style.right = 'auto';

    // Congela a galinha
    const marioLeft = mario.getBoundingClientRect().left;

    mario.style.animation = 'none';
    mario.style.left = `${marioLeft}px`;
    mario.style.right = 'auto';

    mario.src = './images/game-over.png';

    finalPointsDisplay.textContent = points;

    gameOverScreen.classList.add('show');
};

// BOTÕES
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// CONTROLES DO TECLADO
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (gameRunning) {
            event.preventDefault();
            jump();
        }
    }
});
