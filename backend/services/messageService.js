const Model = require("../models/Models");

exports.addMessage = async (message) => {
    return await Model.message.create(message);
};

exports.getMessage = async (conversationId, mesIdx) => {

};


// exports.addConversation = async (conversation) => { 
//     return await Model.conversation.create(conversation);
// } => Gộp luôn vào joinConversation

exports.findConversation = async (conversation) => {
    conversation.members = conversation.members.split(",");
    // console.log("1: " + conversation.members);
    return await Model.conversation.findOne({members:conversation.members});   // (Chưa tối ưu)
};

exports.createConversation = async (conversation) => {
    // const foundconv = await this.findConversation(members);
    // if(foundconv){  return null;}  // Nếu đã tồn tại thì trả về null

    // conversation.members = conversation.members.map(memberId => mongoose.Types.ObjectId(memberId));
    
    conversation.members = conversation.members.split(",");
    // console.log(conversation.members);
    // const foundconv = await this.findConversation(members);
    // if(foundconv){  return null;}  // Nếu đã tồn tại thì trả về null

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
    
    // console.log(user.conversations[user.conversations.length-1]);
    // console.log(user);
    return user.conversations[user.conversations.length-1];
    
};


// exports.getConversation = async(conversationID) => {
//     return
// } => Không dùng getConversation theo cách này, khi người dùng nhấn vào conversation
//        thì gửi request lấy tin nhắn và có thể là tạo Room chat

