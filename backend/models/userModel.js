const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");

const userSchema = mongoose.Schema({
    // userID : String,
    username : String,
    password : String,
    displayName : String,
    gender : String,
    DOB : Date,
    avatar : String,
    activeStatus : String,
    userSetting : {

    }
});


const friendSchema = mongoose.Schema({
     
});

const conversationSchema = mongoose.Schema({

});





const User = mongoose.model("User", userSchema);

module.exports = {User};

