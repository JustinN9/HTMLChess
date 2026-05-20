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

import { Piece } from './piece.js';
import { getLegalMoves, isCheckmate } from "./moves.js";
import { renderBoard } from './board.js';

/* =========================
   DOM
========================= */

const boardContainer = document.getElementById('board');
const resetButton = document.getElementById("reset");

const gameOverScreen = document.getElementById("game-over");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverMessage = document.getElementById("game-over-message");
const gameOverReset = document.getElementById("game-over-reset");

const promotionModal = document.getElementById("promotion-modal");

/* =========================
   STATE
========================= */

let board = createFreshBoard();

let selectedPiece = null;
let selectedPos = null;

let turn = "white";
let lastMove = null;

let gameOver = false;
let moveHistory = [];

let pendingPromotion = null;

/* =========================
   INIT
========================= */

renderBoard(boardContainer, board);
addClickHandlers();

resetButton.addEventListener("click", resetGame);

gameOverReset.addEventListener("click", () => {
  hideGameOver();
  resetGame();
});

document.querySelectorAll("#promotion-modal button").forEach(btn => {
  btn.addEventListener("click", () => {
    applyPromotion(btn.dataset.piece);
  });
});

/* =========================
   BOARD
========================= */

function createFreshBoard() {
  return [
    [
      new Piece("rook", "black"),
      new Piece("knight", "black"),
      new Piece("bishop", "black"),
      new Piece("queen", "black"),
      new Piece("king", "black"),
      new Piece("bishop", "black"),
      new Piece("knight", "black"),
      new Piece("rook", "black"),
    ],
    Array(8).fill(null).map(() => new Piece("pawn", "black")),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null).map(() => new Piece("pawn", "white")),
    [
      new Piece("rook", "white"),
      new Piece("knight", "white"),
      new Piece("bishop", "white"),
      new Piece("queen", "white"),
      new Piece("king", "white"),
      new Piece("bishop", "white"),
      new Piece("knight", "white"),
      new Piece("rook", "white"),
    ]
  ];
}

/* =========================
   CLICK HANDLING
========================= */

function addClickHandlers() {
  boardContainer.addEventListener("click", onSquareClick);
}

function onSquareClick(e) {
  if (gameOver || pendingPromotion) return;

  const square = e.target.closest(".square");
  if (!square) return;

  const row = +square.dataset.row;
  const col = +square.dataset.col;
  const piece = board[row][col];

  clearHighlights();

  /* =========================
     SELECT PIECE (RESTORED STYLE)
  ========================= */

  if (piece && piece.color === turn) {
    selectedPiece = piece;
    selectedPos = { row, col };

    const moves = getLegalMoves(piece, row, col, board, lastMove);
    highlightMoves(moves);

    // keep original behavior: ONLY move highlights, no extra square styling
    return;
  }

  if (!selectedPiece) return;

  const legalMoves = getLegalMoves(
    selectedPiece,
    selectedPos.row,
    selectedPos.col,
    board,
    lastMove
  );

  const isLegal = legalMoves.some(m => m.row === row && m.col === col);

  if (!isLegal) {
    selectedPiece = null;
    selectedPos = null;
    return;
  }

  const wasCapture = board[row][col] !== null;

  /* =========================
     CASTLING
  ========================= */

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

  /* =========================
     EN PASSANT
  ========================= */

  if (
    selectedPiece.type === "pawn" &&
    lastMove &&
    lastMove.piece.type === "pawn" &&
    Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
    row === lastMove.to.row + (selectedPiece.color === "white" ? -1 : 1) &&
    col === lastMove.to.col &&
    board[row][col] === null
  ) {
    board[lastMove.to.row][lastMove.to.col] = null;
  }

  /* =========================
     MOVE
  ========================= */

  board[row][col] = selectedPiece;
  board[selectedPos.row][selectedPos.col] = null;

  lastMove = {
    piece: selectedPiece,
    from: { ...selectedPos },
    to: { row, col },
    capture: wasCapture
  };

  moveHistory.push(lastMove);

  selectedPiece.hasMoved = true;

  /* =========================
     PROMOTION
  ========================= */

  if (selectedPiece.type === "pawn" && (row === 0 || row === 7)) {
    openPromotionMenu(row, col);
  } else {
    finishMove();
  }
}

/* =========================
   PROMOTION
========================= */

function openPromotionMenu(row, col) {
  promotionModal.classList.remove("hidden");
  pendingPromotion = { row, col };
}

function applyPromotion(type) {
  const { row, col } = pendingPromotion;
  const piece = board[row][col];

  piece.type = type;
  piece.symbol = piece.toUnicode();

  promotionModal.classList.add("hidden");
  pendingPromotion = null;

  finishMove();
}

/* =========================
   MOVE FINALIZATION
========================= */

function finishMove() {
  turn = turn === "white" ? "black" : "white";

  renderBoard(boardContainer, board);

  updateHistoryUI();

  if (isCheckmate(turn, board)) {
    const name = turn.charAt(0).toUpperCase() + turn.slice(1);

    showGameOver(
      `${name} is checkmated!`,
      "No legal moves available."
    );

    gameOver = true;
    return;
  }

  selectedPiece = null;
  selectedPos = null;
}

/* =========================
   HIGHLIGHTING (RESTORED SIMPLE STYLE)
========================= */

function highlightMoves(moves) {
  moves.forEach(m => {
    const square = document.querySelector(
      `.square[data-row="${m.row}"][data-col="${m.col}"]`
    );
    if (square) square.classList.add("highlight");
  });
}

function clearHighlights() {
  document.querySelectorAll(".square.highlight")
    .forEach(sq => sq.classList.remove("highlight"));
}

/* =========================
   HISTORY (RESTORED CLEAN STYLE)
========================= */

function updateHistoryUI() {
  const historyDiv = document.getElementById("history");
  if (!historyDiv) return;

  historyDiv.innerHTML = "";

  moveHistory.forEach((move, i) => {
    const div = document.createElement("div");
    div.classList.add("history-row");

    const icon = pieceToUnicode(move.piece, move.color);

    div.textContent =
      `${i + 1}. ${icon} ${formatSquare(move.from)} → ${formatSquare(move.to)}`;

    historyDiv.appendChild(div);
  });
}

function formatSquare(pos) {
  const files = ["a","b","c","d","e","f","g","h"];
  return `${files[pos.col]}${8 - pos.row}`;
}

/* =========================
   UNICODE
========================= */

function pieceToUnicode(piece, color) {
  const map = {
    white: {
      king: "♔", queen: "♕", rook: "♖",
      bishop: "♗", knight: "♘", pawn: "♙"
    },
    black: {
      king: "♚", queen: "♛", rook: "♜",
      bishop: "♝", knight: "♞", pawn: "♟"
    }
  };

  return map[color]?.[piece] || "";
}

/* =========================
   RESET
========================= */

function resetGame() {
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

/* =========================
   GAME OVER
========================= */

function showGameOver(title, message) {
  gameOverTitle.textContent = title;
  gameOverMessage.textContent = message;
  gameOverScreen.classList.remove("hidden");
}

function hideGameOver() {
  gameOverScreen.classList.add("hidden");
}