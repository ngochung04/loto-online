// --- Backend (Node.js + Socket.IO) ---

// server/index.js
import { Server } from "socket.io";
import http from "http";
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
  console.log("A user connected:", io.engine.clientsCount, socket.id);

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

  socket.on("request_login", (_) => {
    io.emit("request_login", {
      name: "SYSTEM",
      ticketId: 0,
      message: _ + " join this room.",
    });
  });

  socket.on("request_logout", (_) => {
    io.emit("request_logout", {
      name: "SYSTEM",
      ticketId: 0,
      message: _ + " out this room.",
    });
  });

  socket.on("request_ticket", (_) => {
    io.emit("request_ticket", {
      name: "SYSTEM",
      ticketId: 0,
      message: _.name + " choose ticket number " + _.ticketId + ".",
    });
  });

  socket.on("request_bingo", (_) => {
    io.emit("request_bingo", {
      name: "SYSTEM",
      ticketId: 0,
      message: _.name + " request Bingo!!!",
    });
  });
});

server.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
});
