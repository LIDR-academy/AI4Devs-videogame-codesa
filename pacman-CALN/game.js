class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.lives = 3;
        this.gameLoop = null;
        this.cellSize = 16;
        
        // Configurar tamaño del canvas
        this.canvas.width = 448;  // 28 celdas * 16px (reducido de 560)
        this.canvas.height = 496; // 31 celdas * 16px (reducido de 620)
        
        // Estados del juego
        this.gameState = 'start';
        
        // Añadir high score
        this.highScore = localStorage.getItem('pacmanHighScore') || 0;
        document.getElementById('high-score').textContent = this.highScore;
        
        // Añadir efectos de sonido del estilo Google
        this.sounds = {
            start: new Audio('https://raw.githubusercontent.com/google/pacman/master/src/sounds/game_start.mp3'),
            death: new Audio('https://raw.githubusercontent.com/google/pacman/master/src/sounds/death.mp3'),
            eatDot: new Audio('https://raw.githubusercontent.com/google/pacman/master/src/sounds/eating.short.mp3'),
            eatGhost: new Audio('https://raw.githubusercontent.com/google/pacman/master/src/sounds/eating.ghost.mp3'),
            powerPellet: new Audio('https://raw.githubusercontent.com/google/pacman/master/src/sounds/power_pellet.mp3'),
            levelComplete: new Audio('https://raw.githubusercontent.com/google/pacman/master/src/sounds/level_complete.mp3')
        };
        
        // Nivel actual
        this.level = 1;
        this.gamePaused = false;
        
        // Añadir animaciones
        this.animations = {
            powerMode: false,
            gameStarting: true
        };
        
        // Ajustar la velocidad del juego
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        this.lastFrameTime = 0;
        
        // Mejorar control de movimiento
        this.keyState = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        
        // Inicializar componentes
        this.initializeGame();

        // Añadir manejo de redimensionamiento
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        const container = document.querySelector('.game-container');
        const containerWidth = container.offsetWidth;
        
        // Ajustar el tamaño del canvas manteniendo la proporción
        this.canvas.style.width = `${Math.min(containerWidth, 400)}px`; // Limitar a 400px
        this.canvas.style.height = 'auto';

        // Mantener las dimensiones internas del canvas
        this.canvas.width = 448;  // 28 celdas * 16px
        this.canvas.height = 496; // 31 celdas * 16px

        // Recalcular el tamaño de celda
        this.cellSize = this.canvas.width / 28;

        // Redibujar todo
        if (this.gameState === 'playing') {
            this.draw();
        }
    }

    initializeGame() {
        // Inicializar Pac-Man con velocidad ajustada
        this.pacman = {
            x: 14 * this.cellSize,
            y: 23 * this.cellSize,
            direction: 'right',
            nextDirection: 'right',
            speed: 3, // Aumentado de 2 a 3
            radius: this.cellSize / 2 - 2, // Ligeramente más pequeño
            mouthOpen: 0.2,
            mouthDir: 1
        };

        // Inicializar fantasmas
        this.ghosts = this.createGhosts();
        
        // Inicializar mapa y puntos
        this.initializeMap();
        
        // Event listeners
        this.setupEventListeners();
    }

    createGhosts() {
        return [
            {
                color: 'red',
                x: 14 * this.cellSize,
                y: 11 * this.cellSize,
                direction: 'up',
                speed: 2,
                mode: 'chase', // chase, scatter, frightened
                targetTile: {x: 0, y: 0},
                isVulnerable: false
            },
            {
                color: 'pink',
                x: 13 * this.cellSize,
                y: 14 * this.cellSize,
                direction: 'up',
                speed: 2,
                mode: 'chase',
                targetTile: {x: 0, y: 0},
                isVulnerable: false
            },
            {
                color: 'cyan',
                x: 14 * this.cellSize,
                y: 14 * this.cellSize,
                direction: 'up',
                speed: 2,
                mode: 'chase',
                targetTile: {x: 0, y: 0},
                isVulnerable: false
            },
            {
                color: 'orange',
                x: 15 * this.cellSize,
                y: 14 * this.cellSize,
                direction: 'up',
                speed: 2,
                mode: 'chase',
                targetTile: {x: 0, y: 0},
                isVulnerable: false
            }
        ];
    }

    initializeMap() {
        // 0 = pared, 1 = punto, 2 = power pellet, 3 = vacío
        this.map = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
            [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
            [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,3,3,3,3,3,3,0,1,0,0,1,0,0,0,0,0,0],
            [3,3,3,3,3,3,1,1,1,1,0,3,3,3,3,3,3,0,1,1,1,1,3,3,3,3,3,3],
            [0,0,0,0,0,0,1,0,0,1,0,3,3,3,3,3,3,0,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
            [0,2,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,2,0],
            [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
            [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
            [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
            [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];

        // Inicializar array para los puntos
        this.dots = [];
        this.powerPellets = [];
        
        // Crear puntos basados en el mapa
        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                if(this.map[y][x] === 1) {
                    this.dots.push({
                        x: x * this.cellSize + this.cellSize/2,
                        y: y * this.cellSize + this.cellSize/2,
                        eaten: false
                    });
                } else if(this.map[y][x] === 2) {
                    this.powerPellets.push({
                        x: x * this.cellSize + this.cellSize/2,
                        y: y * this.cellSize + this.cellSize/2,
                        eaten: false
                    });
                }
            }
        }
    }

    setupEventListeners() {
        // Mejorar la detección de teclas
        document.addEventListener('keydown', (e) => {
            if (this.keyState.hasOwnProperty(e.key)) {
                this.keyState[e.key] = true;
                
                // Actualizar dirección inmediatamente
                switch(e.key) {
                    case 'ArrowUp':
                        if (this.canChangeDirection('up')) {
                            this.pacman.nextDirection = 'up';
                            this.pacman.direction = 'up';
                        } else {
                            this.pacman.nextDirection = 'up';
                        }
                        break;
                    case 'ArrowDown':
                        if (this.canChangeDirection('down')) {
                            this.pacman.nextDirection = 'down';
                            this.pacman.direction = 'down';
                        } else {
                            this.pacman.nextDirection = 'down';
                        }
                        break;
                    case 'ArrowLeft':
                        if (this.canChangeDirection('left')) {
                            this.pacman.nextDirection = 'left';
                            this.pacman.direction = 'left';
                        } else {
                            this.pacman.nextDirection = 'left';
                        }
                        break;
                    case 'ArrowRight':
                        if (this.canChangeDirection('right')) {
                            this.pacman.nextDirection = 'right';
                            this.pacman.direction = 'right';
                        } else {
                            this.pacman.nextDirection = 'right';
                        }
                        break;
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.keyState.hasOwnProperty(e.key)) {
                this.keyState[e.key] = false;
            }
        });

        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('restart-button').addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.gameState = 'playing';
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        this.playSound('start');
        
        this.gamePaused = true;
        setTimeout(() => {
            this.gamePaused = false;
            // Usar requestAnimationFrame en lugar de setInterval
            this.gameLoop = requestAnimationFrame(this.update.bind(this));
        }, 2000);
    }

    update(timestamp) {
        if (this.gamePaused) {
            this.draw();
            this.gameLoop = requestAnimationFrame(this.update.bind(this));
            return;
        }

        // Control de FPS
        if (timestamp - this.lastFrameTime < this.frameInterval) {
            this.gameLoop = requestAnimationFrame(this.update.bind(this));
            return;
        }
        this.lastFrameTime = timestamp;

        this.movePacman();
        this.moveGhosts();
        this.checkCollisions();
        this.draw();

        this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }

    canChangeDirection(newDirection) {
        let nextX = this.pacman.x;
        let nextY = this.pacman.y;
        
        // Calcular la siguiente posición basada en la nueva dirección
        switch(newDirection) {
            case 'right':
                nextX += this.pacman.speed;
                break;
            case 'left':
                nextX -= this.pacman.speed;
                break;
            case 'up':
                nextY -= this.pacman.speed;
                break;
            case 'down':
                nextY += this.pacman.speed;
                break;
        }

        const nextCell = {
            x: Math.floor(nextX / this.cellSize),
            y: Math.floor(nextY / this.cellSize)
        };

        return this.canMove(nextCell.x, nextCell.y);
    }

    movePacman() {
        // Intentar cambiar a la siguiente dirección si está disponible
        if (this.pacman.nextDirection !== this.pacman.direction) {
            if (this.canChangeDirection(this.pacman.nextDirection)) {
                this.pacman.direction = this.pacman.nextDirection;
            }
        }

        // Calcular la siguiente posición
        let nextX = this.pacman.x;
        let nextY = this.pacman.y;
        
        switch(this.pacman.direction) {
            case 'right':
                nextX += this.pacman.speed;
                break;
            case 'left':
                nextX -= this.pacman.speed;
                break;
            case 'up':
                nextY -= this.pacman.speed;
                break;
            case 'down':
                nextY += this.pacman.speed;
                break;
        }

        // Verificar si puede moverse
        const nextCell = {
            x: Math.floor(nextX / this.cellSize),
            y: Math.floor(nextY / this.cellSize)
        };

        if (this.canMove(nextCell.x, nextCell.y)) {
            this.pacman.x = nextX;
            this.pacman.y = nextY;
        }

        // Manejar teletransportación en túneles
        if (this.pacman.x < -this.cellSize) {
            this.pacman.x = this.canvas.width + this.cellSize;
        } else if (this.pacman.x > this.canvas.width + this.cellSize) {
            this.pacman.x = -this.cellSize;
        }

        // Animación de la boca
        this.pacman.mouthOpen += 0.15 * this.pacman.mouthDir;
        if (this.pacman.mouthOpen >= 0.5 || this.pacman.mouthOpen <= 0) {
            this.pacman.mouthDir *= -1;
        }

        // Verificar colisiones
        this.checkDotCollision();
        this.checkPowerPelletCollision();
    }

    canMove(x, y) {
        // Verificar límites del mapa
        if (x < 0 || x >= this.map[0].length || y < 0 || y >= this.map.length) {
            return false;
        }
        // Retornar true si no es una pared (0)
        return this.map[y][x] !== 0;
    }

    checkDotCollision() {
        const pacmanCell = {
            x: Math.floor(this.pacman.x / this.cellSize),
            y: Math.floor(this.pacman.y / this.cellSize)
        };

        this.dots.forEach(dot => {
            if (!dot.eaten) {
                const dotCell = {
                    x: Math.floor(dot.x / this.cellSize),
                    y: Math.floor(dot.y / this.cellSize)
                };

                if (pacmanCell.x === dotCell.x && pacmanCell.y === dotCell.y) {
                    dot.eaten = true;
                    this.score += 10;
                    this.playSound('eatDot');
                }
            }
        });
    }

    checkPowerPelletCollision() {
        const pacmanCell = {
            x: Math.floor(this.pacman.x / this.cellSize),
            y: Math.floor(this.pacman.y / this.cellSize)
        };

        this.powerPellets.forEach(pellet => {
            if (!pellet.eaten) {
                const pelletCell = {
                    x: Math.floor(pellet.x / this.cellSize),
                    y: Math.floor(pellet.y / this.cellSize)
                };

                if (pacmanCell.x === pelletCell.x && pacmanCell.y === pelletCell.y) {
                    pellet.eaten = true;
                    this.score += 50;
                    this.activatePowerMode();
                }
            }
        });
    }

    activatePowerMode() {
        // Activar modo poder
        this.animations.powerMode = true;
        document.getElementById('gameCanvas').classList.add('power-mode');
        
        this.ghosts.forEach(ghost => {
            ghost.isVulnerable = true;
            ghost.speed *= 0.8; // Fantasmas más lentos cuando son vulnerables
        });

        this.playSound('powerPellet');

        // Desactivar después de 10 segundos
        setTimeout(() => {
            this.animations.powerMode = false;
            document.getElementById('gameCanvas').classList.remove('power-mode');
            this.ghosts.forEach(ghost => {
                ghost.isVulnerable = false;
                ghost.speed /= 0.8; // Restaurar velocidad normal
            });
        }, 10000);
    }

    moveGhosts() {
        this.ghosts.forEach((ghost, index) => {
            // Actualizar el objetivo del fantasma
            this.updateGhostTarget(ghost, index);
            
            // Obtener la siguiente dirección basada en el objetivo
            const nextDirection = this.getNextGhostDirection(ghost);
            
            // Actualizar posición del fantasma
            switch(nextDirection) {
                case 'up':
                    if(this.canGhostMove(ghost.x, ghost.y - ghost.speed)) {
                        ghost.y -= ghost.speed;
                        ghost.direction = 'up';
                    }
                    break;
                case 'down':
                    if(this.canGhostMove(ghost.x, ghost.y + ghost.speed)) {
                        ghost.y += ghost.speed;
                        ghost.direction = 'down';
                    }
                    break;
                case 'left':
                    if(this.canGhostMove(ghost.x - ghost.speed, ghost.y)) {
                        ghost.x -= ghost.speed;
                        ghost.direction = 'left';
                    }
                    break;
                case 'right':
                    if(this.canGhostMove(ghost.x + ghost.speed, ghost.y)) {
                        ghost.x += ghost.speed;
                        ghost.direction = 'right';
                    }
                    break;
            }

            // Manejar teletransportación en túneles
            if (ghost.x < 0) {
                ghost.x = this.canvas.width - this.cellSize;
            } else if (ghost.x >= this.canvas.width) {
                ghost.x = 0;
            }
        });
    }

    updateGhostTarget(ghost, index) {
        if (ghost.isVulnerable) {
            // En modo asustado, moverse aleatoriamente
            ghost.targetTile = {
                x: Math.floor(Math.random() * this.map[0].length),
                y: Math.floor(Math.random() * this.map.length)
            };
            return;
        }

        const pacmanTile = {
            x: Math.floor(this.pacman.x / this.cellSize),
            y: Math.floor(this.pacman.y / this.cellSize)
        };

        switch(index) {
            case 0: // Rojo - persigue directamente a Pac-Man
                ghost.targetTile = {...pacmanTile};
                break;
            case 1: // Rosa - apunta 4 casillas adelante de Pac-Man
                ghost.targetTile = {...pacmanTile};
                switch(this.pacman.direction) {
                    case 'up': ghost.targetTile.y -= 4; break;
                    case 'down': ghost.targetTile.y += 4; break;
                    case 'left': ghost.targetTile.x -= 4; break;
                    case 'right': ghost.targetTile.x += 4; break;
                }
                break;
            case 2: // Cyan - comportamiento intermedio
                ghost.targetTile = {
                    x: pacmanTile.x + (Math.random() > 0.5 ? 2 : -2),
                    y: pacmanTile.y + (Math.random() > 0.5 ? 2 : -2)
                };
                break;
            case 3: // Naranja - se aleja si está cerca, persigue si está lejos
                const distance = Math.sqrt(
                    Math.pow(ghost.x - this.pacman.x, 2) + 
                    Math.pow(ghost.y - this.pacman.y, 2)
                );
                if (distance < 8 * this.cellSize) {
                    ghost.targetTile = {x: 0, y: this.map.length - 1}; // Esquina inferior izquierda
                } else {
                    ghost.targetTile = {...pacmanTile};
                }
                break;
        }
    }

    getNextGhostDirection(ghost) {
        const directions = ['up', 'down', 'left', 'right'];
        const currentTile = {
            x: Math.floor(ghost.x / this.cellSize),
            y: Math.floor(ghost.y / this.cellSize)
        };

        let bestDirection = ghost.direction;
        let shortestDistance = Infinity;

        directions.forEach(direction => {
            let nextTile = {...currentTile};
            switch(direction) {
                case 'up': nextTile.y--; break;
                case 'down': nextTile.y++; break;
                case 'left': nextTile.x--; break;
                case 'right': nextTile.x++; break;
            }

            if (this.canGhostMove(nextTile.x * this.cellSize, nextTile.y * this.cellSize)) {
                const distance = Math.sqrt(
                    Math.pow(nextTile.x - ghost.targetTile.x, 2) + 
                    Math.pow(nextTile.y - ghost.targetTile.y, 2)
                );

                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    bestDirection = direction;
                }
            }
        });

        return bestDirection;
    }

    canGhostMove(x, y) {
        const tileX = Math.floor(x / this.cellSize);
        const tileY = Math.floor(y / this.cellSize);

        if (tileX < 0 || tileX >= this.map[0].length || tileY < 0 || tileY >= this.map.length) {
            return false;
        }

        return this.map[tileY][tileX] !== 0;
    }

    checkCollisions() {
        const pacmanCell = {
            x: Math.floor(this.pacman.x / this.cellSize),
            y: Math.floor(this.pacman.y / this.cellSize)
        };

        // Verificar colisiones con fantasmas
        this.ghosts.forEach(ghost => {
            const ghostCell = {
                x: Math.floor(ghost.x / this.cellSize),
                y: Math.floor(ghost.y / this.cellSize)
            };

            if (pacmanCell.x === ghostCell.x && pacmanCell.y === ghostCell.y) {
                if (ghost.isVulnerable) {
                    // Comer fantasma
                    this.score += 200;
                    ghost.x = 14 * this.cellSize;
                    ghost.y = 11 * this.cellSize;
                    ghost.isVulnerable = false;
                    this.playSound('eatGhost');
                } else {
                    // Perder vida
                    this.lives--;
                    this.playSound('death');
                    if (this.lives <= 0) {
                        this.gameOver();
                    } else {
                        this.resetPositions();
                    }
                }
            }
        });

        // Verificar si se han comido todos los puntos
        const remainingDots = this.dots.filter(dot => !dot.eaten).length;
        const remainingPowerPellets = this.powerPellets.filter(pellet => !pellet.eaten).length;
        
        if (remainingDots === 0 && remainingPowerPellets === 0) {
            this.levelComplete();
        }
    }

    resetPositions() {
        // Resetear posición de Pac-Man
        this.pacman.x = 14 * this.cellSize;
        this.pacman.y = 23 * this.cellSize;
        this.pacman.direction = 'right';
        this.pacman.nextDirection = 'right';

        // Resetear posiciones de fantasmas
        this.ghosts[0].x = 14 * this.cellSize;
        this.ghosts[0].y = 11 * this.cellSize;
        this.ghosts[1].x = 13 * this.cellSize;
        this.ghosts[1].y = 14 * this.cellSize;
        this.ghosts[2].x = 14 * this.cellSize;
        this.ghosts[2].y = 14 * this.cellSize;
        this.ghosts[3].x = 15 * this.cellSize;
        this.ghosts[3].y = 14 * this.cellSize;

        // Pequeña pausa antes de continuar
        this.gamePaused = true;
        setTimeout(() => {
            this.gamePaused = false;
        }, 1000);
    }

    levelComplete() {
        this.level++;
        this.score += 1000; // Bonus por completar nivel
        this.playSound('levelComplete');
        
        // Aumentar dificultad
        this.ghosts.forEach(ghost => {
            ghost.speed += 0.5;
        });

        // Reiniciar nivel
        this.dots.forEach(dot => dot.eaten = false);
        this.powerPellets.forEach(pellet => pellet.eaten = false);
        this.resetPositions();
    }

    draw() {
        if (this.gamePaused) {
            this.drawPauseScreen();
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Ajustar para retina displays
        const scale = window.devicePixelRatio;
        this.ctx.scale(scale, scale);
        
        this.drawMaze();
        this.drawPacman();
        this.drawGhosts();
        this.drawUI();
        
        // Restaurar escala
        this.ctx.scale(1/scale, 1/scale);
    }

    drawPacman() {
        this.ctx.save();
        this.ctx.translate(this.pacman.x, this.pacman.y);
        
        // Rotar según la dirección
        let rotation = 0;
        switch(this.pacman.direction) {
            case 'up':
                rotation = -Math.PI/2;
                break;
            case 'down':
                rotation = Math.PI/2;
                break;
            case 'left':
                rotation = Math.PI;
                break;
            case 'right':
                rotation = 0;
                break;
        }
        this.ctx.rotate(rotation);

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.pacman.radius, this.pacman.mouthOpen * Math.PI, (2 - this.pacman.mouthOpen) * Math.PI);
        this.ctx.lineTo(0, 0);
        this.ctx.fillStyle = 'yellow';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawGhosts() {
        this.ghosts.forEach(ghost => {
            if (ghost.isVulnerable) {
                // Animación parpadeante para fantasmas vulnerables
                const blinkRate = Date.now() % 1000 < 500;
                this.ctx.fillStyle = blinkRate ? 'blue' : 'white';
            }
            this.ctx.beginPath();
            
            // Cuerpo del fantasma
            this.ctx.fillStyle = ghost.isVulnerable ? 'blue' : ghost.color;
            
            // Semicírculo superior
            this.ctx.arc(ghost.x, ghost.y, this.cellSize/2, Math.PI, 0, false);
            
            // Base ondulada
            const baseY = ghost.y + this.cellSize/2;
            this.ctx.lineTo(ghost.x + this.cellSize/2, baseY);
            
            // Ondulaciones en la base
            for(let i = 0; i < 3; i++) {
                const curveX = ghost.x + this.cellSize/2 - (i + 1) * (this.cellSize/3);
                this.ctx.quadraticCurveTo(
                    curveX + this.cellSize/6, 
                    baseY + (i % 2 === 0 ? 5 : -5),
                    curveX, 
                    baseY
                );
            }
            
            this.ctx.fill();
            
            // Ojos
            const eyeOffset = this.cellSize/6;
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(ghost.x - eyeOffset, ghost.y - eyeOffset, 4, 0, Math.PI * 2);
            this.ctx.arc(ghost.x + eyeOffset, ghost.y - eyeOffset, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Pupilas
            this.ctx.fillStyle = 'black';
            this.ctx.beginPath();
            this.ctx.arc(ghost.x - eyeOffset, ghost.y - eyeOffset, 2, 0, Math.PI * 2);
            this.ctx.arc(ghost.x + eyeOffset, ghost.y - eyeOffset, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawMaze() {
        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                if(this.map[y][x] === 0) {
                    this.ctx.fillStyle = 'blue';
                    this.ctx.fillRect(
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }

        // Dibujar puntos
        this.ctx.fillStyle = 'white';
        this.dots.forEach(dot => {
            if(!dot.eaten) {
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // Dibujar power pellets
        this.ctx.fillStyle = 'white';
        this.powerPellets.forEach(pellet => {
            if(!pellet.eaten) {
                this.ctx.beginPath();
                this.ctx.arc(pellet.x, pellet.y, 6, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    drawUI() {
        // Actualizar puntuación y vidas
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;

        // Dibujar nivel actual con fuente más pequeña
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial'; // Reducido de 20px a 16px
        this.ctx.fillText(`Nivel: ${this.level}`, 8, this.canvas.height - 8);

        // Dibujar vidas restantes más pequeñas
        for (let i = 0; i < this.lives; i++) {
            this.ctx.beginPath();
            this.ctx.arc(
                40 + i * 24, // Reducido de 50 + i * 30
                this.canvas.height - 20, // Reducido de 25
                8, // Reducido de 10
                0.2 * Math.PI,
                1.8 * Math.PI
            );
            this.ctx.lineTo(40 + i * 24, this.canvas.height - 20);
            this.ctx.fillStyle = 'yellow';
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '32px Arial'; // Reducido de 40px a 32px
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡Preparado!', this.canvas.width/2, this.canvas.height/2);
        this.ctx.textAlign = 'left';
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameState = 'gameOver';
        
        // Actualizar high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pacmanHighScore', this.highScore);
            document.getElementById('final-high-score').textContent = this.highScore;
        }
        
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('final-score').textContent = this.score;
        
        // Animación de game over
        this.playDeathAnimation();
    }

    playDeathAnimation() {
        let angle = 0;
        const deathAnimation = setInterval(() => {
            this.ctx.save();
            this.ctx.translate(this.pacman.x, this.pacman.y);
            this.ctx.rotate(angle);
            this.drawPacman();
            this.ctx.restore();
            
            angle += 0.2;
            if (angle >= Math.PI * 2) {
                clearInterval(deathAnimation);
            }
        }, 50);
    }

    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.initializeGame();
        document.getElementById('game-over-screen').classList.add('hidden');
        this.startGame();
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(error => console.log('Error playing sound:', error));
        }
    }
}

// Iniciar el juego cuando se carga la página
window.onload = () => {
    const game = new Game();
}; 