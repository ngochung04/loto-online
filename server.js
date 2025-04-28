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

let userList = [];
let isStartGame = false;
let isHostReady = false;
let numberList = [];
let playerBingo = [];

const getTicketList = () => {
  let ticket_list = []; // Assuming ticket_list is defined somewhere
  userList.forEach((_) => {
    ticket_list.push(_.ticket);
  });

  return ticket_list;
};

io.on("connection", (socket) => {
  console.log("A user connected:", io.engine.clientsCount, socket.id);

  socket.on("client:update_info", (_) => {
    const index = userList.findIndex((x) => x.id === socket.id);
    if (_.name === "host") {
      io.emit(
        "host:get_users",
        userList.map((x) => ({
          id: x.id,
          name: x.name,
          tickerNumber: x.ticket,
          isRequestBingo: false,
          numberToCheck: [],
          checkResult: [],
        }))
      );
    }
    if (index === -1) {
      const user = { ..._, id: socket.id };
      userList.push(user);
      io.emit("host:user", {
        id: socket.id,
        name: _.name,
        tickerNumber: _.ticket,
        isRequestBingo: false,
        numberToCheck: [],
        checkResult: [],
      });
    } else {
      userList[index] = { ...userList[index], ..._ };
      io.emit("host:user", {
        id: socket.id,
        name: _.name,
        tickerNumber: _.ticket,
        isRequestBingo: false,
        numberToCheck: [],
        checkResult: [],
      });
    }

    io.emit("client:listener", {
      ticketSelectList: getTicketList(),
      isStartGame,
    });
  });

  socket.on("client:get_ticket", () => {
    io.emit("client:listener", { ticketSelectList: getTicketList() });
  });

  socket.on("host:bingo", (_) => {
    io.emit("bingo", { ..._, id: socket.id });
  });

  socket.on("disconnect", () => {
    userList = userList.filter((u) => u.id !== socket.id);
    if (userList.find((x) => x.id === socket.id).name === "host")
      isHostReady = false;
    io.emit("client:listener", {
      ticketSelectList: getTicketList(),
      isHostReady,
    });
    io.emit("host:user_logout", { id: socket.id });
  });

  socket.on("host:ready", () => {
    isHostReady = true;
    io.emit("client:listener", {
      isHostReady,
    });
  });

  socket.on("host:start_game", (_) => {
    if (
      userList.filter((x) => !!x.ticket).length >=
      io.engine.clientsCount - 1
    ) {
      isStartGame = true;
      io.emit("host:listener", {
        isCanCallNewNumber: true,
      });
      io.emit("client:listener", {
        isStartGame,
      });
    }
  });

  socket.on("client:player_bingo", (_) => {
    if (!playerBingo.length) playerBingo = _;
    _.forEach((x) => {
      if (playerBingo.includes(x)) playerBingo.push(x);
    });
    io.emit("client:listener", playerBingo);
  });

  socket.on("host:new_game", (_) => {
    isStartGame = false;
    isHostReady = true;
    playerBingo = [];
    numberList = [];
    userList = userList.map((x) => ({
      ...x,
      ticket: null,
      selection: [],
      ticketSelectList: [],
    }));
    io.emit("host:listener", {
      isCanStart: true,
      isCanCallNewNumber: false,
    });
    io.emit("client:listener", {
      isStartGame,
      isHostReady,
      numberList,
      ticket: null,
      selection: [],
      ticketSelectList: [],
    });
  });

  socket.on("host:new_number", (_) => {
    numberList.unshift(_);

    io.emit("client:listener", {
      numberList,
    });
  });
});

server.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
});
