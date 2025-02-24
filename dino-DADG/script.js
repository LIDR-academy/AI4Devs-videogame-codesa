// Selección del Canvas y contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuración inicial
canvas.width = 800;
canvas.height = 300;
let gameOver = false;
let score = 0;
let gameSpeed = 5;

// Carga de imágenes
const dinoImg = new Image();
dinoImg.src = "./assets/dinno.png"; // Sprite del Dino
const cactusImg = new Image();
cactusImg.src = "./assets/cactus.png"; // Sprite del Cactus

// Clases de Juego
class Dino {
    constructor() {
        this.x = 50;
        this.y = canvas.height - 70;
        this.width = 50;
        this.height = 50;
        this.dy = 0;
        this.gravity = 0.5;
        this.jumpStrength = -10;
        this.grounded = true;
    }

    jump() {
        if (this.grounded) {
            this.dy = this.jumpStrength;
            this.grounded = false;
        }
    }

    update() {
        this.y += this.dy;
        this.dy += this.gravity;

        if (this.y >= canvas.height - 70) {
            this.y = canvas.height - 70;
            this.grounded = true;
        }
    }

    draw() {
        ctx.drawImage(dinoImg, this.x, this.y, this.width, this.height);
    }
}

class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height - 50;
        this.width = 40;
        this.height = 50;
        this.speed = gameSpeed;
    }

    update() {
        this.x -= this.speed;
    }

    draw() {
        ctx.drawImage(cactusImg, this.x, this.y, this.width, this.height);
    }
}

// Inicialización
const dino = new Dino();
const obstacles = [];

function spawnObstacle() {
    obstacles.push(new Obstacle());
}

// Detección de colisión
function checkCollision(dino, obstacle) {
    return (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x &&
        dino.y < obstacle.y + obstacle.height &&
        dino.y + dino.height > obstacle.y
    );
}

// Lógica principal del juego
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dino.update();
    dino.draw();

    // Obstáculos
    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        obstacle.draw();

        // Detectar colisión
        if (checkCollision(dino, obstacle)) {
            gameOver = true;
            document.getElementById("gameOver").classList.remove("hidden");
        }

        // Eliminar obstáculos fuera de pantalla
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }
    });

    // Aumentar dificultad progresivamente
    if (score % 10 === 0) {
        gameSpeed += 0.001;
    }

    // Mostrar puntaje
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Puntos: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Controles
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (gameOver) {
            restartGame();
        } else {
            dino.jump();
        }
    }
});

// Reinicio del juego
function restartGame() {
    gameOver = false;
    document.getElementById("gameOver").classList.add("hidden");
    obstacles.length = 0;
    score = 0;
    gameSpeed = 5;
    gameLoop();
}

// Generar obstáculos cada 1.5 segundos
setInterval(spawnObstacle, 1500);

// Iniciar el juego
gameLoop();
