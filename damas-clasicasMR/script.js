// Variables globales
let selectedPiece = null;
let selectedCell = null;
let currentPlayer = 'black'; // Jugador actual
let gameBoard = []; // Representación del tablero

// Cambiar de jugador
function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    console.log(`Es el turno del jugador: ${currentPlayer}`);

    if (currentPlayer === 'white') {
        setTimeout(makeAutomatedMove, 500);  // Llamar a la IA
    }
}
// Función para que la IA realice su movimiento
function makeAutomatedMove() {
    console.log("El jugador blanco está moviendo automáticamente");
    const pieces = document.querySelectorAll('.piece.white');
    
    // Primero, buscar todas las piezas del jugador blanco y ver si pueden capturar algo
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const row = parseInt(piece.parentElement.dataset.row);
        const col = parseInt(piece.parentElement.dataset.col);
        const validMoves = getValidMoves(row, col);

        // Filtrar los movimientos de captura (donde se salta sobre una pieza contraria)
        const captureMoves = validMoves.filter(([r, c]) => Math.abs(r - row) === 2 && Math.abs(c - col) === 2);
        
        // Si encontramos movimientos de captura, realizar la primera captura
        if (captureMoves.length > 0) {
            const [newRow, newCol] = captureMoves[0]; // Tomamos el primer movimiento de captura
            makeMove(row, col, newRow, newCol); // Mover la pieza
            
            // Verificar si la pieza ha llegado al otro lado y coronarla
            if (shouldCrown(piece, newRow)) {
                crownPiece(piece); // Convertir la pieza en dama
            }
            
            if (hasCaptured(row, col, newRow, newCol)) {
                capturePiece(row, col, newRow, newCol); // Realizar la captura de la pieza contraria
            }
            // Después de capturar, salir de la función (no seguir buscando más movimientos)
            switchPlayer();
            return;
        }
    }

    // Si no hay capturas posibles, hacer un movimiento regular
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const row = parseInt(piece.parentElement.dataset.row);
        const col = parseInt(piece.parentElement.dataset.col);
        const validMoves = getValidMoves(row, col);

        // Filtrar los movimientos regulares (donde se mueve una casilla a la vez)
        const regularMoves = validMoves.filter(([r, c]) => Math.abs(r - row) === 1 && Math.abs(c - col) === 1);
        
        // Si encontramos un movimiento regular, hacerlo
        if (regularMoves.length > 0) {
            const [newRow, newCol] = regularMoves[0]; // Tomar el primer movimiento regular
            makeMove(row, col, newRow, newCol);
            
            // Verificar si la pieza ha llegado al otro lado y coronarla
            if (shouldCrown(piece, newRow)) {
                crownPiece(piece); // Convertir la pieza en dama
            }
            break; // Después de mover, salir de la función
        }
    }

    // Cambiar al siguiente jugador
    switchPlayer();  
}

// Crear el tablero
function createBoard() {
    gameBoard = [];
    board.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        gameBoard[row] = [];
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            const isDark = (row + col) % 2 === 1;
            cell.classList.add(isDark ? 'dark' : 'light');
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (isDark) {
                if (row < 3) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'white');
                    piece.dataset.player = 'white';
                    cell.appendChild(piece);
                } else if (row > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'black');
                    piece.dataset.player = 'black';
                    cell.appendChild(piece);
                }
            }

            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
            gameBoard[row].push(cell);
        }
    }
}

// Manejar clic en una celda
function handleCellClick(event) {
    const cell = event.target;

    // Verificar si es una celda con una pieza
    if (cell.classList.contains('piece')) {
        const piece = cell;
        const row = parseInt(cell.parentElement.dataset.row);
        const col = parseInt(cell.parentElement.dataset.col);
        console.log(`Clic en pieza: ${piece.dataset.player} en Fila ${row}, Columna ${col}`);

        // Si se hace clic en la pieza del jugador actual
        if (piece.dataset.player === currentPlayer) {
            selectedPiece = piece;
            selectedCell = cell.parentElement;
            highlightValidMoves(row, col);
        }
    } else if (selectedPiece) {
        // Si no hay una pieza seleccionada, no hacer nada
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        console.log(`Clic en celda vacía en Fila ${row}, Columna ${col}`);

        // Comprobar si el movimiento es válido
        if (isValidMove(parseInt(selectedCell.dataset.row), parseInt(selectedCell.dataset.col), row, col)) {
            makeMove(parseInt(selectedCell.dataset.row), parseInt(selectedCell.dataset.col), row, col);
            if (hasCaptured(parseInt(selectedCell.dataset.row), parseInt(selectedCell.dataset.col), row, col)) {
                capturePiece(parseInt(selectedCell.dataset.row), parseInt(selectedCell.dataset.col), row, col);
            }
            if (shouldCrown(selectedPiece, row)) {
                crownPiece(selectedPiece);
            }
            if (checkGameOver()) {
                return;
            }
            switchPlayer();
            selectedPiece = null;
            selectedCell = null;
        } else {
            selectedPiece = null;
            selectedCell = null;
        }
    }
}

// Resaltar movimientos válidos de una pieza
function highlightValidMoves(row, col) {
    console.log(`Resaltando movimientos válidos de la pieza en Fila ${row}, Columna ${col}`);
    const cells = document.querySelectorAll('#board div');
    cells.forEach(cell => cell.classList.remove('highlight'));
    const validMoves = getValidMoves(row, col);
    validMoves.forEach(move => {
        const [r, c] = move;
        const targetCell = gameBoard[r][c];
        targetCell.classList.add('highlight');
    });
}

// Obtener movimientos válidos (capturas y movimientos normales)
function getValidMoves(row, col) {
    const moves = [];
    const piece = gameBoard[row][col].querySelector('.piece'); // Obtener la pieza en la celda
    const isQueen = piece.classList.contains('dama'); // Verificar si la pieza es una dama

    // Direcciones para mover: arriba-izquierda, arriba-derecha, abajo-izquierda, abajo-derecha
    const directions = [
        [-1, -1], // Arriba-izquierda
        [-1, 1],  // Arriba-derecha
        [1, -1],  // Abajo-izquierda
        [1, 1]    // Abajo-derecha
    ];

    // Si no es una dama, solo se pueden mover hacia la parte del tablero donde el jugador va
    if (piece.dataset.player === 'black' && !isQueen) {
        directions.splice(2, 2);  // Eliminar las direcciones hacia abajo (jugador negro solo va hacia arriba)
    } else if (piece.dataset.player === 'white' && !isQueen) {
        directions.splice(0, 2);  // Eliminar las direcciones hacia arriba (jugador blanco solo va hacia abajo)
    }

    // Evaluar todas las direcciones posibles
    directions.forEach(([dx, dy]) => {
        let r = row + dx;
        let c = col + dy;

        if (isInBounds(r, c)) {
            const targetCell = gameBoard[r][c];
            if (!targetCell.querySelector('.piece')) {
                moves.push([r, c]);  // Movimiento normal hacia una casilla vacía
            }

            // Comprobación de captura
            r = row + 2 * dx;
            c = col + 2 * dy;
            if (isInBounds(r, c) && !gameBoard[r][c].querySelector('.piece')) {
                const enemyRow = row + dx;
                const enemyCol = col + dy;
                const enemyCell = gameBoard[enemyRow][enemyCol];

                if (enemyCell.querySelector('.piece') && enemyCell.querySelector('.piece').dataset.player !== currentPlayer) {
                    moves.push([r, c]); // Agregar la casilla de destino para captura
                }
            }
        }
    });

    return moves;
}


// Verificar si la posición está dentro del tablero
function isInBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Verificar si el movimiento es válido
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const validMoves = getValidMoves(fromRow, fromCol);
    return validMoves.some(([r, c]) => r === toRow && c === toCol);
}

// Verificar si una pieza ha saltado sobre otra pieza (captura)
function hasCaptured(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return rowDiff === 2 && colDiff === 2;  // Verifica un salto (captura)
}

// Realizar la captura de una pieza
function capturePiece(fromRow, fromCol, toRow, toCol) {
    const capturedRow = (fromRow + toRow) / 2;
    const capturedCol = (fromCol + toCol) / 2;
    const capturedCell = gameBoard[capturedRow][capturedCol];
    console.log(`Capturando pieza en Fila ${capturedRow}, Columna ${capturedCol}`);
    capturedCell.innerHTML = ''; // Limpiar la casilla de la pieza capturada
}

// Mover la pieza
function makeMove(fromRow, fromCol, toRow, toCol) {
    const fromCell = gameBoard[fromRow][fromCol];
    const toCell = gameBoard[toRow][toCol];
    const piece = fromCell.querySelector('.piece');

    if (!piece) return;

    fromCell.removeChild(piece);
    toCell.appendChild(piece);
}

// Verificar si una pieza debe coronarse
function shouldCrown(piece, row) {
    return (piece.dataset.player === 'black' && row === 0) || (piece.dataset.player === 'white' && row === 7);
}

// Coronación de una pieza
function crownPiece(piece) {
    piece.classList.add('dama');
    console.log(`Pieza coronada: ${piece.dataset.player}`);
}

// Verificar fin del juego
function checkGameOver() {
    const enemyPieces = document.querySelectorAll(`.piece.${currentPlayer === 'white' ? 'black' : 'white'}`);
    if (enemyPieces.length === 0) {
        alert(`${currentPlayer === 'white' ? 'Black' : 'White'} wins!`);
        return true;
    }
    return false;
}

// Función para iniciar una nueva partida
document.getElementById('newGameBtn').addEventListener('click', createBoard);

// Para depurar y ver cómo se están creando las piezas blancas:
createBoard();


