import { BoardT } from "../types/BoardT";

const checkWinner = (board: BoardT) => {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningPatterns.length; i++) {
    const [a, b, c] = winningPatterns[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], wonConditions: [a, b, c] };
    }
  }

  // D stands for draw

  if(!board.some(item => item === null || !["O", "X"].includes(item))) {
    return { winner: "D", wonConditions: [] };
  }

  return { winner: null, wonConditions: [] } 
};


export default checkWinner;
