export class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.symbol = this.toUnicode();
  }

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