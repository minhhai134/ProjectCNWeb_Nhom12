import io from "socket.io-client";

let socket;

const connectSocket = (user_id) => {
  if (socket && socket.connected) {
    console.log("Socket already connected");
    return;
  }

  socket = io("http://localhost:8000", {
    query: `user_id=${user_id}`,
  });

  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("user_connect", user_id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export { socket, connectSocket, disconnectSocket };

