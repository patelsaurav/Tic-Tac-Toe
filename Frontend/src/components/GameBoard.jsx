import React from 'react';
//board logic using display grid
const GameBoard = ({ board, turn, winner, makeMove, restartGame, playerName, players }) => {
  const currentPlayer = players.find(p => p.playerId === (turn === 'X' ? players[0]?.playerId : players[1]?.playerId))?.playerName;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Tic-Tac-Toe</h2>
      {winner ? (
        <div className="mb-4 text-lg font-semibold">{winner}</div>
      ) : (
        <div className="mb-4 text-gray-700">
          Turn: <span className="font-semibold">{currentPlayer} ({turn})</span>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => (
          <button
            key={index}
            className={`w-20 h-20 border text-4xl font-bold flex items-center justify-center focus:outline-none ${
              value === 'X' ? 'text-blue-500' : value === 'O' ? 'text-green-500' : 'text-gray-700'
            }`}
            onClick={() => makeMove(index)}
            disabled={winner || value}
          >
            {value}
          </button>
        ))}
      </div>
      {winner && (
        <button
          className="mt-6 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={restartGame}
        >
          Restart Game
        </button>
      )}
    </div>
  );
};

export default GameBoard;