let board = null;
let game = new Chess();

const boardElement = document.getElementById("board");
const pgnInput = document.getElementById("pgn-input");
const loadGameButton = document.getElementById("load-game");

function onMoveEnd(oldPos, newPos) {
  const lastMove = game.history({ verbose: true }).pop();

  if (lastMove) {
    const { to, captured, flags } = lastMove;
    if (captured) {
      const capturedSquare = document.querySelector(`.square-${to}`);
      if (capturedSquare) {
        capturedSquare.classList.add("capture");
        setTimeout(() => capturedSquare.classList.remove("capture"), 500);
      }
    }

    if (flags.includes("m")) { // Checkmate flag
      const kingSquare = document.querySelector(`.square-${to}`);
      if (kingSquare) {
        kingSquare.classList.add("checkmate");
      }
    }
  }
}

function loadGame() {
  const pgn = pgnInput.value.trim();
  if (game.load_pgn(pgn)) {
    board.position(game.fen());
    playGame();
  } else {
    alert("Invalid PGN");
  }
}

function playGame() {
  const moves = game.history({ verbose: true });
  let index = 0;

  function makeNextMove() {
    if (index
