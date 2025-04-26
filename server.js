// --- Backend (Node.js + Socket.IO) ---

// server/index.js
import { Server } from "socket.io";
import  http from "http";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const calledNumbers = [];
const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1); // Example 1-90

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("host:call_number", () => {
    const remaining = allNumbers.filter((n) => !calledNumbers.includes(n));
    if (remaining.length > 0) {
      const newNumber = remaining[Math.floor(Math.random() * remaining.length)];
      calledNumbers.push(newNumber);
      io.emit("server:new_number", newNumber);
    }
  });

  socket.on("player:bingo_request", (playerBoard) => {
    // Simplified validation for demo
    const flatBoard = playerBoard.flat();
    const matched = flatBoard.filter((num) =>
      calledNumbers.includes(num)
    ).length;
    if (matched >= 5) {
      // assume 5 matches is enough for bingo
      io.emit("server:bingo_success", socket.id);
    } else {
      socket.emit("server:bingo_fail");
    }
  });

  socket.on("host:restart_game", () => {
    calledNumbers.length = 0;
    io.emit("server:restart_game");
  });
});

server.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
});
