import { Piece } from "./piece.js";

export const initialBoard = [
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
  Array(8).fill(null).map(() => null),
  Array(8).fill(null).map(() => null),
  Array(8).fill(null).map(() => null),
  Array(8).fill(null).map(() => null),
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
  ],
];

export function renderBoard(container, boardArray) {
  container.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = row;
      square.dataset.col = col;
      const piece = boardArray[row][col];
      square.textContent = piece ? piece.symbol : '';
      container.appendChild(square);
    }
  }
}