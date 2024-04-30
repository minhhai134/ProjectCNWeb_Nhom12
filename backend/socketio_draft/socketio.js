// const app = require("../server");
// const http = require("http").Server(app);
// http.listen(process.env.PORT);  // Phải dùng http, chứ không phải app
const { Server } = require("socket.io"); // Add this

exports.initSocketIOServer = (http) => {
const io = new Server(http, {    // io là server instance
  cors: {
    origin: "*", // it means that the server allows requests from any origin. In other words, it indicates that the server is willing to accept cross-origin requests from any domain, regardless of where the request originated
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket)=>{  // io là server instance
    console.log("New user connected");

    socket.on("sendMsg", (msg)=>{
        socket.broadcast.emit("transfer-msg", msg);
    });


});

return io;
}
// module.exports = io;