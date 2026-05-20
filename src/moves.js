/**
 * moves.js
 * Descriptions: This module contains the core game logic of the chess engine.
 * Author: Justin Norton
 * Last Updated: 05-20-2026
 * Notes: 
 * 
 *  Handles:
 *    - Move validation for all pieces
 *    - Legal move generation
 *    - Check, checkmate, and draw conditions
 */

/**
 * moves.js
 *
 * Handles:
 * - Move validation for all pieces
 * - Legal move generation
 * - Check, checkmate, and draw conditions
 *
 * This module contains the core game logic of the chess engine.
 */

/**
 * Determines if a move is valid based on piece movement rules.
 *
 * NOTE:
 * - Does NOT check if the move leaves the king in check
 * - That is handled separately in getLegalMoves()
 *
 * @param {import("./piece.js").Piece} piece
 * @param {number} fromRow
 * @param {number} fromCol
 * @param {number} toRow
 * @param {number} toCol
 * @param {(import("./piece.js").Piece | null)[][]} board
 * @param {Object} [lastMove] - Last move played (used for en passant)
 * @returns {boolean}
 */

export function canMove(piece, fromRow, fromCol, toRow, toCol, board, lastMove) {

    const target = board[toRow][toCol];

    if (target && target.color === piece.color) return false;

    // Cannot capture your own piece
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
            return pawnMove(piece, fromRow, fromCol, toRow, toCol, board, lastMove);
        default:
            return false;
  }

    //King movement
    function kingMove(piece, fr, fc, tr, tc, board) {
        const dr = Math.abs(tr - fr);
        const dc = Math.abs(tc - fc);
        
        //Normal movement
        if (dr <= 1 && dc <= 1) return true;

        //Castling
        if (!piece.hasMoved && dr === 0 && dc === 2) {
            if (tc > fc) return canCastle(piece.color, "kingside", board);
            else return canCastle(piece.color, "queenside", board);
        }

        return false;
    }

    //Queen movement
    function queenMove(piece, fr, fc, tr, tc, board) {
        return (rookMove(piece, fr, fc, tr, tc, board) || bishopMove(piece, fr, fc, tr, tc, board));
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
    function pawnMove(piece, fr, fc, tr, tc, board, lastMove) {
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

        //En passant
        if (
          lastMove &&
          lastMove.piece.type === "pawn" &&
          Math.abs(lastMove.from.row - lastMove.to.row) === 2 // moved two squares
          ) {
            const enemyPawnRow = lastMove.to.row;
            const enemyPawnCol = lastMove.to.col;
            
            if (
              enemyPawnRow === fr &&                 // enemy pawn beside us
              Math.abs(enemyPawnCol - fc) === 1 &&   // exactly one square sideways
              tr === fr + dir &&                     // moving diagonally forward
              tc === enemyPawnCol &&                 // moving into capture column
              board[tr][tc] === null                 // landing square empty
            ) {
          return true;
        }
      }
      return false;
    }

    /**
     * Checks if path between two squares is unobstructed.
     */
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

/**
 * Checks if the given player's king is in check.
 *
 * @param {"white" | "black"} color
 * @param {(import("./piece.js").Piece | null)[][]} board
 * @returns {boolean}
 */
export function isKingInCheck(color, board) {
  let kingPos = null;

  //Find king
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === "king" && piece.color === color) {
        kingPos = { row: r, col: c };
      }
    }
  }

  if (!kingPos) return false;

  //Check all enemy moves
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color !== color) {
        if (canMove(piece, r, c, kingPos.row, kingPos.col, board)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Simulates a move without mutating the original board.
 *
 * NOTE:
 * - Shallow copy (safe for current Piece structure)
 */
function simulateMove(board, fr, fc, tr, tc) {
  const copy = board.map(row => row.slice());

  copy[tr][tc] = copy[fr][fc];
  copy[fr][fc] = null;

  return copy;
}

/**
 * Generates all legal moves for a piece.
 *
 * Legal moves:
 * - Must follow movement rules
 * - Must NOT leave king in check
 */
export function getLegalMoves(piece, fr, fc, board, lastMove) {
  const moves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (canMove(piece, fr, fc, r, c, board, lastMove)) {
        const simulated = simulateMove(board, fr, fc, r, c);

        // Reject moves that leave king in check
        if (!isKingInCheck(piece.color, simulated)) {
          moves.push({ row: r, col: c });
        }
      }
    }
  }

  return moves;
}

/**
 * Determines whether the given player is in checkmate.
 *
 * A position is checkmate if:
 * 1. The king is currently in check
 * 2. The player has no legal moves available
 *
 * @param {"white" | "black"} color - Player to evaluate
 * @param {(import("./piece.js").Piece | null)[][]} board - Current board state
 * @param {Object} [lastMove] - Last move played (required for full legality checks)
 * @returns {boolean}
 */
export function isCheckmate(color, board) {
  // If the king is not in check, it's not checkmate
  if (!isKingInCheck(color, board)) return false;

  // Check if the player has any legal moves
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        if (getLegalMoves(piece, r, c, board, lastMove).length > 0) {
          return false; // At least one legal move exists
        }
      }
    }
  }

  return true; // No legal moves & king in check therefore checkmate
}

/**
 * Determines whether castling is legal for a given side.
 *
 * Conditions:
 * - King and rook have not moved
 * - Squares between them are empty
 * - King is not currently in check
 * - King does not pass through or land on an attacked square
 *
 * @param {"white" | "black"} color
 * @param {"kingside" | "queenside"} side
 * @param {(import("./piece.js").Piece | null)[][]} board
 * @returns {boolean}
 */
function canCastle(color, side, board) {
  const row = color === "white" ? 7 : 0;
  const kingCol = 4;

  // King cannot currently be in check
  if (isKingInCheck(color, board)) return false;

  //Kingside
  if (side === "kingside") {
    const rook = board[row][7];
    if (!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved) return false;
    if (board[row][5] || board[row][6]) return false; // squares must be empty
    if (isSquareAttacked(row, 5, color, board) || isSquareAttacked(row, 6, color, board)) return false;
    return true;
  } else { //Queenside
    const rook = board[row][0];
    if (!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved) return false;
    if (board[row][1] || board[row][2] || board[row][3]) return false; // squares must be empty
    if (isSquareAttacked(row, 2, color, board) || isSquareAttacked(row, 3, color, board)) return false;
    return true;
  }
}

/**
 * Determines whether a square is attacked by any opposing piece.
 *
 * Used for:
 * - Check detection
 * - Castling validation
 *
 * @param {number} row
 * @param {number} col
 * @param {"white" | "black"} color - Color being defended
 * @param {(import("./piece.js").Piece | null)[][]} board
 * @returns {boolean}
 */
function isSquareAttacked(row, col, color, board) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color !== color) {
        if (canMove(piece, r, c, row, col, board)) return true;
      }
    }
  }
  return false;
}

/**
 * Determines whether the position is a stalemate.
 *
 * A position is stalemate if:
 * - The player is NOT in check
 * - The player has NO legal moves
 *
 * @param {"white" | "black"} color
 * @param {(import("./piece.js").Piece | null)[][]} board
 * @param {Object} [lastMove]
 * @returns {boolean}
 */
export function isStalemate(color, board) {
  if (isKingInCheck(color, board)) return false;

  //Check for legal moves
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const moves = getLegalMoves(piece, r, c, board);
        if (moves.length > 0) {
          return false; // At least one legal move exists
        }
      }
    }
  }

  //Statemate
  return true;
}

/**
 * Determines whether the game is a draw due to insufficient material.
 *
 * Covered cases:
 * - King vs King
 * - King + minor piece vs King
 * - King + bishop vs King + bishop (simplified rule)
 *
 * NOTE:
 * This is a simplified implementation and does not account for:
 * - Bishop square color (important in official rules)
 *
 * @param {(import("./piece.js").Piece | null)[][]} board
 * @returns {boolean}
 */
export function isInsufficientMaterial(board) {
  const pieces = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]) pieces.push(board[r][c]);
    }
  }

  // King vs King
  if (pieces.length === 2) return true;

  // King + minor vs King
  if (pieces.length === 3) {
    return pieces.some(p => p.type === "bishop" || p.type === "knight");
  }

  // King + bishop vs King + bishop (same color)
  if (pieces.length === 4) {
    const bishops = pieces.filter(p => p.type === "bishop");
    if (bishops.length === 2) return true;
  }

  return false;
}