/**
 * main.js
 * Descriptions: This file acts as the controller between; UI (board rendering), game logic (moves.js) and piece logic (piece.js).
 * Author: Justin Norton
 * Last Updated: 05-20-2026
 * Notes: 
 * 
 *  Handles:
 *    - Game state management
 *    - User interaction (click handling)
 *    - Turn logic
 *    - Rendering updates
 *    - Endgame detection
 */

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
let halfMoveClock = 0;
let positionHistory = {};

renderBoard(boardContainer, board);
addClickHandlers();

/**
 * Attaches click handler to the board container.
 */
function addClickHandlers() {
  boardContainer.addEventListener("click", onSquareClick);
}

/**
 * Handles user clicks on board squares.
 *
 * Responsibilities:
 * - Select piece
 * - Highlight legal moves
 * - Execute moves
 * - Handle special rules (castling, en passant, promotion)
 * - Update game state
 *
 * @param {MouseEvent} e
 */
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

  const wasCapture = board[row][col] !== null;

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

    if (wasCapture) {
      halfMoveClock = 0;
    } else {
      halfMoveClock++;
    }


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

const positionKey = generatePositionKey(board, turn);

positionHistory[positionKey] = (positionHistory[positionKey] || 0) + 1;

if (positionHistory[positionKey] >= 3) {
  alert("Draw by threefold repetition");
}

    // Check for endgame conditions
    if (isCheckmate(turn, board)) alert(`${turn} is checkmated!`);
    else if (isInsufficientMaterial(board)) alert("Draw by insufficient material");
    else if (isStalemate(turn, board)) alert(`Stalemate! It's a draw.`);
    else if (halfMoveClock >= 100) alert("Draw by 50-move rule");


    selectedPiece = null;
    selectedPos = null;
  }
}

/**
 * Highlights all legal destination squares for a selected piece.
 *
 * @param {{row:number, col:number}[]} moves
 */
function highlightMoves(moves) {
  moves.forEach(m => {
    const square = document.querySelector(
      `.square[data-row="${m.row}"][data-col="${m.col}"]`
    );
    square.classList.add("highlight");
  });
}

/**
 * Generates a simplified position key for repetition detection.
 *
 * Includes:
 * - Piece placement
 * - Active player (turn)
 *
 * NOTE:
 * This is NOT a full FEN representation.
 * Missing:
 * - Castling rights
 * - En passant square
 *
 * @param {(import("./piece.js").Piece | null)[][]} board
 * @param {"white" | "black"} turn
 * @returns {string}
 */
function generatePositionKey(board, turn) {
  let key = "";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      key += piece ? piece.type[0] + piece.color[0] : "--";
    }
  }

  key += turn;

  return key;
}