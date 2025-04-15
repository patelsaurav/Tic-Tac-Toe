import React from 'react';

const ResultModal = ({ winner, onRestart, onGoHome, show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">
          {winner === 'draw' ? 'It\'s a Draw!' : `Player ${winner} Wins!`}
        </h2>
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onRestart}
          >
            Restart Game
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onGoHome}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;