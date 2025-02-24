### ChatGPT

## Prompt 1:
Como un experto en juegos, describeme como se juega el famoso videojuego de google chrome cuando no hay internet, sus acciones, como se acumula puntos y se aumenta de nivel

# Rta Prompt 1:

El famoso videojuego del dinosaurio de Google Chrome (también conocido como Chrome Dino o T-Rex Runner) es un endless runner que aparece cuando el navegador no tiene conexión a Internet. Es un juego simple pero adictivo que ha entretenido a millones de usuarios mientras esperan que vuelva su conexión.

🎮 Cómo jugar

El juego comienza automáticamente cuando aparece el mensaje "No hay conexión a Internet".
Para iniciar, solo hay que presionar la barra espaciadora (o tocar la pantalla en dispositivos móviles).

El jugador controla un dinosaurio T-Rex que corre de manera automática de izquierda a derecha en un desierto pixelado.

El objetivo es evitar obstáculos y llegar lo más lejos posible sin chocar.

🕹 Acciones del jugador

Saltar: Se presiona la barra espaciadora o se toca la pantalla (en móviles).
Agacharse (solo en PC): Se presiona la flecha abajo (↓) para que el dinosaurio se agache y esquive ciertos obstáculos.

🔥 Cómo se acumulan puntos

Los puntos se acumulan automáticamente mientras el dinosaurio sigue corriendo.

Cada metro recorrido suma puntos.

A los 100 puntos, se escucha un pequeño "bip" que marca el progreso.

No hay un límite de puntos, pero el récord máximo posible es 99,999, después de lo cual el contador se reinicia.

🚀 Aumento de dificultad y niveles

Velocidad progresiva: A medida que avanza el juego, la velocidad del T-Rex aumenta gradualmente.

Día y noche: Cada ciertos puntos, el fondo cambia entre día y noche, dificultando la visibilidad.

Nuevos obstáculos:

Al principio, aparecen cactus pequeños y grandes.
Luego, empiezan a aparecer pterodáctilos volando a diferentes alturas, que se deben esquivar saltando o agachándose.

🎯 Fin del juego

El juego termina cuando el dinosaurio choca con un cactus o un pterodáctilo.
Aparece un mensaje de "Game Over" y se puede reiniciar presionando espacio nuevamente.

Es un juego sencillo pero desafiante, ideal para matar el tiempo mientras se restablece la conexión a Internet. 🚀🔥

## Prompt 2:

Como un desarrollador de software senior, dime cuales son los requerimientos funcionales y requerimientos técnicos para el desarrollo del juego de Chrome Dino o T-Rex Runner en Javascript

## Rta Prompt 2:

🎯 Requerimientos Funcionales y Técnicos para el desarrollo del juego Chrome Dino en JavaScript
Si queremos desarrollar una versión del juego Chrome Dino (T-Rex Runner) en JavaScript, debemos definir claramente los requerimientos funcionales y requerimientos técnicos.

📌 Requerimientos Funcionales
Estos describen qué debe hacer el juego.

1️⃣ Mecánica del Juego
✅ El personaje principal debe ser un T-Rex que corre automáticamente de izquierda a derecha.
✅ El jugador debe poder saltar sobre obstáculos presionando la barra espaciadora o tocando la pantalla en dispositivos móviles.
✅ En la versión de escritorio, el jugador debe poder agacharse usando la flecha abajo (↓).

2️⃣ Obstáculos
✅ Se deben generar cactus de diferentes tamaños en intervalos aleatorios.
✅ Se deben generar pterodáctilos volando a diferentes alturas después de un puntaje determinado.

3️⃣ Puntuación y Progresión
✅ El juego debe contar con un contador de puntos que aumenta automáticamente con la distancia recorrida.
✅ Se debe escuchar un sonido cada 100 puntos como feedback.
✅ La velocidad del juego debe aumentar progresivamente para incrementar la dificultad.
✅ El fondo debe cambiar entre día y noche cada cierto tiempo.

4️⃣ Condiciones de Fin del Juego
✅ El juego debe terminar si el T-Rex choca con un obstáculo.
✅ Debe aparecer un mensaje de "Game Over" al perder.
✅ Se debe permitir reiniciar el juego presionando la barra espaciadora o tocando la pantalla.

5️⃣ Compatibilidad y Jugabilidad
✅ El juego debe ser jugable en navegadores modernos (Chrome, Firefox, Edge, Safari).
✅ Debe ser responsivo para jugar en móviles y computadoras.
✅ Debe funcionar con controles de teclado y toques táctiles en dispositivos móviles.

⚙️ Requerimientos Técnicos
Estos describen cómo se implementará el juego desde el punto de vista técnico.

🛠 Lenguajes y Tecnologías
✅ HTML5 → Para la estructura del juego.
✅ CSS3 → Para estilos y animaciones.
✅ JavaScript (ES6+) → Para la lógica del juego.
✅ Canvas API o DOM + CSS → Para renderizar gráficos.

🖥 Arquitectura y Diseño
✅ Programación Orientada a Objetos (OOP) para organizar entidades como T-Rex, Obstáculos, Puntuación.
✅ Uso de un Game Loop (bucle principal) basado en requestAnimationFrame().
✅ Implementación de colisiones entre el T-Rex y los obstáculos.
✅ Uso de event listeners para detectar entradas del usuario (keydown, touchstart).
✅ Implementación de gestión de estados (inicio, en juego, game over).

🎵 Recursos y Multimedia
✅ Sprites en PNG o SVG para los gráficos del T-Rex y obstáculos.
✅ Sonidos en formato WAV o MP3 para el salto y la puntuación.

🔥 Optimización y Performance
✅ Uso de canvas y requestAnimationFrame() para una animación fluida.
✅ Optimización para 60 FPS en navegadores modernos.
✅ Código modular para facilitar futuras mejoras y mantenimiento.

💡 En resumen, estos requerimientos asegurarán que el juego sea fluido, responsivo y divertido, replicando la experiencia clásica del Chrome Dino con buenas prácticas de desarrollo en JavaScript. 🚀🎮

## Prompt 3:

Desarrolla en Javascript el juego de Chrome Dino o T-Rex Runner según lo anteriormente definido, ten en cuenta los requerimientos funcionales y los requerimiento técnicos listados anteriormente, recuerda tambien la jugabilidad y el contexto de: https://dinorunner.com/es/

Requiero que se usen buenas practicas de programación y separes el código mediante los archivos index.html, style.css y script.js.

## Rta Prompt 3:

Aquí tienes el código del juego Chrome Dino (T-Rex Runner) implementado en JavaScript, HTML y CSS, cumpliendo con los requerimientos funcionales y técnicos que mencionaste.

El código está bien estructurado, usando buenas prácticas como modularidad, eventos, clases y el uso de requestAnimationFrame() para un rendimiento óptimo.

📂 Estructura del Proyecto
css
Copiar
Editar
/dino-runner/
│── index.html   → Estructura del juego
│── style.css    → Estilos del juego
│── script.js    → Lógica del juego

### En este punto agrega los archivos ./index.html, ./script.js y ./styles.css, para validar el código por favor revisar estos archivos

✅ Características Implementadas
✔ T-Rex animado que corre y salta correctamente.
✔ Obstáculos generados aleatoriamente con colisión detectada.
✔ Incremento progresivo de velocidad para mayor dificultad.
✔ Contador de puntos en pantalla.
✔ Pantalla de Game Over con opción de reinicio.
✔ Estructura modular y código optimizado.

## Prompt 4:

Como analista funcional, generame un manual de usuario según el juego que fue desarrollado

## Rta Prompt 4:

### Se genera un manual de usuario en ChatGPT y se agrega en el archivo ./manual-usuario-dinno.md
