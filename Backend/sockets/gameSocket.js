import { Server } from 'socket.io';
import GameModel from '../Database/Models/PlayerGame.js';

const games = {};

const initializeSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
          origin: '*', 
          methods: ['GET', 'POST'],
        },
      });
  io.on('connection', (socket) => {
    console.log(`User connecte with socket ${socket.id}`);

    socket.on('joinRoom', async ({ roomId, playerName }) => {
      socket.join(roomId);
      
      //check game is exist or not if exist then emit event to start game
      if (!games[roomId]) {
        games[roomId] = {
          players: [{ playerId: socket.id, playerName }],
          board: Array(9).fill(null),
          turn: 'X',
          winner: null,
          isGameOver: false,
        };
        try {
          await GameModel.create({ roomId, players: games[roomId].players });
        } catch (error) {
          if (error.code === 11000) {
            socket.emit('roomAlreadyExists', 'This room ID is already taken.');
            delete games[roomId]; 
            return;
          }
          console.error('Error in creatin room', error);
          socket.emit('databaseError', 'An error occurred while creating the game.');
          delete games[roomId];
          return;
        }
        io.to(socket.id).emit('waitingForPlayer');
      } else if (games[roomId].players.length < 2 && !games[roomId].isGameOver) {
        //second player joined so startgame event fire
        games[roomId].players.push({ playerId: socket.id, playerName });
        io.to(roomId).emit('playerJoined', games[roomId].players);
        io.to(roomId).emit('startGame', games[roomId].turn);

        try {
          await GameModel.updateOne({ roomId }, { $push: { players: { playerId: socket.id, playerName } } });
        } catch (error) {
          console.error('internal server error', error);
        }
      }
     
      else {
        socket.emit('roomFull', 'This room is full.');
      }
    });

     //when player making move 
    socket.on('makeMove', async ({ roomId, index }) => {
      const game = games[roomId];
      if (game && !game.isGameOver && game.players.find(p => p.playerId === socket.id) &&
          ((game.turn === 'X' && game.players[0].playerId === socket.id) ||
           (game.turn === 'O' && game.players[1].playerId === socket.id)) &&
          !game.board[index]) {
        game.board[index] = game.turn;
        io.to(roomId).emit('moveMade', { index, player: game.turn });
        //checkfor winner if exist then game is over else make move and change turn
        const winner = checkWinner(game.board);
        if (winner) {
          game.isGameOver = true;
          game.winner = winner;
          io.to(roomId).emit('gameOver', winner);
          await GameModel.updateOne({ roomId }, { winner, isGameOver: true, moves: game.board.map((move, i) => move ? { player: move, position: i } : null).filter(Boolean) });
        } else if (game.board.every(cell => cell !== null)) {
          game.isGameOver = true;
          game.winner = 'draw';
          io.to(roomId).emit('gameOver', 'draw');
          await GameModel.updateOne({ roomId }, { winner: 'draw', isGameOver: true, moves: game.board.map((move, i) => move ? { player: move, position: i } : null).filter(Boolean) });
        } else {
          game.turn = game.turn === 'X' ? 'O' : 'X';
          io.to(roomId).emit('changeTurn', game.turn);
        }
      }
    });

    //btn click of restart btn fill board again with empty
    socket.on('restartGame', async ({ roomId }) => {
      const game = games[roomId];
      if (game && game.isGameOver) {
        game.board = Array(9).fill(null);
        game.turn = 'X';
        game.winner = null;
        game.isGameOver = false;
        io.to(roomId).emit('gameRestarted', game.turn);
        await GameModel.updateOne({ roomId }, { moves: [], winner: null, isGameOver: false });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected',socket.id);
      //find the room and notify user that playerleft from the game
      for (const roomId in games) {
        games[roomId].players = games[roomId].players.filter(
          (player) => player.playerId !== socket.id
        );
        io.to(roomId).emit('playerLeft', games[roomId].players);
        if (games[roomId].players.length === 0 && games[roomId].isGameOver) {
          delete games[roomId];
          try {
            GameModel.deleteOne({ roomId }).exec();
          } catch (error) {
            console.error('deletion error', error);
          }
        }
      }
    });
  });
};

//check winner at current game point
function checkWinner(board) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default initializeSocketIO;