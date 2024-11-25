document.addEventListener("DOMContentLoaded", () => {
  let board = null;
  const game = new Chess();

  const boardElement = document.getElementById("board");
  const pgnInput = document.getElementById("pgn-input");
  const loadGameButton = document.getElementById("load-game");

  function onMoveEnd() {
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
      if (index < moves.length) {
        game.move(moves[index]);
        board.position(game.fen());
        onMoveEnd();
        index++;
        setTimeout(makeNextMove, 1000);
      }
    }

    game.reset();
    makeNextMove();
  }

  loadGameButton.addEventListener("click", loadGame);

  board = Chessboard(boardElement, {
    draggable: false,
    position: "start",
  });
});

