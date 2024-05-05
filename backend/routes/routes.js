const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");


router.
    route("/register").post(userController.addnewUser);

router.route("/login")
    .get(userController.getUserInf) // Phải thêm auth vào
    .post(userController.login);


router.  
    route("/updateUser").put(auth.authMiddleware,userController.editUserInf);


router.route("/conversation")
    // .get(messageController.getConversationByID)   // GET CONVERSATION BY ID, truy cập conv từ tab conv
    .put(messageController.getConversationByMembers)  // Truy cập conv từ tìm kiếm người dùng
    .post(messageController.createConversation)      // Tạo cuộc trò chuyện mới
    ;

router.route("/message")
    .get(messageController.getMessages) 
    .post(messageController.addMessage)  // Lưu tin nhắn được gửi
    ;

module.exports = router;