import { createBoard, isValidMove } from './engine';

const board = createBoard();

// Test Cha movement
console.log('Test Cha movement:', isValidMove(board, {r: 9, c: 0}, {r: 8, c: 0}, 'cho')); // Should be true

// Test Jol movement
console.log('Test Jol movement:', isValidMove(board, {r: 6, c: 0}, {r: 5, c: 0}, 'cho')); // Should be true

// Test Invalid Move
console.log('Test Invalid Move:', isValidMove(board, {r: 9, c: 0}, {r: 7, c: 0}, 'cho')); // Should be false
