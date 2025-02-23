document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameArea = document.getElementById('game-area');
    const bird = document.getElementById('bird');
    const scoreDisplay = document.getElementById('score');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScore = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    const flapSound = new Audio('assets/flap.wav');
    const scoreSound = new Audio('assets/score.wav');
    const hitSound = new Audio('assets/hit.wav');

    let birdY = gameArea.clientHeight / 2;
    let birdVelocity = 0;
    let gravity = 0.5;
    let jump = -8;
    let pipes = [];
    let pipeSpeed = 2;
    let pipeInterval = 2500;
    let pipeGap = 170; // Aumentamos el espacio entre las tuberías
    let score = 0;
    let gameInterval;
    let pipeIntervalId;
    let gameStarted = false; // Bandera para controlar si el juego ha comenzado

    function startGame() {
        startScreen.classList.remove('active');
        gameOverScreen.classList.remove('active');
        gameArea.classList.add('active');
        bird.style.top = `${birdY}px`;
        score = 0;
        scoreDisplay.textContent = score;
        pipes.forEach(pipe => pipe.element.remove());
        pipes = [];
        birdVelocity = 0;
        birdY = gameArea.clientHeight / 2;
        gameInterval = setInterval(updateGame, 20);
        pipeIntervalId = setInterval(createPipe, pipeInterval);
        gameStarted = true; // El juego ha comenzado
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(pipeIntervalId);
        gameArea.classList.remove('active');
        gameOverScreen.classList.add('active');
        finalScore.textContent = score;
        hitSound.play();
        gameStarted = false; // El juego ha terminado
    }

    function updateGame() {
        birdVelocity += gravity;
        birdY += birdVelocity;
        bird.style.top = `${birdY}px`;

        if (birdY + bird.clientHeight > gameArea.clientHeight || birdY < 0) {
            endGame();
        }

        pipes.forEach(pipe => {
            pipe.x -= pipeSpeed;
            pipe.element.style.left = `${pipe.x}px`;

            if (pipe.x + pipe.width < 0) {
                pipe.element.remove();
                pipes.shift();
            }

            // Check if the bird has passed the pipe
            if (!pipe.passed && pipe.x + pipe.width < bird.getBoundingClientRect().left) {
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = score;
                scoreSound.play();
            }

            if (isCollision(bird, pipe.element)) {
                endGame();
            }
        });
    }

    function createPipe() {
        const pipeHeight = Math.random() * (gameArea.clientHeight - pipeGap - 100) + 50;
        const pipeTop = document.createElement('div');
        pipeTop.classList.add('pipe', 'top');
        pipeTop.style.height = `${pipeHeight}px`;
        pipeTop.style.left = `${gameArea.clientWidth}px`;

        const pipeBottom = document.createElement('div');
        pipeBottom.classList.add('pipe', 'bottom');
        pipeBottom.style.height = `${gameArea.clientHeight - pipeHeight - pipeGap}px`;
        pipeBottom.style.left = `${gameArea.clientWidth}px`;

        gameArea.appendChild(pipeTop);
        gameArea.appendChild(pipeBottom);

        pipes.push({ element: pipeTop, x: gameArea.clientWidth, width: 60, passed: false });
        pipes.push({ element: pipeBottom, x: gameArea.clientWidth, width: 60, passed: false });
    }

    function isCollision(bird, pipe) {
        const birdRect = bird.getBoundingClientRect();
        const pipeRect = pipe.getBoundingClientRect();

        return !(
            birdRect.top > pipeRect.bottom ||
            birdRect.bottom < pipeRect.top ||
            birdRect.left > pipeRect.right ||
            birdRect.right < pipeRect.left
        );
    }

    function fly() {
        if (gameStarted) { // Solo reproducir el sonido si el juego ha comenzado
            birdVelocity = jump;
            flapSound.play();
        }
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            fly();
        }
    });
    document.addEventListener('click', fly);
});
