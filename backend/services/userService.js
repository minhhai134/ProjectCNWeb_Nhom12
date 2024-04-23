// Use for manipulate database
const userModel = require("../models/userModel");

exports.addnewUser = async(user) => {
   return await userModel.User.create(user);
};

exports.findUserByUsername = async(username) => {
   return await userModel.User.findOne({username : username});
};

exports.editUserInf = async(id,user) => {
   return await userModel.User.findByIdAndUpdate(id,user);
};