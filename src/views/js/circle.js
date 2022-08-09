const socket = io();

const circle = document.querySelector("#circle");

const drawCircle = (position) => {
  circle.style.top = position.top;
  circle.style.left = position.left;
};

const drag = (e) => {
  const { clientX, clientY } = e;

  const position = {
    top: clientY + "px",
    left: clientX + "px"
  };

  drawCircle(position);
  console.log("Se envía el evento al servidor");
  socket.volatile.emit("circle-position", position);
}

document.addEventListener("mousedown", () => {
  document.addEventListener("mousemove", drag);
});

document.addEventListener("mouseup", () => {
  document.removeEventListener("mousemove", drag);
});

socket.on("move-circle", drawCircle);