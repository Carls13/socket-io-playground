const socket = io();
const text = document.getElementById("text");
const saluteText = document.getElementById("salute-text");

socket.on("connect", () => {
  console.log("El socket se ha conectado: ", socket.id);
})

socket.on("welcome", (data) => {

  text.textContent += data;
});

const emitToServer = document.querySelector("#emit-to-server");

emitToServer.addEventListener("click", () => {
  socket.emit("server", "Hola, servidor😋");
});
const emitToLast = document.querySelector("#emit-to-last");

emitToLast.addEventListener("click", () => {
  socket.emit("last", "Hola, último😗");
});

socket.on("everyone", (message) => {
  console.log({ message })
});

socket.on("salute", (data) => {

  saluteText.textContent += data;
});

 //on, once, off
 socket.on("on", () => {
  console.log("Se emite varias veces");
});

socket.once("once", () => {
  console.log("Se emite una sola vez");
});

const listener = () => {
  console.log("Se apaga el evento");
};

socket.on("off", listener);

setTimeout(() => {
  socket.off("off", listener);
}, 2000);