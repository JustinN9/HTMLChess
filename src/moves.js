export function canMove(piece, fromRow, fromCol, toRow, toCol, board) {
  if (!piece) return false;
  switch (piece.type) {
    case "pawn":
      return pawnMove(piece, fromRow, fromCol, toRow, toCol, board);
    case "rook":
      return rookMove(piece, fromRow, fromCol, toRow, toCol, board);
    default:
      return false;
  }

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
}


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
}

}
