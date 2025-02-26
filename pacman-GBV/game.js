const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,0,0,1,2,1,0,0,2,2,2,2,0,0,1,2,1,0,0,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,0,0,1,2,1,0,0,2,2,2,2,0,0,1,2,1,0,0,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const pacman = {
    x: 1,
    y: 1,
    lives: 3,
    score: 0
};

const ghosts = [
    { x: 10, y: 10, color: 'red' },
    { x: 12, y: 10, color: 'pink' },
    { x: 10, y: 12, color: 'cyan' },
    { x: 12, y: 12, color: 'orange' },
    { x: 11, y: 11, color: 'green' }
];

let gameInterval;
let startTime;
let isPaused = false;

document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('visible');
    initializeGame();
    gameInterval = setInterval(updateGame, 100);
    startTime = Date.now();
}

function initializeGame() {
    const mazeElement = document.getElementById('maze');
    mazeElement.innerHTML = '';
    
    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            
            if (cell === 1) cellElement.classList.add('wall');
            if (cell === 2) cellElement.classList.add('pac-dot');
            if (cell === 3) cellElement.classList.add('power-pellet');
            
            mazeElement.appendChild(cellElement);
        });
    });
}

function updateGame() {
    if (isPaused) return;
    
    movePacman();
    moveGhosts();
    checkCollisions();
    updateGameUI();
}

function movePacman() {
    // Implementar lógica de movimiento de Pacman
}

function moveGhosts() {
    // Implementar lógica de movimiento de los fantas
}