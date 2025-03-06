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