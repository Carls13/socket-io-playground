const user = prompt("Escribe tu usuario");

const teachers = ["RetaxMaster", "juandc", "GNDX"];

let socketNamespace, group;

const chat = document.querySelector("#chat");
const namespace = document.querySelector("#namespace");

if (teachers.includes(user)) {
  socketNamespace = io("/teachers");
  group = "teachers";
} else {
  socketNamespace = io("/students");
  group = "students";
}

socketNamespace.on("connect", () => {
  namespace.textContent = group;
});

//Sending messages
const sendMessage = document.querySelector("#sendMessage");
sendMessage.addEventListener("click", () => {
  const message = prompt("Escribe tu mensaje");

  socketNamespace.emit("send-namespace-message", {
    message, user
  });
});

//Listening to messages
socketNamespace.on("message", (data) => {
  const { user: userMessage, message } = data;

  const li = document.createElement("li");
  li.textContent = `${user === userMessage ? "Myself" : userMessage}: ${message}`;

  chat.append(li);
});