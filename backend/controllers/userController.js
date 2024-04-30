// const {
//     addnewUser
// } = require("../services/userServices");
const userService = require("../services/userService");
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
      res.json({ data: u, token: token , status: "Login successful" });
    }
    else res.json({ status: "Login unsuccessful" });

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