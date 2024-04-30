const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());


const mongoose = require("mongoose");
const router = require("../backend/routes/routes");
require('dotenv').config();
app.use(express.urlencoded({ extended: false }));
app.unsubscribe(express.json());

// MongoDB:
mongoose.connect(process.env.MONGODB_URI)
  .then(console.log("Connect successful."))
  .catch(
    (err) => {
      if (err) { console.log(err); }
    });


app.use("/api", router);  //  /api la endpoint dau vao cua 
                         //   tat ca request, tat ca request trong phan "router"



// Socket.io
//-------------------------------------------------------------------------------------------------- */
const http = require("http").Server(app);
http.listen(process.env.PORT);  // Phải dùng http, chứ không phải app
const { Server } = require("socket.io"); // Add this
const io = new Server(http, {    // io là server instance
  cors: {
    origin: "*", // it means that the server allows requests from any origin. In other words, it indicates that the server is willing to accept cross-origin requests from any domain, regardless of where the request originated
    methods: ["GET", "POST"],
  },
});

//-------------------------------------------------------------------------------------------------- */




io.on("connection", (socket)=>{  // io là server instance



    socket.on("sendMsg", (msg)=>{
        
        socket.broadcast.emit("transfer-msg", msg);
    });


});
























