const Model = require("../models/Models");


// LƯU TIN NHẮN ĐƯỢC GỬI:
exports.addMessage = async (message) => {
    // console.log(message);
    return await Model.message.create(message);
    // return message;
};


exports.addMessageToConversation = async (msg, convID) => {
    // Thêm message ID, cập nhật lastActive, length của conversation
  
    return await Model.conversation.updateOne( 
        { _id : convID },
        { $push: { messages: msg._id},
          $inc: { length: 1 },
          $set: { lastActive: msg.sentTime }      
        }
      );
    
    // const user = await Model.User.updateOne( 
    //     { _id : msg.sender, "conversations": convID },
    //     {       
    //         { $set: { "comments.$.text": NEW_CONTENT } }
    //     }
    //   );
};

// CẬP NHẬT TRẠNG THÁI CUỘC TRÒ CHUYỆN ĐỐI VỚI CÁ NHÂN (pending hay accepted)
exports.updateconvStatus = async (userID,convID, status) => {  // Chưa tối ưu
    
     let result = await Model.User.updateOne({_id: userID, "conversationStatus.convID":convID  },  //, "conversationStatus.convID" : convID
                                             { $set:  {"conversationStatus.$.status":status} } );
     console.log(result);

    // let result = await Model.User.updateOne()
     return result;
}; 
// CODE PHỤ: THÊM TRẠNG THÁI CUỘC TRÒ CHUYỆN ĐỐI VỚI CÁ NHÂN (pending hay accepted)
exports.updateconvStatuss = async (userID,convID, status) => {  // Chưa tối ưu
    let obj = {convID:convID,status : status};
     let result = await Model.User.updateOne({_id: userID },  //, "conversationStatus.convID" : convID
                                             { $push:  {conversationStatus: obj} } );
    //  console.log(result);

    // let result = await Model.User.updateOne()
     return result;
}; 
//******************************************************************************************** */

exports.updateBlockStatus = async (convID, status) => {
    let result = await Model.conversation.updateOne({_id: convID },  //, "conversationStatus.convID" : convID
                                            { $set:  {blockStatus: status} } );
   //  console.log(result);

   // let result = await Model.User.updateOne()
    return result;
}



// LẤY TIN NHẮN ĐỂ HIỂN THỊ
exports.getMessage = async (conversationId,length, mesIdx) => {
    console.log(conversationId + " " +  length + " " + mesIdx);
    // console.log("length: "+length);
    let as1 = async () => {
        if (length>10){
            try {
            return await Model.conversation.findOne({_id:conversationId}, 
                                        {messages:{$slice:[mesIdx-9,mesIdx ] }, _id:0, members: 0, lastActive:0, length: 0})
                                         .populate("messages");
            }
            catch(err) {console.log(err);}
       }
       else if(length==1){
        try{
            return await Model.conversation.findOne({_id:conversationId},
                                         {messages:{$slice:1 },_id:0, members: 0, lastActive:0, length: 0})
                                          .populate("messages");
            }
             catch(err) {console.log(err);}
       }
       else {
        try {   
            return await Model.conversation.findOne({_id:conversationId}, 
                                        {messages:{$slice:[0,mesIdx-1] }, _id:0, members: 0, lastActive:0, length: 0})
                                         .populate("messages");
            }
            catch(err) {console.log(err);}
       }
    }
    
    let messageIDList = await as1();
    // console.log(messageIDList);
    return messageIDList;

};



// DÙNG KHI TRUY CẬP CUỘC TRÒ CHUYỆN TỪ THANH TÌM KIẾM
exports.findConversationByMembers = async (conversation) => {
    conversation.members = conversation.members.split(",");
    if(conversation.members[0]==conversation.members[1]) return null; // TẠM THỜI
    // console.log("1: " + conversation.members);
    return await Model.conversation.findOne({members:{ $all: conversation.members }}, {_id:1});   // (Chưa tối ưu)
};                                          // , {members: 1,lastActive:1,length:1}

exports.findConversationByID = async (id) => {
    return await Model.conversation.findOne({_id:id}, {members: 1,lastActive:1,length:1});   // (Chưa tối ưu)
    //, {members: 1,lastActive:1,length:1}
};


// LẤY THÔNG TIN CỦA CUỘC TRÒ CHUYỆN ĐỂ HIỂN THỊ
// => CHUẨN BỊ BỎ, Các thông tin như conversationID, "friendID", ... đã được lấy từ lúc getUserInf
// Mở cuộc trò chuyện từ tab conversation giờ chỉ cần getMessage
// exports.getConversationByID= async (id) => {
//      //
//      return await Model.conversation.findOne({_id:id});  
//     // ĐỂ TẠM THỜI, CHƯA CÓ PHẦN GẮN THÊM TIN NHẮN
    
// };


// TẠO CUỘC TRÒ CHUYỆN BẰNG ID CỦA CÁC THÀNH VIÊN, 
// kết hợp thêm cuộc trò chuyện vào danh sách conversation của các thành viên
exports.createConversationByMembers = async (conversation) => {
 
    conversation.members = conversation.members.split(",");
    conversation.messages = [];

    const conv = await Model.conversation.create(conversation);
    // console.log(conv.members[0])
    var user = {};
    for (let i = 0; i < conv.members.length; i++) {
        let u = await Model.User.findOne({_id:conv.members[0]});
        
        if(!u.conversations) {

            let convarray = [];
            convarray.push(conv._id);
            try{ 
                user = await Model.User.findByIdAndUpdate(
                { _id: conv.members[i] }, // Filter to find the user document by its ID
                { $set: { conversations: convarray }}
            );
            // console.log(user);
        }
            catch(err){console.log(err);}
           
        }
        else {

            try{    
                user = await Model.User.findByIdAndUpdate(
                { _id: conv.members[i] }, // Filter to find the user document by its ID
                { $push: { conversations: conv._id }}
            );
            }
            catch(err){console.log(err);}
        }
       
    }

    // return user.conversations[user.conversations.length-1]; // TẠI SAO LẠI DÙNG CÁCH NÀY
    return conv;
};







