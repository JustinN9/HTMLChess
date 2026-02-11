import { initialBoard, renderBoard } from './board.js';

const boardContainer = document.getElementById('board');

let board = initialBoard;
let selectedPiece = null;
let selectedPos = null;

renderBoard(boardContainer, board);
addClickHandlers();

function addClickHandlers() {
  boardContainer.addEventListener("click", onSquareClick);
}

function onSquareClick(e) {
  const square = e.target.closest(".square");
  if (!square) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  const piece = board[row][col];

  //Select square
  if (!selectedPiece) {
    if (piece) {
      selectedPiece = piece;
      selectedPos = { row, col };
      square.classList.add("selected");
    }
  } 
  //Move square
  else {
    board[row][col] = selectedPiece;
    board[selectedPos.row][selectedPos.col] = null;

    selectedPiece = null;
    selectedPos = null;

    renderBoard(boardContainer, board);
  }
}
