# Flappy Bird Clone - Prompts y Requerimientos

## 📝 Descripción del Juego

**Flappy Bird Clone** es un juego de desplazamiento lateral donde el jugador controla un pájaro que debe volar evitando obstáculos en forma de tubos. El objetivo es conseguir la mayor puntuación posible al pasar a través de los espacios entre los tubos sin chocar con ellos o caer al suelo.

### 🎮 ¿Cómo se juega?
- **Inicio**: El juego comienza cuando el jugador presiona el botón de inicio.
- **Control del Pájaro**: Para hacer que el pájaro vuele, el jugador debe presionar la tecla `ESPACIO` o hacer clic en la pantalla.
- **Evitar Obstáculos**: El jugador debe pasar por los espacios entre los tubos sin tocarlos.
- **Puntuación**: Se obtiene 1 punto por cada conjunto de tubos superado.
- **Fin del Juego**: Si el pájaro choca con un tubo o cae al suelo, el juego termina y se muestra el puntaje final.

---

## 🏗️ Prompts para el Desarrollo

### #promt 1#
> Estoy necesitando desarrollar un juego con JavaScript, HTML y CSS, dame ideas de juegos que puedo hacer con estos criterios.

### 💡 Respuesta de ChatGPT
#### Juegos Clásicos y Sencillos
- **Tic-Tac-Toe (Tres en línea)** → Un juego de 3x3 donde dos jugadores colocan X y O para ganar.
- **Piedra, Papel o Tijeras** → Un clásico de turnos donde el jugador compite contra la computadora.
- **Memoria (Memory Game)** → Un tablero de cartas boca abajo que debes emparejar.
- **Snake** → La clásica serpiente que crece al comer puntos, evitando chocar consigo misma.
- **Flappy Bird Clone** → Un juego donde un pájaro debe esquivar obstáculos con clics o teclas.

---

### #promt 2#
> Necesito los requerimientos funcionales para desarrollar el juego **Flappy Bird Clone**, con JavaScript, HTML y CSS.

## 📌 Requerimientos Funcionales

### 🏁 Pantalla de Inicio
- Debe mostrar el título del juego.
- Debe tener un botón para iniciar el juego.
- Debe mostrar las instrucciones básicas (por ejemplo, "Presiona espacio para volar").

### 🎮 Interfaz de Juego
- Debe tener un área de juego donde el pájaro se moverá.
- Debe mostrar el pájaro en una posición inicial.
- Debe incluir obstáculos (tubos) que se mueven de derecha a izquierda.
- Debe mostrar el puntaje actual del jugador en pantalla.

### 🐦 Control del Pájaro
- El pájaro debe caer debido a la gravedad cuando no se presiona ninguna tecla.
- El pájaro debe subir cuando el jugador presiona la tecla de espacio o hace clic en la pantalla.
- El pájaro debe tener una animación de aleteo mientras se mueve.

### 🚧 Obstáculos
- Los obstáculos deben consistir en pares de tubos (uno superior y uno inferior) con un espacio entre ellos.
- Los tubos deben moverse de derecha a izquierda a una velocidad constante.
- La posición vertical de los tubos debe ser aleatoria dentro de ciertos límites.
- Deben generarse nuevos tubos a intervalos regulares.

### ⚠️ Colisiones
- El juego debe detectar colisiones entre el pájaro y los tubos.
- El juego debe detectar colisiones entre el pájaro y el suelo o el techo del área de juego.
- Si ocurre una colisión, el juego debe terminar.

### ⭐ Puntaje
- El jugador debe ganar puntos cada vez que el pájaro pasa entre un par de tubos.
- El puntaje actual debe mostrarse en pantalla durante el juego.
- Al final del juego, debe mostrarse el puntaje final.

### ❌ Fin del Juego
- Cuando el juego termina, debe mostrar un mensaje de "Game Over".
- Debe mostrar el puntaje final del jugador.
- Debe tener un botón para reiniciar el juego.

### 🔊 Sonidos y Efectos
- Debe reproducir un sonido cuando el pájaro sube.
- Debe reproducir un sonido cuando el pájaro pasa entre los tubos.
- Debe reproducir un sonido cuando el pájaro choca con un obstáculo o el suelo.

### 📱 Responsividad
- El juego debe ser jugable en diferentes tamaños de pantalla (escritorio, tablet, móvil).
- Los controles deben ser accesibles tanto con teclado como con toques en la pantalla.

---

## 📌 Requerimientos No Funcionales

### 🚀 Rendimiento
- El juego debe ejecutarse de manera fluida sin retrasos perceptibles.
- Debe manejar eficientemente la generación y eliminación de obstáculos para no consumir demasiados recursos.

### 🌐 Compatibilidad
- El juego debe ser compatible con los navegadores web modernos (Chrome, Firefox, Safari, Edge).

### 🛠️ Accesibilidad
- El juego debe ser accesible para jugadores con discapacidades, proporcionando alternativas de control.

### 🔧 Mantenibilidad
- El código debe estar bien documentado y estructurado para facilitar futuras modificaciones y mejoras.

---

## 📌 Mejoras y Ajustes

### #promt 3#
> No veo funcionalidad en el juego, por favor revisa el código implementado.

### #promt 4#
> Mejora el diseño del `index.html` incluyendo botones con estilos más intuitivos para los usuarios.

### #promt 5#
> Necesito que le agregues sonidos y efectos. Además, quiero visualizar un pájaro como personaje principal del juego.

### #promt 6#
> El contador de puntuación debe aumentar con cada obstáculo superado.

### #promt 7#
> Quiero que el sonido de `flap` solo se reproduzca cuando se inicie el juego.

---
By Jesus Hurtado