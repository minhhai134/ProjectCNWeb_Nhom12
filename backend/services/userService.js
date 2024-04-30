// Use for manipulate database
const Model = require("../models/Models");

exports.addnewUser = async(user) => {
   return await Model.User.create(user);
};

exports.findUserByUsername = async(username) => {
   return await Model.User.findOne({username : username});
};

exports.editUserInf = async(id,user) => {
   return await Model.User.findByIdAndUpdate(id,user);
};