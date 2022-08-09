const socket = io({
  auth: {
    token: "Mr. Michi no es genial"
  }
});

//On error
socket.on("connect_error", err => {
  console.log("Error de conexión😣");
  console.log(err.message, err.data.details);
});