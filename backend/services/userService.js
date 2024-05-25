// Use for manipulate database
const Model = require("../models/Models");

exports.addnewUser = async(user) => {
   return await Model.User.create(user);
};

exports.findUserByUsername = async(username) => {
   return await Model.User.findOne({username : username});
};


exports.getUserInf = async(userid) => {
   return await Model.User.findOne({_id : userid})
                          .populate({path:"conversations",select:"_id lastActive length", 
                                     populate: {path:"members", select:"_id displayName", 
                                                match: {_id: {$ne: userid}}    
                                      } } );
};


exports.findUserByID = async(userid) => {
   return await Model.User.findOne({_id : userid});
};




exports.editUserInf = async(id,user) => {
   return await Model.User.findByIdAndUpdate(id,user);
};

exports.getUserByUserName = async(searchStr) => {
   return await Model.User.find({displayName: {$regex: searchStr }}, {displayName:1 });
}