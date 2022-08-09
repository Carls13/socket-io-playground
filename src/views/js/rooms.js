const socket = io();

// Los botones que me permitirán conectarme
const connectToRoom1 = document.querySelector("#connectRoom1");
const connectToRoom2 = document.querySelector("#connectRoom2");
const connectToRoom3 = document.querySelector("#connectRoom3");

// Eventos
connectToRoom1.addEventListener("click", () => {
  socket.emit("connect-to-room", "room1");
});

connectToRoom2.addEventListener("click", () => {
  socket.emit("connect-to-room", "room2");
});

connectToRoom3.addEventListener("click", () => {
  socket.emit("connect-to-room", "room3");
});

// Enviar mensaje
const sendMeesage = document.querySelector("#sendMessage");

sendMeesage.addEventListener("click", () => {
  const message = prompt("Escribe tu mensaje");
  socket.emit("group-message", message);
});

// Escuchar el evento del mensaje
socket.on("new-message", (data) => {
  const { room, message } = data;

  const li = document.createElement("li");
  li.textContent = message;

  document.getElementById(room).append(li);
});