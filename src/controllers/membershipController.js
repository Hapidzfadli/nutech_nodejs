
const {validationResult} = require('express-validator');
const userService = require('../services/userService');
const authService = require('../services/authService');
const fileUpload = require('../utils/fileUpload');
const multer = require('multer');

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


exports.getProfile = async (req, res) => {
    try {
      const { email } = req.user;
      
      const users = await userService.getUserProfile(email);
      
      if (users.length === 0) {
        return res.status(404).json({
          status: 108,
          message: "User tidak ditemukan",
          data: null
        });
      }
      
      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: users[0]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 999,
        message: "Internal Server Error",
        data: null
      });
    }
};


exports.updateProfile = async (req, res) => {
    try {
      const { email } = req.user;
      const { first_name, last_name } = req.body;
      
      await userService.updateUserProfile(email, first_name, last_name);
      
      const users = await userService.getUserProfile(email);
      
      return res.status(200).json({
        status: 0,
        message: "Update Pofile berhasil",
        data: users[0]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 999,
        message: "Internal Server Error",
        data: null
      });
    }
  };

exports.updateProfileImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 102,
          message: "Format Image tidak sesuai",
          data: null
        });
      }
  
      const { email } = req.user;
      const imageUrl = fileUpload.getImageUrl(req);
      
      await userService.updateProfileImage(email, imageUrl);
      const users = await userService.getUserProfile(email);
      
      return res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: users[0]
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 999,
        message: "Internal Server Error",
        data: null
      });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

exports.upload = multer({
    storage: storage,
    fileFilter: fileUpload.imageFilter
});