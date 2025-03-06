
const {validationResult} = require('express-validator');
const userService = require('../services/userService');
const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(
                {
                    status: 102,
                    message: errors.array()[0].msg,
                    data: null
                }
            );
        }

        const existingUser = await userService.findUserByEmail(req.body.email);
        if (existingUser.length > 0) {
            return res.status(400).json(
                {
                    status: 102,
                    message: 'Email sudah terdaftar',
                    data: null
                }
            );
        }

        // create user
        await userService.createUser(req.body);
        return res.status(200).json({
            status: 0,
            message: 'Registrasi berhasil silahkan login',
            data: null
        })

    } catch (error) {
        console.error('Error registering user: ', error);
        return res.status(500).json({
            status: 999,
            message: 'Internal Server Error',
            data: null
        });
    }
}


exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(
                {
                    status: 102,
                    message: errors.array()[0].msg,
                    data: null
                }
            );
        }

        const {email, password} = req.body;
        const user = await userService.findUserByEmail(email);
        if(user.length ===0){
            return res.status(401).json({
                status: 102,
                message: 'Email atau password salah',
                data: null
            })
        }

        const isPasswordValid = await authService.comparePassword(password, user[0].password);
        if (!isPasswordValid) {
        return res.status(401).json({
            status: 103,
            message: 'Username atau password salah',
            data: null
        });
        }


        const token = await authService.generateToken(user[0]);
        return res.status(200).json({
            status:0,
            message: 'Login Sukses',
            data: {token}
        })

    } catch (error) {
      console.error('Error logging in user: ', error);
        return res.status(500).json({
            status: 999,
            message: 'Internal Server Error',
            data: null
        });  
    }
}