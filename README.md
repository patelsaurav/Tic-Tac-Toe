# Real-Time Tic-Tac-Toe Game

This is a real-time multiplayer Tic-Tac-Toe game built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO for real-time communication.

## Live Demo

You can play the live demo of the game here:

[https://tic-tac-toe-game-icnhi8aux-patel-sauravs-projects.vercel.app/](https://tic-tac-toe-game-icnhi8aux-patel-sauravs-projects.vercel.app/)

## Features

## Functionality

* Users start by entering a unique Room ID and their Player Name on the homepage to join or create a game session.
* Upon submission, users are directed to a Waiting Room interface.
* The Waiting Room displays the entered Room ID and Player Name.
* Users in the Waiting Room wait for a second player to connect using the same Room ID.
* The system restricts room entry to a maximum of two players.
* Once two players are present, the game board is displayed, and the gameplay begins.
* Players alternate turns, marking cells on the 3x3 grid with 'X' or 'O'.
* The game logic determines a winner based on row, column, or diagonal completion, or a draw if all cells are filled.
* The game outcome (win, lose, or draw) is clearly presented to the players.
* A restart option is available, enabling players to play another game in the same room.

## Tech Stack

* **Frontend:** React.js, Tailwind CSS, Socket.IO-client, react-confetti, react-toastify
* **Backend:** Node.js, Express.js, Socket.IO, MongoDB, Mongoose

## Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (version 18 or later recommended)
    * You can download it from: [https://nodejs.org/](https://nodejs.org/)
* npm (Node Package Manager) or Yarn (if you prefer)
    * npm comes with Node.js
    * You can install Yarn from: [https://yarnpkg.com/](https://yarnpkg.com/)
* MongoDB
    * You can install MongoDB Community Server locally or use a cloud-based service like MongoDB Atlas ([https://www.mongodb.com/atlas](https://www.mongodb.com/atlas))

## Installation and Setup

Follow these steps to set up and run the game locally:

1.  **Clone the Repository (if you have the code on a platform like GitHub, GitLab, or Bitbucket):**

    ```bash
    git clone <repository-url>
    cd tic-tac-toe
    ```

2.  **Backend Setup:**

    * Navigate to the backend directory:

        ```bash
        cd backend
        ```

    * Install backend dependencies:

        ```bash
        npm install

    * Create a `.env` file in the `backend` directory and add your MongoDB connection string:

        ```
        MONGO_URI=your-mongodb-connection-string 
        ```

        * Replace `your-mongodb-connection-string` with the actual connection string from your MongoDB setup. If you're using MongoDB Atlas, follow their instructions to get this string.

    * Start the backend server:

        ```bash
        npm run dev
        ```

        * This will typically start the server on `http://localhost:5000`.

3.  **Frontend Setup:**

    * Open a new terminal window or tab.
    * Navigate to the frontend directory:

        ```bash
        cd frontend
        ```

    * Install frontend dependencies:

        ```bash
        npm install

    * Start the frontend development server:

        ```bash
        npm run dev
        ```

        * This will usually start the React development server on `http://localhost:5173`.

4.  **Play the Game:**

    * Open your browser and go to `http://localhost:5173` (or the URL where your frontend is running).
   

