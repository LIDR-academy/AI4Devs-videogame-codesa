// Variables del juego
let gallina = document.getElementById("gallina");
let sarten = document.getElementById("sarten");
let gameContainer = document.getElementById("gameContainer");
let scoreElement = document.getElementById("score");
let levelElement = document.getElementById("level");

// Configuración inicial
let score = 0;
let level = 1;
let gallinaPosX = 0;
let gallinaSpeed = 2; // Velocidad de la gallina
let sartenPosX = gameContainer.clientWidth / 2 - 40; // Posición inicial del sartén
let sartenSpeed = 4; // Velocidad del sartén
let gameWidth = gameContainer.clientWidth;
let gallinaWidth = gallina.offsetWidth;
let sartenWidth = sarten.offsetWidth;
let eggs = [];
let eggSpeed = 2; // Velocidad de caída de los huevos

// Función para mover la gallina de izquierda a derecha
function moveGallina() {
    gallinaPosX += gallinaSpeed;
    if (gallinaPosX + gallinaWidth > gameWidth || gallinaPosX < 0) {
        gallinaSpeed *= -1; // Cambiar dirección si la gallina llega al borde
    }
    gallina.style.left = gallinaPosX + "px";
}

// Función para mover el sartén con el mouse
function moveSartenWithMouse(event) {
    // Obtener la posición horizontal del mouse dentro del contenedor
    let mousePosX = event.clientX - gameContainer.offsetLeft;

    // Limitar la posición del sartén para que no se salga del escenario
    if (mousePosX >= 0 && mousePosX <= gameWidth - sartenWidth) {
        sartenPosX = mousePosX;
        sarten.style.left = sartenPosX + "px";
    }
}

// Función para generar y mover los huevos
function spawnEgg() {
    let egg = document.createElement("div");
    egg.classList.add("huevo");
    egg.style.left = gallinaPosX + gallinaWidth / 2 - 30 + "px"; // Colocar el huevo donde está la gallina
    egg.style.top = "80px"; // Posición inicial arriba
    gameContainer.appendChild(egg);
    eggs.push(egg);

    // Animar el huevo cayendo
    let eggPosY = 80;
    function fallEgg() {
        eggPosY += eggSpeed;
        egg.style.top = eggPosY + "px";

        // Verificar si el huevo tocó el sartén
        if (eggPosY >= gameContainer.clientHeight - 80 && eggPosY <= gameContainer.clientHeight - 40) {
            let eggPosX = parseFloat(egg.style.left); // Obtener la posición X del huevo
            if (eggPosX + 30 > sartenPosX && eggPosX + 30 < sartenPosX + sartenWidth) {
                score++; // Aumentar puntos cuando el huevo es atrapado
                scoreElement.textContent = "Puntos: " + score;
                egg.remove(); // Eliminar el huevo atrapado
                eggs = eggs.filter(e => e !== egg); // Eliminarlo del array
                return; // Salir de la función una vez que el huevo fue atrapado
            }
        }

        // Si el huevo se cae fuera de la pantalla sin ser atrapado
        if (eggPosY > gameContainer.clientHeight) {
            egg.remove();
            eggs = eggs.filter(e => e !== egg);
            return; // Salir de la función cuando el huevo ya no está visible
        }

        // Continuar la animación
        requestAnimationFrame(fallEgg); // Continuar la animación del huevo
    }
    fallEgg();
}

// Función para actualizar la puntuación y el nivel
function updateGameInfo() {
    scoreElement.textContent = "Puntos: " + score;
    levelElement.textContent = "Nivel: " + level;
    if (score >= level * 5) { // Incrementar nivel después de 5 puntos por nivel
        level++;
        eggSpeed += 0.2; // Aumentar velocidad de los huevos
    }
}

// Llamar a la función para mover la gallina, los huevos y el sartén
function gameLoop() {
    moveGallina();
    updateGameInfo();
    requestAnimationFrame(gameLoop);
}

// Configurar el control del sartén con el mouse
gameContainer.addEventListener("mousemove", moveSartenWithMouse);

// Iniciar el ciclo del juego
setInterval(spawnEgg, 2000); // Generar un huevo cada 2 segundos
gameLoop();
