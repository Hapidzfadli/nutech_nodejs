const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

exports.generateToken = async (userData) => {
    return jwt.sign(
        { email: userData.email },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
      );
}