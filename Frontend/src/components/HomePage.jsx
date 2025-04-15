import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
  

const HomePage = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId && playerName) {
      onJoinRoom(roomId, playerName);
      navigate('/waiting');
    } else {
      toast.warn("Please enter both Room ID and Player Name.")
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Join a Tic-Tac-Toe Game</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-full">
        <input
          type="text"
          placeholder="Enter Room ID"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Your Name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Join Room
        </button>
      </form>
      <ToastContainer />

    </div>
  );
};

export default HomePage;