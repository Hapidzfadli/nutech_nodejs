const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/membershipController');

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


module.exports = router;