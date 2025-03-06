const bcrypt = require('bcryptjs');
const { query } = require('../config/db');


exports.findUserByEmail = async (email) => {
    return await query('SELECT * FROM users WHERE email = ?', [email]);
}

exports.createUser = async (userData) => {
    const {email, first_name, last_name, password} = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await query(
        'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)', 
        [email, first_name, last_name, hashedPassword]
    );
} 

exports.getUserProfile = async (email) => {
    return await query(
        'SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?',
        [email]
    );
}

exports.updateUserProfile = async (email, firstName, lastName) => {
    await query(
      'UPDATE users SET first_name = ?, last_name = ? WHERE email = ?',
      [firstName, lastName, email]
    );
};

exports.updateProfileImage = async (email, imageUrl) => {
    await query(
      'UPDATE users SET profile_image = ? WHERE email = ?',
      [imageUrl, email]
    );
  };