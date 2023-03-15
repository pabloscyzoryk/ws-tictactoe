// imports
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import checkWinner from "./utils/checkWinner.js";

// types & interfaces
import { RoomI } from "./interfaces/RoomI";

const PORT = process.env.PORT || 8000;

const rooms: { [key: number | string]: RoomI } = {};

// server init
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  pingTimeout: 120_000
});

console.log('Server up and running :)');

io.on("connection", (socket: Socket) => {
  console.log(`new connection: ${socket.id}`);

  socket.on("disconnect", () => {
    // finish all games with socket.id
    console.log(`disconnected: ${socket.id}`);
  });

  socket.on("check-room", (roomId) => {
    console.log(`check room: ${roomId} emited from ${socket.id}`);

    if (!rooms[roomId]) {
      socket.emit("room-available", roomId);
      return;
    }

    if (rooms[roomId].users.length > 1) {
      socket.emit("bad-check", "This room is full");
      return;
    }

    socket.emit("room-available", roomId);
  });

  socket.on("join-room", (roomId, nickname: string) => {
    console.log(`join-room: ${roomId} emited from`, socket.id);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        id: roomId,
        users: [],
        board: [null, null, null, null, null, null, null, null, null],
        isXMove: true,
        isGameFinished: false,
        chat: [],
        winner: null,
        turns: 0,
        wonConditions: [],
        score: {
          playerO: 0,
          playerX: 0,
        },
        requestedRematch: false,
      };
    }

    if (rooms[roomId].users.length > 1) {
      socket.emit("bad-check", "This room is full");
      return;
    }

    if (!rooms[roomId].users.find((user) => user.id === socket.id)) {
      if (nickname.length > 15) {
        nickname = nickname.slice(0, 15);
      } 

      rooms[roomId].users.push({ id: socket.id, nickname });
    }

    socket.join(roomId);
    io.to(roomId).emit("update", rooms[roomId]);
    console.log(rooms, rooms[roomId]);
  });

  socket.on("move", (roomId: string, move: number) => {
    if (!rooms[roomId]) {
      return;
    }

    if (typeof move !== "number") {
      return;
    }

    move = Math.floor(move);

    if (move < 0 || move > 8) {
      return;
    }

    if (rooms[roomId].isGameFinished) {
      return;
    }

    if (rooms[roomId].board[move] !== null) {
      return;
    }

    if (rooms[roomId].isXMove && rooms[roomId].users[0].id !== socket.id) {
      return;
    }

    if (!rooms[roomId].isXMove && rooms[roomId].users[1].id !== socket.id) {
      return;
    }

    rooms[roomId].board[move] = rooms[roomId].isXMove ? "X" : "O";
    rooms[roomId].isXMove = !rooms[roomId].isXMove;
    rooms[roomId].turns++;

    const { winner, wonConditions } = checkWinner(rooms[roomId].board);

    if (winner) {
      rooms[roomId].isGameFinished = true;
      rooms[roomId].wonConditions = wonConditions;
      rooms[roomId].winner = winner;

      switch (winner) {
        case "X":
          rooms[roomId].score.playerX++;
          break;

        case "O":
          rooms[roomId].score.playerO++;
          break;

        case "D":
          rooms[roomId].score.playerO += 0.5;
          rooms[roomId].score.playerX += 0.5;
          break;

        default:
          break;
      }
    } 
    io.to(roomId).emit("update", rooms[roomId]);

  });

  socket.on('send-rematch-request', roomId => {
    if (rooms[roomId]) {
      rooms[roomId].requestedRematch = true;
      socket.to(roomId).emit('rematch-request');
    }
  });

  socket.on('accept-rematch', roomId => {
    if (rooms[roomId]) {
      if (rooms[roomId].requestedRematch) {
        io.to(roomId).emit('start-rematch');

        rooms[roomId].board = [null, null, null, null, null, null, null, null, null];
        rooms[roomId].isXMove = true;
        rooms[roomId].isGameFinished = false;
        rooms[roomId].winner = null;
        rooms[roomId].turns = 0;
        rooms[roomId].wonConditions = [];
        rooms[roomId].requestedRematch = false;
        const save = rooms[roomId].users[0];
        rooms[roomId].users[0] = rooms[roomId].users[1];
        rooms[roomId].users[1] = save;
        
        io.to(roomId).emit('update', rooms[roomId])
      }
    }
  })

  socket.on("message", (roomId, message: string) => {
    console.log("message emited from", socket.id);
    if (rooms[roomId]) {

      if (message.length > 150) {
        message = message.slice(0, 150);
      }

      rooms[roomId].chat.push({
        date: new Date(),
        text: message,
        id: rooms[roomId].chat.length,
        author: rooms[roomId].users.find((user) => user.id === socket.id)
          .nickname,
      });

      io.to(roomId).emit("update", rooms[roomId]);
    }
  });
});

httpServer.listen(PORT);
