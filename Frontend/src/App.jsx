import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import WaitingRoom from './components/WaitingRoom.jsx';
import GameBoard from './components/GameBoard.jsx';
import io from 'socket.io-client';
import Confetti from 'react-confetti'; // Import Confetti
import { ToastContainer, toast } from 'react-toastify';
  


const socket = io('http://localhost:5000');

function App() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningCombination, setWinningCombination] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false); // State for confetti
  const [isWaiting, setIsWaiting] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    socket.on('playerJoined', (players) => {
      setPlayers(players);
      if (players.length === 2) {
        setIsWaiting(false);
      }
    });
    if (confettiActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    socket.on('waitingForPlayer', () => {
      setIsWaiting(true);
    });

    socket.on('startGame', (initialTurn) => {
      setIsGameStarted(true);
      setTurn(initialTurn);
      navigate('/game');
    });

    socket.on('moveMade', ({ index, player }) => {
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[index] = player;
        return newBoard;
      });
    });

    socket.on('changeTurn', (newTurn) => {
      setTurn(newTurn);
    });

    socket.on('gameOver', (result) => {
      setWinner(result === 'draw' ? 'Draw!' : `${result} wins!`);
      const winningCombo = checkWinningCombination(board);
      setWinningCombination(winningCombo);
      setConfettiActive(result !== 'draw');
      setIsGameStarted(false);
    });

    socket.on('gameRestarted', (newTurn) => {
      setBoard(Array(9).fill(null));
      setConfettiActive(false)
      setWinner(null);
      setWinningCombination(null);
      setIsGameStarted(true);
      setTurn(newTurn);
    });

    //more than two player not allowed
    socket.on('roomFull', () => {
     toast.warn("Room is full. Please try another room or create new one.")
      setIsWaiting(false);
      navigate('/')
    });

    socket.on('playerLeft', (updatedPlayers) => {
      setPlayers(updatedPlayers);
      if (isGameStarted && updatedPlayers.length < 2) {
        setWinner('Opponent left. Game Over.');
        setIsGameStarted(false);
      }
    });

    socket.on('roomAlreadyExists', (message) => {
      alert(message);
    });

    socket.on('roomAlreadyFinished', (message) => {
      alert(message);
    });
       //css changing for animation 
      const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      };
  
      handleResize(); // Initial call to set dimensions
      window.addEventListener('resize', handleResize);

    return () => {
      //clean up all event on component unmount stage
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', handleResize);
      socket.off('playerJoined');
      socket.off('waitingForPlayer');
      socket.off('startGame');
      socket.off('moveMade');
      socket.off('changeTurn');
      socket.off('gameOver');
      socket.off('gameRestarted');
      socket.off('roomFull');
      socket.off('playerLeft');
      socket.off('roomAlreadyExists');
      socket.off('roomAlreadyFinished');
    };
  }, [navigate, board,confettiActive]); // Added board to dependency array for winning combination check

  //submission of form
  const handleJoinRoom = (roomIdInput, playerNameInput) => {
    setRoomId(roomIdInput);
    setPlayerName(playerNameInput);
    socket.emit('joinRoom', { roomId: roomIdInput, playerName: playerNameInput });
    setIsWaiting(true);
  };

  const makeMove = (index) => {
    if (isGameStarted && !winner && board[index] === null &&
      ((turn === 'X' && players[0]?.playerId === socket.id) ||
        (turn === 'O' && players[1]?.playerId === socket.id))) {
      socket.emit('makeMove', { roomId, index });
    }
  };

  //emit the event onlcick of restart button
  const restartGame = () => {
    socket.emit('restartGame', { roomId });
  };

  //checking winning combination
  function checkWinningCombination(currentBoard) {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6],             // Diagonals
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return combo;
      }
    }
    return null;
  }

  return (
<div className={`bg-gray-100 min-h-screen flex items-center justify-center ${confettiActive ? 'overflow-hidden' : ''}`}>
      <div className="bg-white p-8 rounded shadow-md w-96">
          <Routes>
            <Route
              path="/"
              element={<HomePage onJoinRoom={handleJoinRoom} />}
            />
            <Route
              path="/waiting"
              element={<WaitingRoom roomId={roomId} playerName={playerName} isWaiting={isWaiting} players={players} />}
            />
            <Route
              path="/game"
              element={
                <GameBoard
                  board={board}
                  turn={turn}
                  winner={winner}
                  makeMove={makeMove}
                  restartGame={restartGame}
                  playerName={playerName}
                  players={players}
                  winningCombination={winningCombination} // Pass winningCombination
                />
              }
            />
          </Routes>
          {confettiActive && <Confetti width={width} height={height} />}

      </div>
          <ToastContainer />
    </div>
  );
}

export default App;