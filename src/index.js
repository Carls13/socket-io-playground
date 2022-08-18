// process.env.DEBUG = "*";
// process.env.DEBUG = "engine, socket.io:socket";

const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");

const { instrument } = require("@socket.io/admin-ui");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors:  {
    origin: ["https://admin.socket.io/"],
    credentials: false
  }
});

instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: "$2a$12$i5bjBkaDETQK18vVI4y8ru32TSSMNGH5ibxFL4VSVL1K9WpH0Pf56"
  }
});

app.use(express.static(path.join(__dirname, "views")))

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const onlineSockets = [];

//Middleware
io.use((socket, next) => {
  const { token } = socket.handshake.auth;

  if (token === "Mr. Michi es genial") {
    next();
  } else {
    const err = new Error("Invalid token");
    err.data = {
      details: "Auth failed"
    };

    next(err);
  }
});

io.on("connection", (socket) => {
  console.log(socket.id);
  // console.log("Clientes conectados: ", io.engine.clientsCount);

  // socket.on("disconnect", () => {
  //   console.log(socket.id, " desconectado");
  //   console.log("Clientes conectados: ", io.engine.clientsCount);
  // })

  socket.connectedRoom = "";
  onlineSockets.push(socket.id);

  //Emisión básica
  socket.emit("welcome", "Ahora estás conectado 😎");

  socket.on("server" , (data) => {
    console.log({ data });
  });

  // Emisión a todos
  io.emit("everyone", socket.id + " se ha conectado");

  // Emisión a uno solo
  socket.on("last" , (message) => {
    const lastSocket = onlineSockets[onlineSockets.length - 1];
    // Emisión a todos
    io.to(lastSocket).emit("salute", message);
  });

  //on, once, off
  setInterval(() => {
    socket.emit("on", "Emitir mensaje");
    socket.emit("once", "Emitir mensaje");
    socket.emit("off", "Varias veces pero se apaga");
  }, 1000);

  socket.on("circle-position", (position) => {
    socket.broadcast.emit("move-circle", position);
  });

  //Groups
  socket.on("connect-to-room", (room) => {
    // Leave previous room
    socket.leave(socket.connectedRoom);
    
    socket.join(room);
    socket.connectedRoom = room;
  });

  socket.on("group-message", (message) => {
    const room = socket.connectedRoom;

    io.to(room).emit("new-message", {
      message,
      room,
    });
  });

  //Offline
  socket.on("is-connected", (message) => {
    console.log(message);
  })
});

//Namespaces
const teachers = io.of("teachers");

const students = io.of("students");

teachers.on("connection", (socket) => {

  console.log(socket.id + " se ha conectado a la sala de profes");
  socket.on("send-namespace-message", (data) => {
    teachers.emit("message", data)
  });
});

students.on("connection", (socket) => {

  console.log(socket.id + " se ha conectado a la sala de estudiantes");
  socket.on("send-namespace-message", (data) => {
    students.emit("message", data)
  });
});

httpServer.listen(4000);