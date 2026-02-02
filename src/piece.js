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


/*export class Piece{
    constructor(type, color){
        this.type = type;
        this.color = color;
    }

    toUnicode() {
        const map = {
            white: {
                king: "♔",
                queen: "♕",
                rook: "♖",
                bishop: "♗",
                knight: "♘",
                pawn: "♙"
            },
            black: {
                king: "♚",
                queen: "♛",
                rook: "♜",
                bishop: "♝",
                knight: "♞",
                pawn: "♟"
            }
        };

        return map[this.color][this.type];
    }
}

export const PieceTypes = {
    Pawn: new Piece('Pawn', null),
    Rook: new Piece('Rook', null),
    Bishop: new Piece('Bishop', null),
    Knight: new Piece('Knight', null),
    Queen:new Piece('Queen', null),
    King: new Piece('King', null)
}*/