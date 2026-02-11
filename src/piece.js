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