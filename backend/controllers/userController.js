// const {
//     addnewUser
// } = require("../services/userServices");
const userService = require("../services/userService");
const messageService = require("../services/messageService");
const auth = require("../controllers/authController");

// FOR SIGN IN
exports.addnewUser = async (req, res) => {
  try {
    const u = await userService.findUserByUsername(req.body['username']); // phải là .body['username]
    if (u == null) {
      const user = await userService.addnewUser(req.body);
      res.json({ data: user, status: "success" });
    } else {
      res.json({ message: "username already exist", status: "success" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// FOR LOGIN
exports.login = async (req, res) => {
  try {

    const u = await userService.findUserByUsername(req.body['username']); // phải là .body['username]
    if (u == null) res.json({ status: "Login unsuccessful" });
    else if (u['username'] === req.body['username'] && u['password'] === req.body['password']) {
      const token = auth.generateToken(u["_id"]);
      res.json({ data: u, token: token, status: "Login successful" });
    }
    else res.json({ status: "Login unsuccessful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// KHI ĐĂNG NHẬP XONG, LẤY CÁC THÔNG TIN CHO TRANG CHỦ:
exports.getUserInf = async (req, res) => {  // Dùng tạm thời? PHẢI CHỈNH SỬA LẠI DÙNG POPULATE
  try {
    // INPUT LÀ userID, thông tin cần lấy gồm có danh sách các cuộc trò chuyện
    // Đi kèm với mỗi cuộc trò chuyện là friendID, friendName, friendAvt   
    // CỘNG VỚI THỨ TỰ LAST ACTIVE, TRẠNG THÁI SEEN hay chưa, giá trị length của cuộc trò chuyện

    const u = await userService.findUserByID(req.headers['userid']); // phải là .body['username]


    if (u == null) res.json({ status: "User not found" });
    else {
       u["ConversationList"] = [];
  
      let as = async() => {
        let promiseList = [];
        for (let i = 0; i < u.conversations.length; i++) {
          let convid = u.conversations[i];
          let conversationInf = {};
          let conv = await messageService.findConversationByID(convid);
          // console.log(conv);
           conversationInf["conv_id"] = conv._id;
           conversationInf["lastActive"] = conv.lastActive;
           conversationInf["length"] = conv.length;
          
          let friendID = u._id.toString() == conv.members[0].toString() ?conv.members[1]:conv.members[0];
          // => PHẢI SO SÁNH toString() mới chạy đúng


          let friend = await userService.findUserByID(friendID);
          // console.log("friend: "+friend);
          conversationInf["friendId"] = friendID;
          conversationInf["friendName"] = friend.displayName;
          conversationInf["friendAvt"] = friend.avatar;
  
          // console.log(conversationInf);
          promiseList.push(conversationInf);
          // console.log(u["ConversationList"]);
        };
        // console.log("promiseList: "+promiseList);
         return promiseList;

      
      }
      // console.log(await as());
      u["ConversationList"] = await as();
      // console.log(u["ConversationList"]);
      res.json({ user: u, conversationList: u["ConversationList"], status: "User found" });


    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// FOR EDIT USER INFORMATION
exports.editUserInf = async (req, res) => {
  try {
    const user = await userService.editUserInf(req.body['id'], req.body); // phải là .body['id']
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};