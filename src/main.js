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
import { Piece, promotePawn } from './piece.js';
import { getLegalMoves } from "./moves.js";
import { isCheckmate } from "./moves.js";

const boardContainer = document.getElementById('board');
const resetButton = document.getElementById("reset");

/* =========================
   GAME OVER UI
========================= */

const gameOverScreen = document.getElementById("game-over");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverMessage = document.getElementById("game-over-message");
const gameOverReset = document.getElementById("game-over-reset");

/* =========================
   GAME STATE
========================= */

let gameOver = false;
let moveHistory = [];

let board = createFreshBoard();
let selectedPiece = null;
let selectedPos = null;
let turn = "white";
let lastMove = null;
let halfMoveClock = 0;
let positionHistory = {};

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

/* =========================
   BOARD CREATION
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
   INPUT
========================= */

function addClickHandlers() {
  boardContainer.addEventListener("click", onSquareClick);
}

function onSquareClick(e) {
  if (gameOver) return;

  const square = e.target.closest(".square");
  if (!square) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const piece = board[row][col];

  document.querySelectorAll(".square.highlight")
    .forEach(sq => sq.classList.remove("highlight"));

  /* SELECT PIECE */
  if (piece && piece.color === turn) {
    selectedPiece = piece;
    selectedPos = { row, col };

    const moves = getLegalMoves(piece, row, col, board, lastMove);
    highlightMoves(moves);

    return;
  }

  const wasCapture = board[row][col] !== null;

  /* MOVE PIECE */
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

  /* CASTLING */
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

  /* EN PASSANT */
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

  /* MOVE */
  board[row][col] = selectedPiece;
  board[selectedPos.row][selectedPos.col] = null;

  halfMoveClock = wasCapture ? 0 : halfMoveClock + 1;

  /* HISTORY MOVE */
  const moveRecord = {
    piece: selectedPiece.type,
    color: selectedPiece.color,
    from: { ...selectedPos },
    to: { row, col },
    capture: wasCapture
  };

  lastMove = moveRecord;
  moveHistory.push(moveRecord);
  updateHistoryUI();

  /* PROMOTION */
  if (selectedPiece.type === "pawn" && (row === 0 || row === 7)) {
    promotePawn(row, col, board);
  }

  selectedPiece.hasMoved = true;
  turn = turn === "white" ? "black" : "white";

  renderBoard(boardContainer, board);

  /* REPETITION */
  const key = generatePositionKey(board, turn);
  positionHistory[key] = (positionHistory[key] || 0) + 1;

  if (positionHistory[key] >= 3) {
    alert("Draw by threefold repetition");
  }

  /* CHECKMATE */
  if (isCheckmate(turn, board, lastMove)) {
    const colorName = turn.charAt(0).toUpperCase() + turn.slice(1);

    showGameOver(
      `${colorName} is checkmated!`,
      "No legal moves available."
    );

    gameOver = true;
    return;
  }

  selectedPiece = null;
  selectedPos = null;
}

/* =========================
   MOVE HIGHLIGHTING
========================= */

function highlightMoves(moves) {
  moves.forEach(m => {
    const square = document.querySelector(
      `.square[data-row="${m.row}"][data-col="${m.col}"]`
    );
    square?.classList.add("highlight");
  });
}

/* =========================
   HISTORY (UNICODE UPGRADE)
========================= */

function updateHistoryUI() {
  const historyDiv = document.getElementById("history");
  if (!historyDiv) return;

  historyDiv.innerHTML = "";

  for (let i = 0; i < moveHistory.length; i += 2) {
    const row = document.createElement("div");
    row.classList.add("history-row");

    const moveNumber = document.createElement("span");
    moveNumber.classList.add("move-number");
    moveNumber.textContent = `${Math.floor(i / 2) + 1}.`;

    const white = document.createElement("span");
    const black = document.createElement("span");

    white.classList.add("move", "white-move");
    black.classList.add("move", "black-move");

    white.textContent = moveHistory[i]
      ? formatMoveSafe(moveHistory[i])
      : "";

    black.textContent = moveHistory[i + 1]
      ? formatMoveSafe(moveHistory[i + 1])
      : "";

    row.appendChild(moveNumber);
    row.appendChild(white);
    row.appendChild(black);

    historyDiv.appendChild(row);
  }
}

/* =========================
   UNICODE PIECES
   "♙"
    "♟"
========================= */

function pieceToUnicode(piece, color) {
  if (!piece) return "";

  const map = {
    white: {
      king: "♔",
      queen: "♕",
      rook: "♖",
      bishop: "♗",
      knight: "♘",
      pawn: ""
    },
    black: {
      king: "♚",
      queen: "♛",
      rook: "♜",
      bishop: "♝",
      knight: "♞",
      pawn: ""
    }
  };

  return map[color]?.[piece] || "";
}

/* =========================
   MOVE FORMATTER
========================= */

function formatMoveSafe(move) {
  const files = ["a","b","c","d","e","f","g","h"];

  if (!move) return "";

  const from = `${files[move.from.col]}${8 - move.from.row}`;
  const to = `${files[move.to.col]}${8 - move.to.row}`;

  const pieceSymbol = pieceToUnicode(move.piece, move.color);
  const capture = move.capture ? "×" : "–";

  return `${pieceSymbol}${from}${capture}${to}`;
}

/* =========================
   RESET
========================= */

function resetGame() {
  gameOver = false;
  hideGameOver();

  board = createFreshBoard();

  selectedPiece = null;
  selectedPos = null;

  turn = "white";
  lastMove = null;

  halfMoveClock = 0;
  positionHistory = {};
  moveHistory = [];

  document.getElementById("history").innerHTML = "";

  renderBoard(boardContainer, board);
}

/* =========================
   GAME OVER UI
========================= */

function showGameOver(title, message) {
  gameOverTitle.textContent = title;
  gameOverMessage.textContent = message;
  gameOverScreen.classList.remove("hidden");
}

function hideGameOver() {
  gameOverScreen.classList.add("hidden");
}

/* =========================
   POSITION KEY
========================= */

function generatePositionKey(board, turn) {
  let key = "";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      key += p ? p.type[0] + p.color[0] : "--";
    }
  }

  return key + turn;
}