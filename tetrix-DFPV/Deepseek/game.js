const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

// Escala del canvas
const scale = 30;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

// Matriz del juego
let grid = Array.from({ length: rows }, () => Array(columns).fill(0));

// Piezas de Tetris (I, O, T, S, L)
const tetrominoes = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  L: [
    [1, 0, 0],
    [1, 1, 1],
  ],
};

// Clase Tetromino
class Tetromino {
  constructor(shape) {
    this.shape = shape;
    this.x = Math.floor(columns / 2) - Math.floor(shape[0].length / 2);
    this.y = 0;
  }

  // Dibuja la pieza en el canvas
  draw() {
    context.fillStyle = "#e74c3c";
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          context.fillRect((this.x + x) * scale, (this.y + y) * scale, scale, scale);
        }
      });
    });
  }

  // Mueve la pieza
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  // Rota la pieza
  rotate() {
    this.shape = this.shape[0].map((_, i) =>
      this.shape.map((row) => row[i]).reverse()
    );
  }
}

// Crea una pieza aleatoria
function createRandomPiece() {
  const keys = Object.keys(tetrominoes);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return new Tetromino(tetrominoes[randomKey]);
}

let piece = createRandomPiece();

// Dibuja la cuadrícula
function drawGrid() {
  context.fillStyle = "#34495e";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (grid[y][x]) {
        context.fillStyle = "#3498db";
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
}

// Detecta colisiones
function collide() {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (
        piece.shape[y][x] &&
        (piece.y + y >= rows ||
          piece.x + x < 0 ||
          piece.x + x >= columns ||
          grid[piece.y + y][piece.x + x])
      ) {
        return true;
      }
    }
  }
  return false;
}

// Fija la pieza en la matriz del juego
function freeze() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        grid[piece.y + y][piece.x + x] = 1;
      }
    });
  });
  piece = createRandomPiece();
}

// Limpia las líneas completas
function clearLines() {
  for (let y = rows - 1; y >= 0; y--) {
    if (grid[y].every((cell) => cell)) {
      grid.splice(y, 1);
      grid.unshift(Array(columns).fill(0));
    }
  }
}

// Control del tiempo de caída
let dropCounter = 0;
let dropInterval = 500; // Tiempo en milisegundos (500ms = 0.5 segundos)

// Game Loop
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime; // Acumula el tiempo transcurrido

  // Si el tiempo acumulado supera el intervalo, la pieza cae
  if (dropCounter > dropInterval) {
    if (!collide()) {
      piece.move(0, 1);
    } else {
      piece.move(0, -1);
      freeze();
      clearLines();
    }
    dropCounter = 0; // Reinicia el contador
  }

  drawGrid();
  piece.draw();

  requestAnimationFrame(update);
}

// Controles del teclado
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    piece.move(-1, 0);
    if (collide()) piece.move(1, 0);
  }
  if (event.key === "ArrowRight") {
    piece.move(1, 0);
    if (collide()) piece.move(-1, 0);
  }
  if (event.key === "ArrowDown") {
    piece.move(0, 1);
    if (collide()) piece.move(0, -1);
  }
  if (event.key === " ") {
    piece.rotate();
    if (collide()) {
      for (let i = 0; i < 3; i++) piece.rotate(); // Deshacer rotación si colisiona
    }
  }
});

// Inicia el juego
let lastTime = 0;
update();