const messageService = require("../services/messageService");
//const auth = require("../controllers/authController");

exports.addMessage = async (req, res) => {
    try {
        messageService.addMessage(req.body);
        res.status(500).json({ status: "success" });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


exports.getMessages = async (req, res) => {
    try {
      
      if (u == null) {
        
        res.json({ data: user, status: "success" });
      } else {
        res.json({ message: "username already exist", status: "success" });
      }
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getConversation = async(req,res) => {
  try {

    const conversation = await messageService.findConversation(req.body);
    // console.log(conversation);
    res.json({ data: conversation, status: "success" });  // conversation là null hay không sẽ do client xử lý?

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//  => getConversation dùng để lấy các cuộc trò chuyện của một người dùng, sử dụng input là userID của người đó

exports.createConversation = async(req,res) => {
  try {
    // console.log("1: ", req.body);
    const conversation = await messageService.createConversation(req.body);
    // console.log("conversation: " + conversation);
    if (conversation) {       // conversation vừa được tạo
      res.json({data: conversation, status: "success"   });
    } else {  // conversation đã tồn tại trước đó
      res.json({ status: "conversation already exist" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// => createConversation tạo cuộc trò chuyện, đầu vào là userID của hai người trong cuộc trò chuyện đó