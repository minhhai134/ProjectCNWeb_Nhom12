import io from "socket.io-client";

let socket;

const connectSocket = (user_id) => {
  socket = io("http://localhost:8000", {
    query: `user_id=${user_id}`,
  });
  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("user_connect", user_id);
  });
};

export { socket, connectSocket };
