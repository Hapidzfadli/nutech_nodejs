const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile, upload, updateProfileImage } = require('../controllers/membershipController');
const { authenticate } = require('../middlewares/auth');


router.post('/registration', [
    body('email').isEmail().withMessage('Parameter email tidak sesuai format'),
    body('first_name').notEmpty().withMessage('Parameter first_name tidak boleh kosong'),
    body('last_name').notEmpty().withMessage('Parameter last_name tidak boleh kosong'),
    body('password').isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
], register);

router.post('/login', [
    body('email').isEmail().withMessage('Paramter email tidak sesuai format'),
    body('password').isLength({ min: 8 }).withMessage('Parameter password Length minimal 8 karakter')
  ], login);

router.get('/profile', authenticate, getProfile);
router.put('/profile/update', authenticate, updateProfile);
router.put('/profile/image', authenticate, upload.single('profile_image'), updateProfileImage);
module.exports = router;