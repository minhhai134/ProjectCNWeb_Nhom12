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
    conversations : [
        {
        type : mongoose.Schema.ObjectId,
        ref : "Conversation",
    }
    ],
    conversationStatus : [
        {
           convID : String,
           status : String
        }
    ]

}, {
    strictPopulate: false
});
const User = mongoose.model("User", userSchema);

const friendSchema = mongoose.Schema({
     
});

const messageSchema = mongoose.Schema({
    conversation : {
        type : mongoose.Schema.ObjectId,
        ref : "Conversation"
    },
     sender : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
        },
     content : String,
     sentTime : Date

});
const message = mongoose.model("Message", messageSchema);


const conversationSchema = mongoose.Schema({
    members :[
        {
        type : mongoose.Schema.ObjectId,
        ref : "User"
        }
    ],   
    messages : [ 
        {
            type : mongoose.Schema.ObjectId,
            ref : "Message"
        }
    ],
    lastActive: Date,
    length : Number,
    blockStatus: String
      

}, {
    strictPopulate: false
});
const conversation = mongoose.model("Conversation", conversationSchema);






module.exports = {User, message,conversation};

