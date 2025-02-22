document.addEventListener("DOMContentLoaded", () => {
    const pantallaInicio = document.getElementById("pantallaInicio");
    const btnIniciar = document.getElementById("btnIniciar");
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    let fondo = new Image();
    fondo.src = "space-invaders/galaxia.jpg";
    
    let jugador = {
        x: canvas.width / 2 - 20,
        y: canvas.height - 60,
        width: 40,
        height: 40,
        velocidad: 5,
        imagen: new Image()
    };
    jugador.imagen.src = "space-invaders/jugador-small.png";
    
    let izquierdaPresionada = false;
    let derechaPresionada = false;
    let proyectiles = [];
    let enemigos = [];
    let proyectilesEnemigos = [];
    let escudos = [];
    let direccionEnemigos = 1;
    let velocidadEnemigos = 10;
    let contadorMovimientos = 0;

    let imagenesEnemigos = [
        "space-invaders/invader-a-small.png",
        "space-invaders/invader-b-small.png",
        "space-invaders/invader-c-small.png"
    ];

    let imagenEscudo = new Image();
    imagenEscudo.src = "space-invaders/escudo-small.png";

    function inicializarEnemigos() {
        let filas = ["A", "B", "B", "C", "C"];
        let yInicial = 50;
        let xInicial = 30;
        let espacio = 50; 
        
        filas.forEach((tipo, filaIndex) => {
            for (let i = 0; i < 10; i++) { 
                let imagenEnemigo = new Image();
                let src = tipo === "A" ? imagenesEnemigos[0] : tipo === "B" ? imagenesEnemigos[1] : imagenesEnemigos[2];
                imagenEnemigo.src = src;
                enemigos.push({ x: xInicial + i * espacio, y: yInicial + filaIndex * espacio, width: 40, height: 40, imagen: imagenEnemigo });
            }
        });
    }

    function moverEnemigos() {
        contadorMovimientos++;
        if (contadorMovimientos % 20 === 0) {
            let bordeIzquierdo = Math.min(...enemigos.map(e => e.x));
            let bordeDerecho = Math.max(...enemigos.map(e => e.x + e.width));
            
            if (bordeDerecho >= canvas.width || bordeIzquierdo <= 0) {
                direccionEnemigos *= -1;
                enemigos.forEach(enemigo => enemigo.y += 20);
            }
            enemigos.forEach(enemigo => enemigo.x += direccionEnemigos * velocidadEnemigos);
        }
    }

    function disparoEnemigo() {
        if (Math.random() < 0.03 && enemigos.length > 0) {
            let enemigoDispara = enemigos[Math.floor(Math.random() * enemigos.length)];
            proyectilesEnemigos.push({ x: enemigoDispara.x + 18, y: enemigoDispara.y, width: 5, height: 10, velocidad: 4 });
        }
    }

    function inicializarEscudos() {
        let xInicial = 90;
        let yEscudo = canvas.height - 150;
        let espacio = 130;
        for (let i = 0; i < 4; i++) {
            escudos.push({ x: xInicial + i * espacio, y: yEscudo, width: 50, height: 40, imagen: imagenEscudo });
        }
    }
    
    function dibujarFondo() {
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    }
    
    function dibujarJugador() {
        ctx.drawImage(jugador.imagen, jugador.x, jugador.y, jugador.width, jugador.height);
    }
    
    function dibujarProyectiles() {
        ctx.fillStyle = "red";
        proyectiles.forEach((proyectil, index) => {
            ctx.fillRect(proyectil.x, proyectil.y, proyectil.width, proyectil.height);
            proyectil.y -= proyectil.velocidad;
            if (proyectil.y < 0) {
                proyectiles.splice(index, 1);
            }
        });
    }

    function dibujarProyectilesEnemigos() {
        ctx.fillStyle = "yellow";
        proyectilesEnemigos.forEach((proyectil, index) => {
            ctx.fillRect(proyectil.x, proyectil.y, proyectil.width, proyectil.height);
            proyectil.y += proyectil.velocidad;
            if (proyectil.y > canvas.height) {
                proyectilesEnemigos.splice(index, 1);
            }
        });
    }
    
    function dibujarEnemigos() {
        enemigos.forEach((enemigo) => {
            ctx.drawImage(enemigo.imagen, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
        });
    }

    function dibujarEscudos() {
        escudos.forEach((escudo) => {
            ctx.drawImage(escudo.imagen, escudo.x, escudo.y, escudo.width, escudo.height);
        });
    }
    
    function detectarColisiones() {
        proyectiles.forEach((proyectil, pIndex) => {
            enemigos.forEach((enemigo, eIndex) => {
                if (
                    proyectil.x < enemigo.x + enemigo.width &&
                    proyectil.x + proyectil.width > enemigo.x &&
                    proyectil.y < enemigo.y + enemigo.height &&
                    proyectil.y + proyectil.height > enemigo.y
                ) {
                    proyectiles.splice(pIndex, 1);
                    enemigos.splice(eIndex, 1);
                }
            });
        });
    }
    
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") izquierdaPresionada = true;
        if (event.key === "ArrowRight") derechaPresionada = true;
        if (event.key === " ") {
            proyectiles.push({ x: jugador.x + 18, y: jugador.y, width: 5, height: 10, velocidad: 5 });
        }
    });
    
    document.addEventListener("keyup", (event) => {
        if (event.key === "ArrowLeft") izquierdaPresionada = false;
        if (event.key === "ArrowRight") derechaPresionada = false;
    });
    
    let imagenExplosion = new Image();
    imagenExplosion.src = "space-invaders/EnemyExplosion.png"; 
    let explosiones = [];

    let imagenExplosionJugador = new Image();
    imagenExplosionJugador.src = "space-invaders/PlayerExplosion.png";
    let jugadorExplotando = false;
    let tiempoExplosionJugador = 0;

    function inicializarEscudos() {
        let xInicial = 90;
        let yEscudo = canvas.height - 150;
        let espacio = 130;
        for (let i = 0; i < 4; i++) {
            escudos.push({ x: xInicial + i * espacio, y: yEscudo, width: 50, height: 40, imagen: imagenEscudo, salud: 3 }); // Inicializar salud en 3
        }
    }

    let score = 0; // Inicializar score en 0

    function detectarColisiones() {
        proyectiles.forEach((proyectil, pIndex) => {
            enemigos.forEach((enemigo, eIndex) => {
                if (
                    proyectil.x < enemigo.x + enemigo.width &&
                    proyectil.x + proyectil.width > enemigo.x &&
                    proyectil.y < enemigo.y + enemigo.height &&
                    proyectil.y + proyectil.height > enemigo.y
                ) {
                    proyectiles.splice(pIndex, 1);
                    enemigos.splice(eIndex, 1);

                    // Explosión del enemigo
                    explosiones.push({
                        x: enemigo.x,
                        y: enemigo.y,
                        width: 30,
                        height: 30,
                        imagen: imagenExplosion,
                        tiempo: 0
                    });

                    score += 10; // Incrementar score
                }
            });
        });

        proyectilesEnemigos.forEach((proyectil, pIndex) => {
            if (
                proyectil.x < jugador.x + jugador.width &&
                proyectil.x + proyectil.width > jugador.x &&
                proyectil.y < jugador.y + jugador.height &&
                proyectil.y + proyectil.height > jugador.y
            ) {
                proyectilesEnemigos.splice(pIndex, 1);
                jugadorExplotando = true;
                tiempoExplosionJugador = 0;
            }
        });

         // Colisiones con escudos
         proyectilesEnemigos.forEach((proyectil, pIndex) => {
            escudos.forEach((escudo, eIndex) => {
                if (
                    proyectil.x < escudo.x + escudo.width &&
                    proyectil.x + proyectil.width > escudo.x &&
                    proyectil.y < escudo.y + escudo.height &&
                    proyectil.y + proyectil.height > escudo.y
                ) {
                    proyectilesEnemigos.splice(pIndex, 1);
                    escudo.salud--; // Reducir salud del escudo
                    if (escudo.salud <= 0) {
                        escudos.splice(eIndex, 1); // Eliminar escudo si salud llega a 0
                    }
                }
            });
        });
    }

    function dibujarScore() {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score.toString().padStart(4, "0"), 10, 30); // Dibujar score formateado
    }

    function dibujarEscudos() {
        escudos.forEach((escudo) => {
            if (escudo.salud > 0) { // Dibujar solo si la salud es mayor que 0
                ctx.drawImage(escudo.imagen, escudo.x, escudo.y, escudo.width, escudo.height);
            }
        });
    }

    function dibujarExplosiones() {
        explosiones.forEach((explosion, index) => {
            ctx.drawImage(explosion.imagen, explosion.x, explosion.y, explosion.width, explosion.height);
            explosion.tiempo++;
            if (explosion.tiempo > 20) {
                explosiones.splice(index, 1);
            }
        });
    }

    let imagenVida = new Image();
    imagenVida.src = "space-invaders/jugador-small.png";
    let vidasJugador = 3;
    let juegoTerminado = false; // Nueva variable para controlar el estado del juego

    function dibujarJugador() {
        if (jugadorExplotando) {
            ctx.drawImage(imagenExplosionJugador, jugador.x, jugador.y, jugador.width, jugador.height);
            tiempoExplosionJugador++;
            if (tiempoExplosionJugador > 30) {
                vidasJugador--;
                jugadorExplotando = false;
                if (vidasJugador <= 0) {
                    console.log("¡Game Over!");
                    juegoTerminado = true; // Establecer el juego como terminado
                }
            }
        } else {
            ctx.drawImage(jugador.imagen, jugador.x, jugador.y, jugador.width, jugador.height);
        }
    }

    function dibujarVidas() {
        console.log("Dibujando vidas:", vidasJugador); // Mensaje de depuración
        for (let i = 0; i < vidasJugador; i++) {
            ctx.drawImage(imagenVida, canvas.width - 40 - i * 30, 10, 25, 25);
        }
    }

    let btnReiniciar = document.getElementById("btnReiniciar");

    function reiniciarJuego() {
        vidasJugador = 3;
        juegoTerminado = false;
        jugador.x = canvas.width / 2 - 20;
        enemigos = [];
        proyectiles = [];
        proyectilesEnemigos = [];
        escudos = [];
        inicializarEnemigos();
        inicializarEscudos();
        btnReiniciar.style.display = "none";
        requestAnimationFrame(actualizarJuego);
    }

    btnReiniciar.addEventListener("click", reiniciarJuego);

    function actualizarJuego() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarFondo();

        if (!juegoTerminado) {
            if (izquierdaPresionada && jugador.x > 0) {
                jugador.x -= jugador.velocidad;
            }
            if (derechaPresionada && jugador.x + jugador.width < canvas.width) {
                jugador.x += jugador.velocidad;
            }

            moverEnemigos();
            disparoEnemigo();
            dibujarJugador();
            dibujarProyectiles();
            dibujarProyectilesEnemigos();
            dibujarEnemigos();
            dibujarEscudos();
            detectarColisiones();
            dibujarExplosiones();
            dibujarVidas();
            dibujarScore(); // Dibujar score
            requestAnimationFrame(actualizarJuego);
            
        } else {
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("¡Game Over!", canvas.width / 2 - 100, canvas.height / 2);
            btnReiniciar.style.display = "block";
            btnReiniciarPartida.style.display = "block";
        }
    }

    btnIniciar.addEventListener("click", () => {
        pantallaInicio.style.display = "none";
        canvas.style.display = "block";
        inicializarEnemigos();
        inicializarEscudos();
        actualizarJuego();
    });
    
    function moverEnemigos() {
        if (!juegoTerminado) { // Solo mover enemigos si el juego no ha terminado
            contadorMovimientos++;
            if (contadorMovimientos % 20 === 0) {
                let bordeIzquierdo = Math.min(...enemigos.map(e => e.x));
                let bordeDerecho = Math.max(...enemigos.map(e => e.x + e.width));

                if (bordeDerecho >= canvas.width || bordeIzquierdo <= 0) {
                    direccionEnemigos *= -1;
                    enemigos.forEach(enemigo => enemigo.y += 20);
                }
                enemigos.forEach(enemigo => enemigo.x += direccionEnemigos * velocidadEnemigos);
            }
        }
    }
    
    btnIniciar.addEventListener("click", () => {
        pantallaInicio.style.display = "none";
        canvas.style.display = "block";
        inicializarEnemigos();
        inicializarEscudos();
        actualizarJuego();
    });
});