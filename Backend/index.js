import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './Database/db.js';
import initializeSocket from './sockets/gameSocket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;



// Middleware
app.use(cors());
app.use(express.json());



// DB connection
connectDB();

// Initialize Socket.IO
initializeSocket(server);



// Start server
server.listen(port, () => {
  console.log('Server is running on port:', port);
});
