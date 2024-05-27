const messageService = require("../services/messageService");
//const auth = require("../controllers/authController");


// LƯU TIN NHẮN ĐƯỢC GỬI
exports.addMessage = async (req, res) => {
    try {
      const message = req.body;
      // console.log("1: "); console.log(message);
      // Lưu tin nhắn vào db


      const msg = await messageService.addMessage(message);


      // Thêm message ID, cập nhật lastActve, length của conversation
      const conv = await messageService.addMessageToConversation(msg, message.conversation);


      // Cập nhật seenStatus của sender
      
    
      // Cập nhật seenStatus của receiver
        // console.log(res);
        res.json({ message: msg, status: "success" });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };




exports.getMessages = async (req, res) => {
    try {
      // console.log(req.headers);
     let convID = req.headers.convid;
     let Idx = req.headers.idx;
     let length = req.headers.length;
     let messages = await messageService.getMessage(convID,length,Idx);
    //  console.log(messages);
     res.json({ messages: messages, status: "success" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


// LẤY THÔNG TIN CONVERSATION KHI MỞ TỪ TAB conversation ở trang chủ
// => CHUẨN BỊ BỎ, Các thông tin như conversationID, "friendID", ... đã được lấy từ lúc getUserInf
// Mở cuộc trò chuyện từ tab conversation giờ chỉ cần getMessage
// exports.getConversationByID = async (req, res) => {
//     try {
//     const conversation = await messageService.getConversationByID(req.headers.conv_id);
//     if(conversation==null)  res.json({ message: "conversation not found"});
//     res.json({ conversation: conversation, status: "success" });
  
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };




// DÙNG TRONG TRƯỜNG HỢP MỞ CUỘC TRÒ CHUYỆN TỪ THANH TÌM KIẾM
exports.getConversationByMembers = async(req,res) => { 
  try {

    const conversation = await messageService.findConversationByMembers(req.body);
    console.log(conversation);
    if(!conversation) res.json({status: "Conversation not already been created" });
    else res.json({ data: conversation, status: "success" });  // conversation là null hay không sẽ do client xử lý?

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// TẠO CUỘC TRÒ CHUYỆN bằng userID của các thành viên
exports.createConversation = async(req,res) => {
  try {
    // console.log("1: ", req.body);
    const conversation = await messageService.createConversationByMembers(req.body);
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



exports.updatConvStatus = async (req, res) => {
  try {
    let update = await messageService.updateconvStatus(req.body["userID"], req.body["convID"], req.body["status"] );
    // console.log(update);
    if(update['acknowledged']==true && update['modifiedCount']==1 ) res.json({status: "update succesfully"});
    else res.json({status: "update unsuccesfully"});
    

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateBlockStatus = async (req, res) => {
  try {
    let update = await messageService.updateBlockStatus(req.body["convID"], req.body["status"] );
    // console.log(update);
    if(update['acknowledged']==true && update['modifiedCount']==1 ) res.json({status: "update succesfully"});
    else res.json({status: "update unsuccesfully"});
    
    

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};