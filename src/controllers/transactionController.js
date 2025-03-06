const transactionService = require('../services/transactionService');
const { validationResult } = require('express-validator');

exports.getBalance = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await transactionService.getUserBalance(email);
    
    if (!user) {
      return res.status(404).json({
        status: 102,
        message: "User tidak ditemukan",
        data: null
      });
    }
    
    return res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: parseFloat(user.balance)
      }
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

exports.topUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: 102,
                message: "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
                data: null
            })
        }

        const {email} = req.user;
        const {top_up_amount} = req.body;

        const user = await transactionService.getUserId(email);
        if(!user){
            return res.status(404).json({
                status: 102,
                message: "User tidak ditemukan",
                data: null
            })
        }

        const newBalance = parseFloat(user.balance) + parseFloat(top_up_amount);

        // Begin Transaction
        const db = require('../config/db')
        const connection = await db.pool.getConnection();
        await connection.beginTransaction();

        try {
            await transactionService.updateBalance(user.id, newBalance, connection);

            const invoiceNumber = transactionService.generateInvoiceNumber();
            await transactionService.createTransaction({
                invoiceNumber,
                userId: user.id,
                serviceCode: null,
                transactionType: 'TOPUP',
                description: 'Top Up balance',
                amount: parseFloat(top_up_amount)
            }, connection);

            await connection.commit();
            
            return res.status(200).json({
                status: 0,
                message: "Top Up Balance berhasil",
                data: {
                  balance: newBalance
                }
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error(error);
            return res.status(500).json({
            status: 999,
            message: "Internal Server Error",
            data: null
        });
    }
}

exports.transaction = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 102,
          message: errors.array()[0].msg,
          data: null
        });
      }
  
      const { email } = req.user;
      const { service_code } = req.body;
      
      const user = await transactionService.getUserId(email);
      if (!user) {
        return res.status(404).json({
          status: 102,
          message: "User tidak ditemukan",
          data: null
        });
      }
      
      const service = await transactionService.getService(service_code);
      if (!service) {
        return res.status(400).json({
          status: 102,
          message: "Service atau Layanan tidak ditemukan",
          data: null
        });
      }
      
      // Check if balance is sufficient
      if (parseFloat(user.balance) < parseFloat(service.service_tariff)) {
        return res.status(400).json({
          status: 102,
          message: "Saldo tidak mencukupi",
          data: null
        });
      }
      
      const newBalance = parseFloat(user.balance) - parseFloat(service.service_tariff);
      
      // Begin transaction
      const db = require('../config/db');
      const connection = await db.pool.getConnection();
      await connection.beginTransaction();
      
      try {
        await transactionService.updateBalance(user.id, newBalance, connection);
        
        const invoiceNumber = transactionService.generateInvoiceNumber();
        await transactionService.createTransaction({
          invoiceNumber,
          userId: user.id,
          serviceCode: service_code,
          transactionType: 'PAYMENT',
          description: service.service_name,
          amount: parseFloat(service.service_tariff)
        }, connection);
        
        await connection.commit();
        
        return res.status(200).json({
          status: 0,
          message: "Transaksi berhasil",
          data: {
            invoice_number: invoiceNumber,
            service_code: service.service_code,
            service_name: service.service_name,
            transaction_type: 'PAYMENT',
            total_amount: parseFloat(service.service_tariff),
            created_on: new Date().toISOString()
          }
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 999,
        message: "Internal Server Error",
        data: null
      });
    }
};
exports.getTransactionHistory = async (req, res) => {
    try {
      const { email } = req.user;
      const { offset = 0, limit } = req.query;
      
      const user = await transactionService.getUserId(email);
      if (!user) {
        return res.status(404).json({
          status: 102,
          message: "User tidak ditemukan",
          data: null
        });
      }
      
      const transactions = await transactionService.getTransactionHistory(
        user.id, 
        offset, 
        limit
      );
      
      return res.status(200).json({
        status: 0,
        message: "Get History Berhasil",
        data: {
          offset: parseInt(offset),
          limit: limit ? parseInt(limit) : transactions.length,
          records: transactions
        }
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