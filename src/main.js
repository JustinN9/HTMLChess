import { initialBoard, renderBoard } from './board.js';
import { promotePawn } from './piece.js';
import { canMove } from './moves.js';
import { getLegalMoves } from "./moves.js";
import { isCheckmate } from "./moves.js";
import { isInsufficientMaterial } from "./moves.js";
import { isStalemate } from './moves.js';

const boardContainer = document.getElementById('board');

let board = initialBoard;
let selectedPiece = null;
let selectedPos = null;
let turn = "white";
let lastMove = null; 

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

  document.querySelectorAll('.square.highlight').forEach(sq => sq.classList.remove('highlight'));

  //Select square
  if (piece && piece.color === turn) {
    selectedPiece = piece;
    selectedPos = { row, col };
    const moves = getLegalMoves(piece, row, col, board, lastMove);
    highlightMoves(moves);
    return;
  }

  //Move square
  if (selectedPiece) {
    const legalMoves = getLegalMoves(selectedPiece, selectedPos.row, selectedPos.col, board, lastMove);
    const isLegal = legalMoves.some(m => m.row === row && m.col === col);

    if (!isLegal) {
      //Illegal move clicked
      selectedPiece = null;
      selectedPos = null;
      return;
    }

    //Castling
    if (selectedPiece.type === "king" && Math.abs(col - selectedPos.col) === 2) {
      const r = selectedPos.row;
      if (col > selectedPos.col) {
        board[r][5] = board[r][7];
        board[r][7] = null;
        board[r][5].hasMoved = true;
      } else {
        board[r][3] = board[r][0];
        board[r][0] = null;
        board[r][3].hasMoved = true;
      }
    }

    // En Passant capture
    if (
      selectedPiece.type === "pawn" &&
      lastMove &&
      lastMove.piece.type === "pawn" &&
      Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
      row === lastMove.to.row + (selectedPiece.color === "white" ? -1 : 1) &&
      col === lastMove.to.col &&
      selectedPos.col !== col &&
      board[row][col] === null
    ) {
      board[lastMove.to.row][lastMove.to.col] = null;
    }

    //Move
    board[row][col] = selectedPiece;
    board[selectedPos.row][selectedPos.col] = null;

    // after a legal move is made
    lastMove = {
      piece: selectedPiece,
      from: { row: selectedPos.row, col: selectedPos.col },
      to:   { row, col }
    };

    //Promotion
    if (selectedPiece.type === "pawn" && (row === 0 || row === 7)) {
      promotePawn(row, col, board);
    }

    selectedPiece.hasMoved = true;
    turn = turn === "white" ? "black" : "white";

    renderBoard(boardContainer, board);

    // Check for endgame conditions
    if (isCheckmate(turn, board)) alert(`${turn} is checkmated!`);
    else if (isInsufficientMaterial(board)) alert("Draw by insufficient material");
    else if (isStalemate(turn, board)) alert(`Stalemate! It's a draw.`);

    selectedPiece = null;
    selectedPos = null;
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