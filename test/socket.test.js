const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("socket.io", () => {
  let io, socketServer, socketClient;
  
  beforeAll((done) => {
    const httpServer = createServer();

    io = new Server(httpServer);

    httpServer.listen(() => {
      const port = httpServer.address().port;
      socketClient = new Client(`http://localhost:${port}`);

      io.on("connection", socket => {
        socketServer = socket;
      });
      
      socketClient.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();

    socketClient.close();
  });

  test("should work well", (done) => {
    socketClient.on("greeting", (greeting) => {
      try {
        expect(greeting).toBe("Hola");
        done();
      } catch (error) {
        done(error);
      }
    });

    socketServer.emit("greeting", "Hola");
  });

  test("Testing callbacks (acknoledgements)", done => {

    serverSocket.on("bark", callback => {
        callback("woof!");
    });

    clientSocket.emit("bark", arg => {
        try {
            expect(arg).toBe("woof!");
            done();
        } catch (error) {
            done(error);
        }
    });

});

});