class Piece{
    constructor(type, color){
        this.type = type;
        this.color = color;
    }
}

const PieceTypes = {
    Pawn: new Piece('Pawn', null),
    Rook: new Piece('Rook', null),
    Bishop: new Piece('Bishop', null),
    Knight: new Piece('Knight', null),
    Queen:new Piece('Queen', null),
    King: new Piece('King', null)
}

function createPiece(type, color){
    const template = PieceTypes[type];
    return new ChessPiece(template.type, color);
}