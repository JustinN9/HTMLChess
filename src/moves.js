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
        return (Math.abs(tr - fr) <= 1 && Math.abs(tc - fc) <= 1);
    }

    //Queen movement
    function queenMove(piece, fr, fc, tr, tc, board) {
        return (rookMove(fr, fc, tr, tc, board) || bishopMove(fr, fc, tr, tc, board));
    }

    //Rook movement
    function rookMove(piece, fr, fc, tr, tc, board) {
        if (fr !== tr && fc !== tc) return false;
        return isPathClear(fr, fc, tr, tc, board);
    }

    //Bishop movement
    function bishopMove(piece, fr, fc, tr, tc, board) {
        if (Math.abs(tr - fr) !== Math.abs(tc - fc)) return false;
        return isPathClear(fr, fc, tr, tc, board);
    }

    //Knight movement
    function knightMove(piece, fr, fc, tr, tc, board) {
        const dr = Math.abs(tr - fr);
        const dc = Math.abs(tc - fc);
        return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
    }

    //Pawn movement
    function pawnMove(piece, fr, fc, tr, tc, board) {
        const dir = piece.color === "white" ? -1 : 1;
        const startRow = piece.color === "white" ? 6 : 1;
        
        //Move forward one space
        if (fc === tc && tr === fr + dir && board[tr][tc] === null) {
            return true;
        }

        //Move forawrd two spaces from start
        if (
            fr === startRow &&
            fc === tc &&
            tr === fr + dir * 2 &&
            board[fr + dir][fc] === null &&
            board[tr][tc] === null) {
            return true;
        }

        //Capture
        if (
            Math.abs(tc - fc) === 1 &&
            tr === fr + dir &&
            board[tr][tc] !== null) {
            return true;
        }
        
        return false;
    }

    function isPathClear(fr, fc, tr, tc, board) {
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

export function getLegalMoves(piece, fr, fc, board) {
  const moves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (canMove(piece, fr, fc, r, c, board)) {
        moves.push({ row: r, col: c });
      }
    }
  }

  return moves;
}

