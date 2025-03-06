const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {getBalance, topUp, transaction, getTransactionHistory} = require('../controllers/transactionController');
const { body } = require('express-validator');


router.get('/balance', authenticate, getBalance);

router.post('/topup', [
    authenticate,
    body('top_up_amount').isInt({ min: 1 }).withMessage('Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0')
], topUp);

router.post('/transaction', [
    authenticate,
    body('service_code').notEmpty().withMessage('Service code is required')
], transaction);

router.get('/transaction/history', authenticate, getTransactionHistory);

module.exports = router;