import { initialBoard, renderBoard } from './board.js';

const boardContainer = document.getElementById('board');

renderBoard(boardContainer, initialBoard);