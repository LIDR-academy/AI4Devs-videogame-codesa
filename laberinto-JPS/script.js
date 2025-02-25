// Variables globales
const canvas = document.getElementById("laberinto");
const ctx = canvas.getContext("2d");

// Variables de velocidad de enemigos
let velocidadEnemigos = 1000; // Milisegundos (se ajustará con la dificultad)
let intervalEnemigos; // Intervalo de movimiento de enemigos
let tamanoCelda = 32;
let balasJugador = 30;
let direccionJugador = "right";
// Lista de balas en pantalla
let balas = [];
let gameAudio = new Audio("audio/movimiento.mp3");
gameAudio.loop = true;

// Ajustar velocidad según la dificultad
function ajustarVelocidadEnemigos() {
    let velocidad;
    if (dificultad === "facil") velocidad = 700;
    else if (dificultad === "medio") velocidad = 400;
    else if (dificultad === "dificil") velocidad = 200;

    setInterval(() => {
        moverEnemigos();
    }, velocidad);
}

const tileSize = 32; // Tamaño de cada celda del laberinto

let laberinto = [];
let jugador = { x: 1, y: 1, vidas: 3, balas: 30 };
let enemigos = [];
let balasBeneficio = [];
let tesoro = { x: 0, y: 0 };
let dificultad = "facil";
let gameRunning = false;
const keys = {};

// Cargar imágenes
const imgJugador = new Image();
imgJugador.src = "assets/jugador.png";
const imgTesoro = new Image();
imgTesoro.src = "assets/tesoro.png";
const imgBala = new Image();
imgBala.src = "assets/bala.png";
const imgEnemigo = new Image();
imgEnemigo.src = "assets/enemy.png";
const imgFondo = new Image();
imgFondo.src = "assets/fondo.png";

// Función para determinar la cantidad de enemigos según la dificultad
function definirCantidadEnemigos() {
    switch (dificultad) {
        case "facil":
            return 2;
        case "medio":
            return 4;
        case "dificil":
            return 6;
        default:
            return 2;
    }
}

// Inicializar juego
function iniciarJuego(nivelDificultad) {
	document.getElementById("menu").classList.add("hidden");
    document.getElementById("juego").classList.remove("hidden");
	dificultad = nivelDificultad;
    
    
    generarLaberinto();
    colocarElementos();
    generarEnemigos();  // Generar enemigos según la dificultad
    ajustarVelocidadEnemigos();
    gameAudio.play();
    gameRunning = true;
    requestAnimationFrame(actualizarJuego);
    
    iniciarMovimientoEnemigos();
}
/*
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("gameCanvas").style.display = "none";
});
*/
// Generación de laberinto según la dificultad
function generarLaberinto() {
    let tamaño = dificultad === "facil" ? 15 : dificultad === "medio" ? 23 : 29;
    canvas.width = tamaño * tileSize;
    canvas.height = tamaño * tileSize;

    let intento = 0;
    let maxIntentos = 100; // Límite para evitar bucles infinitos
    let caminoValido = false;
    
    while (!caminoValido && intento < maxIntentos) {
        intento++;
        
        // Inicializar laberinto lleno de paredes
        laberinto = Array.from({ length: tamaño }, () => Array(tamaño).fill(1));
        
        // Generar camino usando DFS (Backtracking)
        function crearCamino(x, y) {
            let direcciones = [
                { dx: 0, dy: -2 }, // Arriba
                { dx: 0, dy: 2 },  // Abajo
                { dx: -2, dy: 0 }, // Izquierda
                { dx: 2, dy: 0 }   // Derecha
            ];
            direcciones = direcciones.sort(() => Math.random() - 0.5); // Aleatorizar direcciones
            
            for (let { dx, dy } of direcciones) {
                let nx = x + dx;
                let ny = y + dy;
                if (nx > 0 && ny > 0 && nx < tamaño - 1 && ny < tamaño - 1 && laberinto[ny][nx] === 1) {
                    laberinto[ny][nx] = 0; // Espacio vacío
                    laberinto[y + dy / 2][x + dx / 2] = 0; // Eliminar la pared entre celdas
                    crearCamino(nx, ny);
                }
            }
        }
        
        // Comenzar en (1,1)
        laberinto[1][1] = 0;
        crearCamino(1, 1);

        // Ubicar el tesoro en una posición válida
        let posicionesValidas = [];
        for (let y = 1; y < tamaño - 1; y++) {
            for (let x = 1; x < tamaño - 1; x++) {
                if (laberinto[y][x] === 0) {
                    posicionesValidas.push({ x, y });
                }
            }
        }
        
        if (posicionesValidas.length > 0) {
            let indiceAleatorio = Math.floor(Math.random() * posicionesValidas.length);
            tesoro.x = posicionesValidas[indiceAleatorio].x;
            tesoro.y = posicionesValidas[indiceAleatorio].y;
        }
        
        // Verificar si el camino es válido
        if (esCaminoValido()) {
            caminoValido = true;
        }
    }
}

// Algoritmo BFS para validar que hay un camino entre el jugador y el tesoro
function esCaminoValido() {
    let visitado = Array.from({ length: laberinto.length }, () => Array(laberinto[0].length).fill(false));
    let cola = [{ x: jugador.x, y: jugador.y }];
    visitado[jugador.y][jugador.x] = true;
    
    while (cola.length > 0) {
        let { x, y } = cola.shift();
        if (x === tesoro.x && y === tesoro.y) {
            return true;
        }
        
        let direcciones = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];
        
        for (let { dx, dy } of direcciones) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < laberinto[0].length && ny < laberinto.length && !visitado[ny][nx] && laberinto[ny][nx] === 0) {
                visitado[ny][nx] = true;
                cola.push({ x: nx, y: ny });
            }
        }
    }
    return false;
}


// Movimiento de enemigos con velocidad ajustada
function iniciarMovimientoEnemigos() {
    clearInterval(intervalEnemigos); // Limpiar intervalos previos
	intervalEnemigos = setInterval(() => {
        if (gameRunning) {
            moverEnemigos();
        }
    }, velocidadEnemigos);
}

// Colocar elementos en el laberinto
function colocarElementos() {
    jugador.x = 1;
    jugador.y = 1;
    tesoro.x = canvas.width / tileSize - 2;
    tesoro.y = canvas.height / tileSize - 2;

    enemigos = [
        { x: 3, y: 3, dir: "derecha" },
        { x: 5, y: 7, dir: "izquierda" }
    ];
    
    balasBeneficio = [
        { x: 4, y: 4 },
        { x: 8, y: 8 }
    ];
}

// Dibujo del laberinto
function dibujarLaberinto() {
    ctx.drawImage(imgFondo, 0, 0, canvas.width, canvas.height);
    for (let y = 0; y < laberinto.length; y++) {
        for (let x = 0; x < laberinto[y].length; x++) {
            if (laberinto[y][x] === 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}

// Dibujar elementos
function dibujarElementos() {
    ctx.drawImage(imgJugador, jugador.x * tileSize, jugador.y * tileSize, tileSize, tileSize);
    ctx.drawImage(imgTesoro, tesoro.x * tileSize, tesoro.y * tileSize, tileSize, tileSize);

    enemigos.forEach((enemigo) => {
        ctx.drawImage(imgEnemigo, enemigo.x * tileSize, enemigo.y * tileSize, tileSize, tileSize);
    });

    /*balasBeneficio.forEach((bala) => {
        ctx.drawImage(imgBala, bala.x * tileSize, bala.y * tileSize, tileSize * 0.8, tileSize * 0.8);
    });*/
}

// Movimiento del jugador
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function moverJugador(dx, dy) {
    let nuevaX = jugador.x + dx;
    let nuevaY = jugador.y + dy;
    if (laberinto[nuevaY] && laberinto[nuevaY][nuevaX] === 0) {
        jugador.x = nuevaX;
        jugador.y = nuevaY;
    }
}

// Mover enemigos dentro del laberinto
function moverEnemigos() {
    enemigos.forEach((enemigo, index) => {
        let posiblesMovimientos = [];
        let direcciones = [
            { dx: -1, dy: 0 }, // Izquierda
            { dx: 1, dy: 0 },  // Derecha
            { dx: 0, dy: -1 }, // Arriba
            { dx: 0, dy: 1 }   // Abajo
        ];

        // Revisar qué movimientos son válidos (sin atravesar paredes)
        direcciones.forEach(d => {
            let nuevoX = enemigo.x + d.dx;
            let nuevoY = enemigo.y + d.dy;
            if (laberinto[nuevoY] && laberinto[nuevoY][nuevoX] === 0) {
                posiblesMovimientos.push(d);
            }
        });

        if (posiblesMovimientos.length > 0) {
            let movimientoElegido = posiblesMovimientos[Math.floor(Math.random() * posiblesMovimientos.length)];
            enemigo.x += movimientoElegido.dx;
            enemigo.y += movimientoElegido.dy;
        }
    });

    actualizarEnemigos();  //Se llama después de mover para reflejar los cambios
}


// Disparar balas
document.addEventListener("keydown", (e) => {
    if (e.key === "x" && jugador.balas > 0) {
        jugador.balas--;
        document.getElementById("balas").innerText = jugador.balas;

        let bala = { x: jugador.x, y: jugador.y, dir: "" };
        if (keys["ArrowUp"]) bala.dir = "up";
        if (keys["ArrowDown"]) bala.dir = "down";
        if (keys["ArrowLeft"]) bala.dir = "left";
        if (keys["ArrowRight"]) bala.dir = "right";

        let intervalo = setInterval(() => {
            if (bala.dir === "up") bala.y--;
            if (bala.dir === "down") bala.y++;
            if (bala.dir === "left") bala.x--;
            if (bala.dir === "right") bala.x++;

            enemigos.forEach((enemigo, index) => {
                if (enemigo.x === bala.x && enemigo.y === bala.y) {
                    enemigos.splice(index, 1);
                    clearInterval(intervalo);
                }
            });

            if (laberinto[bala.y][bala.x] === 1) clearInterval(intervalo);
        }, 100);
    }
});

// Recoger balas
function recogerBalas() {
    balasBeneficio.forEach((bala, index) => {
        if (bala.x === jugador.x && bala.y === jugador.y) {
            jugador.balas += 30;
            document.getElementById("balas").innerText = jugador.balas;
            balasBeneficio.splice(index, 1);
        }
    });
}

// Actualización del juego
function actualizarJuego() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarLaberinto();
        dibujarElementos();
        moverJugador();
        recogerBalas();
		verificarVictoria();
		verificarDerrota();
		moverBalas();
		dibujarBalas();
		
        requestAnimationFrame(actualizarJuego);
    }
}

// Generar enemigos según la dificultad y colocarlos en el laberinto
function generarEnemigos() {
    enemigos = [];
    let cantidadEnemigos = definirCantidadEnemigos();

    for (let i = 0; i < cantidadEnemigos; i++) {
        let posicionValida = false;
        let x, y;

        // Buscar una posición válida en el laberinto (que no sea pared ni la posición del jugador)
        while (!posicionValida) {
            x = Math.floor(Math.random() * laberinto[0].length);
            y = Math.floor(Math.random() * laberinto.length);

            if (laberinto[y][x] === 0 && !(x === jugador.x && y === jugador.y)) {
                posicionValida = true;
            }
        }

        // Crear el enemigo y agregarlo a la lista
        enemigos.push({ x, y });

        // Crear el icono en el HTML
        let enemigoElemento = document.createElement("img");
        enemigoElemento.src = imgEnemigo.src;
        enemigoElemento.classList.add("enemigo");
        enemigoElemento.style.left = `${x * tamanoCelda}px`;
        enemigoElemento.style.top = `${y * tamanoCelda}px`;
        enemigoElemento.id = `enemigo-${i}`;
        document.getElementById("laberinto").appendChild(enemigoElemento);
    }
}

// Actualizar la posición de los enemigos en la interfaz gráfica
function actualizarEnemigos() {
    enemigos.forEach((enemigo, index) => {
        let enemigoElemento = document.getElementById(`enemigo-${index}`);
        enemigoElemento.style.left = `${enemigo.x * tamanoCelda}px`;
        enemigoElemento.style.top = `${enemigo.y * tamanoCelda}px`;
    });
}

function disparar() {
    let bala = {
        x: jugador.x,
        y: jugador.y,
        dir: direccionJugador
    };
    balas.push(bala);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
		moverJugador(0, -1);
		direccionJugador = "up";
	}
    if (e.key === "ArrowDown") {
		moverJugador(0, 1);
		direccionJugador = "down";
	}
	if (e.key === "ArrowLeft"){
		moverJugador(-1, 0);
		direccionJugador = "left";
	}
    if (e.key === "ArrowRight") {
		moverJugador(1, 0);
		direccionJugador = "right";
	}
    if (e.key === "x") {
        disparar();
    }
});

// Función para disparar
function disparar() {
    let bala = {
        x: jugador.x,
        y: jugador.y,
        dir: direccionJugador
    };
    balas.push(bala);
}

// Función para mover las balas
function moverBalas() {
    balas.forEach((bala, index) => {
        if (bala.dir === "up" && laberinto[bala.y - 1][bala.x] !== 1) bala.y--;
        else if (bala.dir === "down" && laberinto[bala.y + 1][bala.x] !== 1) bala.y++;
        else if (bala.dir === "left" && laberinto[bala.y][bala.x - 1] !== 1) bala.x--;
        else if (bala.dir === "right" && laberinto[bala.y][bala.x + 1] !== 1) bala.x++;
        else balas.splice(index, 1); // Eliminar bala si choca contra una pared
    });
}

// Función para dibujar balas
function dibujarBalas() {
    ctx.fillStyle = "red";
    balas.forEach((bala) => {
        ctx.beginPath();
        ctx.arc(bala.x * tileSize + tileSize / 2, bala.y * tileSize + tileSize / 2, tileSize / 4, 0, Math.PI * 2);
        ctx.fill();
    });
}


// Verificar victoria
function verificarVictoria() {
    if (jugador.x === tesoro.x && jugador.y === tesoro.y) {
       // alert("¡Has ganado!");
		mostrarMensaje("victoria");
		gameRunning = false;
		//setTimeout(reiniciarJuego, 500);
        //regresarAlMenu();
    }
}

// Verificar derrota
function verificarDerrota() {
    enemigos.forEach(enemigo => {
        if (enemigo.x === jugador.x && enemigo.y === jugador.y) {
			mostrarMensaje("derrota");
            //alert("¡Has perdido! Los enemigos te atraparon.");
			gameRunning = false;
			//setTimeout(reiniciarJuego, 500);
            
        }
    });
}

function mostrarMensaje(tipo) {
	
	let mensaje = document.getElementById("mensaje");
    mensaje.classList.remove("hidden");
    mensaje.classList.add(tipo === "victoria" ? "mensaje-victoria" : "mensaje-derrota");
    mensaje.innerHTML = tipo === "victoria" ? "🎉 ¡Ganaste! 🎉" : "💀 ¡Perdiste! 💀";
    document.getElementById("juego").classList.add("hidden");
	
    setTimeout(() => {
        mensaje.classList.add("hidden");
        reiniciarJuego();
    }, 2000);
	
	
}

// Regresar al menú principal
function regresarAlMenu() {
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("juego").classList.add("hidden");
}






function moverBalas() {
    balas.forEach((bala, index) => {
        if (bala.dir === "up" && laberinto[bala.y - 1][bala.x] !== 1) bala.y--;
        else if (bala.dir === "down" && laberinto[bala.y + 1][bala.x] !== 1) bala.y++;
        else if (bala.dir === "left" && laberinto[bala.y][bala.x - 1] !== 1) bala.x--;
        else if (bala.dir === "right" && laberinto[bala.y][bala.x + 1] !== 1) bala.x++;
        else balas.splice(index, 1); // Eliminar bala si choca contra una pared
    });

    // Verificar impacto con enemigos
    enemigos.forEach((enemigo, i) => {
        balas.forEach((bala, j) => {
            if (enemigo.x === bala.x && enemigo.y === bala.y) {
                enemigo.impactos = (enemigo.impactos || 0) + 1;
                balas.splice(j, 1); // Eliminar bala al impactar
                if (enemigo.impactos >= 5) {
                    let nuevaPos = generarEnemigo();
                    enemigos[i] = { x: nuevaPos.x, y: nuevaPos.y, impactos: 0 };
                }
            }
        });
    });
}

function generarEnemigo() {
    let posicionesValidas = [];
    for (let y = 1; y < laberinto.length - 1; y++) {
        for (let x = 1; x < laberinto[0].length - 1; x++) {
            if (laberinto[y][x] === 0 && Math.abs(jugador.x - x) + Math.abs(jugador.y - y) > 5) {
                posicionesValidas.push({ x, y });
            }
        }
    }
    
    if (posicionesValidas.length > 0) {
        let indiceAleatorio = Math.floor(Math.random() * posicionesValidas.length);
        return posicionesValidas[indiceAleatorio];
    }
    return { x: 1, y: 1 }; // Fallback en caso de error
}


function actualizarBalas() {
    moverBalas();
    requestAnimationFrame(actualizarBalas);
}

actualizarBalas();

function reiniciarJuego() {
    
    document.getElementById("juego").classList.add("hidden");
    //document.getElementById("gameCanvas").style.display = "none";
    gameAudio.pause();
    gameAudio.currentTime = 0;
	regresarAlMenu();
}


