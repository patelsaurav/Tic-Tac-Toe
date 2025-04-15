import mongoose from 'mongoose';

const PlayerGameSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  players: [
    {
      playerId: String,
      playerName: String,
    },
  ],
  moves: [
    {
      player: String, 
      position: Number, 
    },
  ],
  winner: {
    type: String,
    default: null,
  },
  isGameOver: {
    type: Boolean,
    default: false,
  },
});

const PlayerGame = mongoose.model('Game', PlayerGameSchema);

export default PlayerGame;