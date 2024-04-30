const jwt = require("jsonwebtoken");

exports.generateToken = (userID) => {
    return jwt.sign(
        {
            id : userID,

            
        },
        process.env.SECRETKEY,
        {
            expiresIn : "1d"
        }
     );
};

//  authMiddleware được thêm vào trong route
exports.authMiddleware = (req, res, next) => {
    const token = req.headers.token?.split(" ")[1];  // Phải thêm dấu "?" cho trường hợp header không có token
    // console.log(req.headers);                     // "headers" chứ không phải "header"
    if(token){
        try {
            jwt.verify(token, process.env.SECRETKEY)
            next();
        } catch (e) {
            return res.status(403).json({error : "Not authorized" });
        }
    }
    else {
        res.status(403).json({error: "Not authorized"});
    }
 
};
