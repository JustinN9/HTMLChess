/**
 * piece.js
 * Descriptions: Contains all logic related to pieces, responsible for generation and promotion of pieces.
 * Author: Justin Norton
 * Last Updated: 05-25-2026
 * Notes: N/A
 */

/**
 * Represents the chess pieces.
 */
export class Piece {
  /**
   * Creates a new chess piece.
   *
   * @param {"king" | "queen" | "rook" | "bishop" | "knight" | "pawn"} type - Type of the piece.
   * @param {"white" | "black"} color - Color of the piece.
   */

  constructor(type, color) {
    /**
     * The type of the piece (e.g., "pawn", "rook").
     * @type {string}
     */
    this.type = type;

    /**
     * The color of the piece.
     * @type {string}
     */
    this.color = color;

    /**
     * Unicode symbol used for rendering the piece.
     * @type {string}
     */
    this.symbol = this.toUnicode();

    /**
     * Tracks whether the piece has moved.
     * Important for castling and pawn movement rules.
     * @type {boolean}
     */
    this.hasMoved = false;
  }

  /**
   * Converts the piece type and color into a Unicode chess symbol.
   *
   * @returns {string} Unicode character representing the piece.
   */
  toUnicode() {
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

    return map[this.color][this.type];
  }
}

/**
 * Promotes a pawn to another piece type. Prompts the user for a 
 * choice, validates, defaults to queen if invalid and updates the piece.
 *
 * @param {number} row - Row index of the pawn.
 * @param {number} col - Column index of the pawn.
 * @param {(Piece | null)[][]} board - Current board state.
 * @returns {void}
 */
export function promotePawn(row, col, board) {

  const piece = board[row][col];
  const newType = prompt(
    "Promote your pawn to: (queen, rook, bishop, knight)",
    "queen"
  ).toLowerCase();
  const validPromotions = ["queen", "rook", "bishop", "knight"];

  if (!validPromotions.includes(newType)) {
    alert("Invalid choice, promoting to queen by default");
    piece.type = "queen";
  } else {
    piece.type = newType;
  }

  piece.symbol = piece.toUnicode();
}