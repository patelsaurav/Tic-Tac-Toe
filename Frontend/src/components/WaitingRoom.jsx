import React from 'react';

const WaitingRoom = ({ roomId, playerName, isWaiting, players }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Waiting to Join Room: {roomId}</h2>
      <p className="mb-2">Hello, {playerName}!</p>
      {isWaiting ? (
        <p className="italic text-gray-600">Waiting for another player to join...</p>
      ) : (
        <p className="text-green-500 font-semibold">Player 2 has joined. Game starting soon!</p>
      )}
      {players.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Players in Room:</h3>
          <ul>
            {players.map((player) => (
              <li key={player.playerId}>{player.playerName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;