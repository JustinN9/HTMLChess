/**
 * board.js
 * Descriptions: This module is strictly responsible for board representation and UI rendering. It does NOT handle move validation or game rules.
 * Author: Justin Norton
 * Last Updated: 05-20-2026
 * Notes:
 *  
 *  Handles:
 *    - Initial board setup
 *    - Rendering the board state to the DOM
 */

import { Piece } from "./piece.js";

/**
 * Represents the starting position of a standard chess game.
 *
 * Board structure:
 * - 8x8 2D array
 * - Each entry is either a Piece or null
 *
 * Coordinate system:
 * - board[row][col]
 * - row 0 → Black's back rank
 * - row 7 → White's back rank
 *
 * @type {(Piece | null)[][]}
 */
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

/**
 * Renders the current board state into a DOM container.
 *
 * This function:
 * - Clears the container before rendering
 * - Iterates through each square in the board array
 * - Creates DOM elements for squares
 * - Applies alternating light/dark styles
 * - Displays piece symbols when present
 *
 * NOTE:
 * - This function is purely visual and does not modify game state
 * - Uses dataset attributes for row/col to support event handling
 *
 * @param {HTMLElement} container - DOM element where the board will be rendered
 * @param {(Piece | null)[][]} boardArray - Current board state
 * @returns {void}
 */
export function renderBoard(container, boardArray) {
  container.innerHTML = '';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');

      square.classList.add('square');
      square.classList.add(
        (row + col) % 2 === 0 ? 'light' : 'dark'
      );

      square.dataset.row = row;
      square.dataset.col = col;

      const piece = boardArray[row][col];

      if (piece) {
        const pieceElement = document.createElement('span');

        pieceElement.classList.add(
          'piece',
          `${piece.color}-piece`
        );

        pieceElement.textContent = piece.symbol;

        square.appendChild(pieceElement);
      }

      container.appendChild(square);
    }
  }
}