const jwt = require("jsonwebtoken");


const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            userId: user.userId,
            role: user.role,
        },

        process.env.JWT_SECRET,

        {
            expiresIn:
                process.env.JWT_EXPIRES_IN,
        }
    );
};


module.exports = {
    generateToken,
};