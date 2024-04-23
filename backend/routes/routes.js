const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.
    route("/register").post(userController.addnewUser);

router.
    route("/login").post(userController.login);


router.  
    route("/updateUser").put(userController.editUserInf);

module.exports = router;