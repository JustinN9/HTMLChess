// Reset

export function resetGame() {
  board = createFreshBoard();

  selectedPiece = null;
  selectedPos = null;

  turn = "white";
  lastMove = null;

  gameOver = false;
  moveHistory = [];

  clearHighlights();

  document.getElementById("history").innerHTML = "";

  hideGameOver();

  renderBoard(boardContainer, board);
}

// Game Over

export function showGameOver(title, message) {
  gameOverTitle.textContent = title;
  gameOverMessage.textContent = message;
  gameOverScreen.classList.remove("hidden");
}

export function hideGameOver() {
  gameOverScreen.classList.add("hidden");
}