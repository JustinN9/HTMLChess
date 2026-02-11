export function canMove(piece, fromRow, fromCol, toRow, toCol, board) {

  if (!piece) return false;

  switch (piece.type) {
    case "king":
        return kingMove(piece, fromRow, fromCol, toRow, toCol, board);
    case "queen":
        return queenMove(piece, fromRow, fromCol, toRow, toCol, board);
    case "rook":
        return rookMove(piece, fromRow, fromCol, toRow, toCol, board);
    case "bishop":
        return bishopMove(piece, fromRow, fromCol, toRow, toCol, board);
    case "knight":
        return knightMove(piece, fromRow, fromCol, toRow, toCol, board);
    case "pawn":
        return pawnMove(piece, fromRow, fromCol, toRow, toCol, board);
    default:
      return false;
  }

    //King movement
    function kingMove(piece, fr, fc, tr, tc, board) {
        return true;
    }

    //Queen movement
    function queenMove(piece, fr, fc, tr, tc, board) {
        return true;
    }

    //Rook movement
    function rookMove(piece, fr, fc, tr, tc, board) {
        return true;
    }

    //Bishop movement
    function bishopMove(piece, fr, fc, tr, tc, board) {
        return true;
    }

    //Knight movement
    function knightMove(piece, fr, fc, tr, tc, board) {
        return true;
    }

    //Pawn movement
    function pawnMove(piece, fr, fc, tr, tc, board) {
        return true;
    }

    /*

  //Pawn movement
  function pawnMove(piece, fr, fc, tr, tc, board) {
  const dir = piece.color === "white" ? -1 : 1;

  //Move two forward iff first move for pawn

  //Move one forward
  if (fc === tc && tr === fr + dir && board[tr][tc] === null) {
    return true;
  }

  //En passant

  return false;
}*/

//Rook movement
/*
function rookMove(piece, fr, fc, tr, tc, board) {
  if (fr !== tr && fc !== tc) return false;

  // path blocking
  const rowStep = Math.sign(tr - fr);
  const colStep = Math.sign(tc - fc);

  let r = fr + rowStep;
  let c = fc + colStep;

  while (r !== tr || c !== tc) {
    if (board[r][c] !== null) return false;
    r += rowStep;
    c += colStep;
  }

  return true;
}*/

}
