const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("../backend/routes/routes");
require('dotenv').config();

// Socket.io
const http = require("http").Server(app);
const { Server } = require("socket.io"); // Add this
const io = new Server(http, {    // io là server instance
  cors: {
    origin: "*", // it means that the server allows requests from any origin. In other words, it indicates that the server is willing to accept cross-origin requests from any domain, regardless of where the request originated
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket)=>{  // io là server instance
    console.log("New user connected");
});

http.listen(process.env.PORT);  // Phải dùng http, chứ không phải app




app.use(express.urlencoded({ extended: false }));
app.unsubscribe(express.json())





app.use("/api", router);  //  /api la endpoint dau vao cua 
                          //   tat ca request, tat ca request trong phan "router"



// Sử dụng máy chủ của php, tạm thời chưa dùng đến
// app.get("/",(req,res)=>{ res.sendFile(__dirname + '/login.html');   });
// app.get("/home",(req,res)=>{res.sendFile(__dirname + "/index.html");})









// MongoDB:
mongoose.connect(process.env.MONGODB_URI)
  .then(console.log("Connect successful."))
  .catch(
    (err) => {
      if (err) { console.log(err); }
    });
