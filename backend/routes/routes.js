const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

const userController = require("../controllers/userController");

//  router.route("/home").get((req,res)=>{res.sendFile(__dirname + "/index.html");})

router.
    route("/register").post(userController.addnewUser);

router.
    route("/login").post(userController.login);


router.  
    route("/updateUser").put(auth.authMiddleware,userController.editUserInf);

module.exports = router;