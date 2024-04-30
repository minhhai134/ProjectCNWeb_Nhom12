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
        ref : "Conversation"
        }
    ],

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
    ]
    
    // messages : [ if there are more than a few thousand documents on the "many" side, 
    //              don't use an array of ObjectID references
    //     {
    //         type : mongoose.Schema.ObjectId,
    //         ref : "Message"
    //     }
    // ]

});
const conversation = mongoose.model("Conversation", conversationSchema);






module.exports = {User, message,conversation};

