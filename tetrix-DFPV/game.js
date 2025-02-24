const TETROMINOES = {
    I: [
        [1, 1, 1, 1]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0]
    ],
    L: [
        [1, 0],
        [1, 0],
        [1, 1]
    ]
};

class Tetromino {
    constructor(type) {
        this.shape = TETROMINOES[type];
        this.x = 3;
        this.y = 0;
    }

    draw(ctx) {
        ctx.fillStyle = "cyan";
        this.shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) {
                    ctx.fillRect((this.x + colIndex) * 30, (this.y + rowIndex) * 30, 30, 30);
                }
            });
        });
    }

    move(direction) {
        if (direction === "left") this.x--;
        if (direction === "right") this.x++;
    }

    fall() {
        this.y++;
    }

    rotate() {
        this.shape = this.shape[0].map((_, colIndex) => this.shape.map(row => row[colIndex])).reverse();
    }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tetromino = new Tetromino("T");

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        tetromino.move("left");
    } else if (event.key === "ArrowRight") {
        tetromino.move("right");
    } else if (event.key === " ") {
        tetromino.rotate();
    }
    draw();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tetromino.draw(ctx);
}

function gameLoop() {
    tetromino.fall();
    draw();
    setTimeout(gameLoop, 500);
}

gameLoop();

console.log("Piezas de Tetris cargadas:", TETROMINOES);
