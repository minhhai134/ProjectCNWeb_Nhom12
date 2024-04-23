const express = require("express");
const mongoose = require("mongoose");
const router = require("../backend/routes/routes");
const jwt = require("jsonwebtoken");


const app = express();

// const http = require("http").Server(app);
// const io = require("socket.io")(http);

require('dotenv').config();
app.use(express.urlencoded({ extended: false }));
app.unsubscribe(express.json())




app.listen(process.env.PORT);
app.use("/api", router);  //  /api la endpoint dau vao cua tat ca request




// MongoDB:
mongoose.connect(process.env.MONGODB_URI)
  .then(console.log("Connect successful."))
  .catch(
    (err) => {
      if (err) { console.log(err); }
    });
