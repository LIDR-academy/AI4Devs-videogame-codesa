// Elementos del DOM
const gameContainer = document.getElementById('game-container');
const mainMenu = document.getElementById('main-menu');
const playButton = document.getElementById('play-button');
const helpButton = document.getElementById('help-button');
const instructionsDiv = document.getElementById('instructions');
const backButton = document.getElementById('back-button');
const menuReturnButton = document.getElementById('menu-return-button');
const winMenuButton = document.getElementById('win-menu-button');

const player = document.getElementById('player');
const ground = document.getElementById('ground');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const winScreen = document.getElementById('win-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const playAgainButton = document.getElementById('play-again-button');
const finalScoreElement = document.getElementById('final-score');
const winScoreElement = document.getElementById('win-score');

// Variables del juego
let isJumping = false;
let isGameRunning = false;
let gameSpeed = 5;
// Ajuste del salto - reducir altura del salto
let jumpHeight = 120; // Reducido de 150
let jumpDuration = 500;
// Ajuste del salto - modificar la gravedad para un salto menos alto
let gravity = 0.8; // Aumentado de 0.6 para que caiga más rápido
let playerVelocity = 0;
let playerRotation = 0;
let gameInterval;
let obstacleInterval;
let score = 0;
let distance = 0;
let lastCheckpointX = 100; // Posición inicial del jugador
let checkpoints = [];
let obstacles = [];
let worldWidth = 5000;
let gameStarted = false;

// Crear formas animadas para el fondo del menú
function createMenuBackground() {
    const shapes = ['square', 'triangle', 'circle'];
    const colors = ['#ff3366', '#00ffff', '#ffcc00', '#66ff66'];
    
    for (let i = 0; i < 20; i++) {
        const shape = document.createElement('div');
        shape.className = 'animated-shape';
        
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        shape.style.backgroundColor = color;
        shape.style.opacity = 0.1 + Math.random() * 0.2;
        
        if (shapeType === 'square') {
            shape.style.width = 20 + Math.random() * 30 + 'px';
            shape.style.height = shape.style.width;
        } else if (shapeType === 'triangle') {
            shape.style.width = '0';
            shape.style.height = '0';
            shape.style.borderLeft = 15 + Math.random() * 15 + 'px solid transparent';
            shape.style.borderRight = 15 + Math.random() * 15 + 'px solid transparent';
            shape.style.borderBottom = 25 + Math.random() * 25 + 'px solid ' + color;
            shape.style.backgroundColor = 'transparent';
        } else {
            shape.style.width = 20 + Math.random() * 30 + 'px';
            shape.style.height = shape.style.width;
            shape.style.borderRadius = '50%';
        }
        
        shape.style.left = Math.random() * mainMenu.offsetWidth + 'px';
        shape.style.top = Math.random() * mainMenu.offsetHeight + 'px';
        
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        const rotation = Math.random() * 2 - 1;
        
        mainMenu.appendChild(shape);
        
        // Animar la forma
        let posX = parseFloat(shape.style.left);
        let posY = parseFloat(shape.style.top);
        let angle = 0;
        
        setInterval(() => {
            posX += speedX;
            posY += speedY;
            angle += rotation;
            
            // Rebotar en los bordes
            if (posX < 0 || posX > mainMenu.offsetWidth) {
                posX = Math.max(0, Math.min(posX, mainMenu.offsetWidth));
                speedX = -speedX;
            }
            
            if (posY < 0 || posY > mainMenu.offsetHeight) {
                posY = Math.max(0, Math.min(posY, mainMenu.offsetHeight));
                speedY = -speedY;
            }
            
            shape.style.left = posX + 'px';
            shape.style.top = posY + 'px';
            shape.style.transform = `rotate(${angle}deg)`;
        }, 50);
    }
}

// Crea estrellas de fondo
function createStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * gameContainer.offsetWidth}px`;
        star.style.top = `${Math.random() * gameContainer.offsetHeight * 0.8}px`;
        star.style.opacity = Math.random();
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        gameContainer.appendChild(star);
    }
}

// Configuración inicial
function setupGame() {
    createStars();
    createObstacles();
    createCheckpoints();
    createFinishLine();
}

// Crea obstáculos
function createObstacles() {
    // Serie de obstáculos predefinidos, ahora con algunos obstáculos de la misma forma que el jugador
    const obstacleDefinitions = [
        { x: 400, width: 30, height: 30, type: 'box' },
        { x: 550, width: 40, height: 40, type: 'triangle' },
        { x: 700, width: 30, height: 50, type: 'box' },
        { x: 900, width: 40, height: 30, type: 'box' },
        { x: 1050, width: 40, height: 40, type: 'triangle' },
        // Obstáculo con la misma forma que el jugador (cuadrado)
        { x: 1200, width: 30, height: 30, type: 'same-shape' },
        { x: 1400, width: 30, height: 40, type: 'box' },
        { x: 1500, width: 40, height: 40, type: 'triangle' },
        { x: 1700, width: 30, height: 30, type: 'box' },
        // Otro obstáculo con la misma forma
        { x: 1800, width: 30, height: 30, type: 'same-shape' },
        { x: 2000, width: 50, height: 30, type: 'box' },
        { x: 2200, width: 30, height: 50, type: 'box' },
        { x: 2400, width: 40, height: 40, type: 'triangle' },
        { x: 2600, width: 30, height: 40, type: 'box' },
        // Más obstáculos del mismo tipo que el jugador
        { x: 2800, width: 30, height: 30, type: 'same-shape' },
        { x: 3000, width: 40, height: 40, type: 'triangle' },
        { x: 3200, width: 30, height: 40, type: 'box' },
        { x: 3400, width: 40, height: 30, type: 'box' },
        { x: 3600, width: 40, height: 40, type: 'triangle' },
        { x: 3800, width: 30, height: 50, type: 'box' },
        // Más obstáculos del mismo tipo
        { x: 4000, width: 30, height: 30, type: 'same-shape' },
        { x: 4200, width: 40, height: 40, type: 'triangle' },
        { x: 4400, width: 30, height: 40, type: 'box' }
    ];
    
    obstacleDefinitions.forEach(def => {
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        if (def.type === 'triangle') {
            obstacle.classList.add('triangle');
        } else if (def.type === 'same-shape') {
            obstacle.classList.add('same-shape');
            obstacle.style.width = `${def.width}px`;
            obstacle.style.height = `${def.height}px`;
        } else {
            obstacle.style.width = `${def.width}px`;
            obstacle.style.height = `${def.height}px`;
        }
        obstacle.style.left = `${def.x}px`;
        gameContainer.appendChild(obstacle);
        obstacles.push({
            element: obstacle,
            passed: false,
            x: def.x,
            width: def.width,
            height: def.height,
            type: def.type
        });
    });
}

// Crea puntos de control
function createCheckpoints() {
    // Definimos posiciones de puntos de control
    const checkpointPositions = [800, 1600, 2400, 3200, 4000];
    
    checkpointPositions.forEach((position, index) => {
        const checkpoint = document.createElement('div');
        checkpoint.className = 'checkpoint';
        checkpoint.style.left = `${position}px`;
        gameContainer.appendChild(checkpoint);
        checkpoints.push({
            element: checkpoint,
            x: position,
            reached: false,
            index: index + 1
        });
    });
}

// Crea línea de meta
function createFinishLine() {
    const finishLine = document.createElement('div');
    finishLine.id = 'finish-line';
    finishLine.style.left = `${worldWidth - 200}px`;
    gameContainer.appendChild(finishLine);
}

// Función para saltar
function jump() {
    if (!isJumping && isGameRunning) {
        isJumping = true;
        // Ajuste de la velocidad inicial del salto para que no sea tan alto
        playerVelocity = -12; // Reducido de -15
        
        // Crear efecto de partículas al saltar
        createJumpParticles();
        
        // Animación de rotación
        let rotationInterval = setInterval(() => {
            playerRotation += 90;
            if (playerRotation >= 360) {
                playerRotation = 0;
                clearInterval(rotationInterval);
            }
            player.style.transform = `rotate(${playerRotation}deg)`;
        }, 125);
    }
}

// Crear partículas al saltar
function createJumpParticles() {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particle.style.left = `${player.offsetLeft + player.offsetWidth / 2}px`;
        particle.style.bottom = `${player.offsetTop + player.offsetHeight}px`;
        
        gameContainer.appendChild(particle);
        
        const angle = Math.random() * Math.PI;
        const speed = 1 + Math.random() * 3;
        const speedX = Math.cos(angle) * speed;
        const speedY = Math.sin(angle) * speed;
        
        let opacity = 1;
        let posX = player.offsetLeft;
        let posY = player.offsetTop + player.offsetHeight;
        
        const particleInterval = setInterval(() => {
            posX += speedX;
            posY -= speedY;
            opacity -= 0.05;
            
            particle.style.left = `${posX}px`;
            particle.style.bottom = `${posY}px`;
            particle.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(particleInterval);
                gameContainer.removeChild(particle);
            }
        }, 20);
    }
}

// Función para reiniciar el juego
function resetGame(fromCheckpoint = false) {
    playerRotation = 0;
    player.style.transform = `rotate(${playerRotation}deg)`;
    
    if (!fromCheckpoint) {
        score = 0;
        scoreElement.textContent = score;
        distance = 0;
        lastCheckpointX = 100;
        
        // Reiniciar puntos de control
        checkpoints.forEach(checkpoint => {
            checkpoint.reached = false;
        });
        
        // Reiniciar obstáculos
        obstacles.forEach(obstacle => {
            obstacle.passed = false;
        });
    } else {
        distance = lastCheckpointX - 100; // Ajustar distancia basada en el último punto de control
    }
    
    player.style.bottom = '50px';
    isJumping = false;
    playerVelocity = 0;
    
    gameOverScreen.style.display = 'none';
    winScreen.style.display = 'none';
}

// Verificar colisiones - modificado para permitir pasar por encima de obstáculos del mismo tipo
function checkCollisions() {
    const playerRect = {
        x: 100,
        y: parseInt(player.style.bottom || '50'),
        width: player.offsetWidth,
        height: player.offsetHeight
    };
    
    // Verificar colisión con obstáculos
    for (const obstacle of obstacles) {
        if (obstacle.x - distance <= 120 && obstacle.x - distance >= 70 - obstacle.width) {
            const obstacleY = parseInt(ground.offsetHeight);
            const obstacleRect = {
                x: obstacle.x - distance,
                y: obstacleY,
                width: obstacle.width,
                height: obstacle.height
            };
            
            // Modificación para permitir pasar por encima de obstáculos del mismo tipo
            if (obstacle.type === 'same-shape') {
                // Solo detecta colisión si el jugador golpea el lado del obstáculo, no si salta encima
                const playerBottom = playerRect.y;
                const obstacleTop = obstacleY + obstacle.height;
                
                // Si el jugador está por encima del obstáculo, no hay colisión
                if (playerBottom >= obstacleTop) {
                    continue; // Pasa al siguiente obstáculo
                }
                
                // Colisión lateral con obstáculo del mismo tipo
                if (playerRect.x < obstacleRect.x + obstacleRect.width &&
                    playerRect.x + playerRect.width > obstacleRect.x &&
                    playerRect.y < obstacleY + obstacleRect.height &&
                    playerRect.y + playerRect.height > obstacleY) {
                    gameOver();
                    return;
                }
            } else if (obstacle.type === 'triangle') {
                // Ajuste para colisiones con triángulos
                if (playerRect.x < obstacleRect.x + 40 &&
                    playerRect.x + playerRect.width > obstacleRect.x &&
                    playerRect.y < obstacleY + 35 &&
                    playerRect.y + playerRect.height > obstacleY) {
                    gameOver();
                    return;
                }
            } else {
                if (playerRect.x < obstacleRect.x + obstacleRect.width &&
                    playerRect.x + playerRect.width > obstacleRect.x &&
                    playerRect.y < obstacleY + obstacleRect.height &&
                    playerRect.y + playerRect.height > obstacleY) {
                    gameOver();
                    return;
                }
            }
        }
    }
    
    // Verificar puntos de control
    for (const checkpoint of checkpoints) {
        if (!checkpoint.reached && checkpoint.x - distance <= 100 && checkpoint.x - distance >= 70) {
            checkpoint.reached = true;
            lastCheckpointX = checkpoint.x;
            score += 100 * checkpoint.index;
            scoreElement.textContent = score;
            
            // Efecto visual al pasar punto de control
            checkpoint.element.style.backgroundColor = 'gold';
            setTimeout(() => {
                checkpoint.element.style.background = 'linear-gradient(to bottom, #ffcc00, #ff6600)';
            }, 300);
        }
    }
    
    // Verificar línea de meta
    const finishLine = document.getElementById('finish-line');
    const finishX = parseInt(finishLine.style.left);
    
    if (finishX - distance <= 100 && finishX - distance >= 80) {
        winGame();
    }
}

// Función para terminar el juego (perder)
function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'flex';
}

// Función para ganar el juego
function winGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    // Bono por completar el nivel
    score += 1000;
    winScoreElement.textContent = score;
    winScreen.style.display = 'flex';
}

// Función para mostrar el menú principal
function showMainMenu() {
    gameContainer.style.display = 'none';
    mainMenu.style.display = 'flex';
    gameStarted = false;
    isGameRunning = false;
    if (gameInterval) {
        clearInterval(gameInterval);
    }
}

// Función para ir al juego desde el menú
function goToGame() {
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    if (!gameStarted) {
        // Mostrar pantalla de inicio
        startScreen.style.display = 'flex';
    } else {
        // Reiniciar juego si ya se había iniciado antes
        resetGame(false);
        startGame();
    }
}

// Función principal de actualización del juego
function updateGame() {
    if (!isGameRunning) return;
    
    // Aplicar gravedad
    if (isJumping) {
        playerVelocity += gravity;
        const newBottom = parseInt(player.style.bottom || '50') - playerVelocity;
        
        if (newBottom <= 50) {
            player.style.bottom = '50px';
            isJumping = false;
            playerVelocity = 0;
            playerRotation = 0;
            player.style.transform = `rotate(0deg)`;
        } else {
            player.style.bottom = `${newBottom}px`;
        }
    }
    
    // Mover el mundo
    distance += gameSpeed;
    
    // Actualizar posiciones de obstáculos y checkpoints
    obstacles.forEach(obstacle => {
        obstacle.element.style.left = `${obstacle.x - distance}px`;
    });
    
    checkpoints.forEach(checkpoint => {
        checkpoint.element.style.left = `${checkpoint.x - distance}px`;
    });
    
    const finishLine = document.getElementById('finish-line');
    finishLine.style.left = `${worldWidth - 200 - distance}px`;
    
    // Verificar colisiones
    checkCollisions();
    
    // Actualizar puntuación por distancia
    if (Math.floor(distance) % 100 === 0) {
        score += 1;
        scoreElement.textContent = score;
    }
}

// Iniciar juego
function startGame() {
    if (!gameStarted) {
        setupGame();
        gameStarted = true;
    }
    
    resetGame(gameStarted && lastCheckpointX > 100);
    isGameRunning = true;
    startScreen.style.display = 'none';
    
    gameInterval = setInterval(updateGame, 20);
}

// Mostrar instrucciones
function showInstructions() {
    document.getElementById('menu-buttons').style.display = 'none';
    instructionsDiv.style.display = 'block';
}

// Ocultar instrucciones
function hideInstructions() {
    instructionsDiv.style.display = 'none';
    document.getElementById('menu-buttons').style.display = 'flex';
}

// Event Listeners
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (mainMenu.style.display !== 'none') {
            // Si estamos en el menú principal, ir al juego
            goToGame();
        } else if (startScreen.style.display !== 'none') {
            // Si estamos en la pantalla de inicio, iniciar el juego
            startGame();
        } else {
            // Si estamos jugando, saltar
            jump();
        }
    }
    
    // Escape para volver al menú
    if (event.code === 'Escape' && mainMenu.style.display === 'none') {
        showMainMenu();
    }
});

// Botones del menú principal
playButton.addEventListener('click', goToGame);
helpButton.addEventListener('click', showInstructions);
backButton.addEventListener('click', hideInstructions);

// Botones de inicio y reinicio del juego
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', function() {
    resetGame(false);
    startGame();
});
playAgainButton.addEventListener('click', function() {
    resetGame(false);
    startGame();
});

// Botones para volver al menú principal
menuReturnButton.addEventListener('click', showMainMenu);
winMenuButton.addEventListener('click', showMainMenu);

// Inicializar menú principal
createMenuBackground();