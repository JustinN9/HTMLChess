import { initialBoard, renderBoard } from './board.js';
import { canMove } from './moves.js';
import { getLegalMoves } from "./moves.js";

const boardContainer = document.getElementById('board');

let board = initialBoard;
let selectedPiece = null;
let selectedPos = null;
let turn = "white";

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
  if (!selectedPiece && piece) {

    if (piece && piece.color !== turn) return;

    selectedPiece = piece;
    selectedPos = { row, col };
    const moves = getLegalMoves(piece, row, col, board);
    highlightMoves(moves);
  }

  //Move square
  /*else {
    /*if (canMove(selectedPiece, selectedPos.row, selectedPos.col, row, col, board)) {
      board[row][col] = selectedPiece;
      board[selectedPos.row][selectedPos.col] = null;
      turn = turn === "white" ? "black" : "white";
    }*/
   /*const legalMoves = getLegalMoves(selectedPiece, sr, sc, board);
   const isLegal = legalMoves.some(m => m.row === row && m.col === col);

if (isLegal) {
  board[row][col] = selectedPiece;
  board[sr][sc] = null;
}

    selectedPiece = null;
    selectedPos = null;
    renderBoard(boardContainer, board);
  }*/

    else {
   const legalMoves = getLegalMoves(selectedPiece, selectedPos.row, selectedPos.col, board);
   const isLegal = legalMoves.some(m => m.row === row && m.col === col);

   if (isLegal) {
      board[row][col] = selectedPiece;
      board[selectedPos.row][selectedPos.col] = null;
      turn = turn === "white" ? "black" : "white"; // switch turn
   }

   selectedPiece = null;
   selectedPos = null;
   renderBoard(boardContainer, board);
}
}

function highlightMoves(moves) {
  moves.forEach(m => {
    const square = document.querySelector(
      `.square[data-row="${m.row}"][data-col="${m.col}"]`
    );
    square.classList.add("highlight");
  });
}