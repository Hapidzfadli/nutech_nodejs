const { query } = require('../config/db');

exports.getUserBalance = async (email) => {
  const users = await query(
    'SELECT balance FROM users WHERE email = ?',
    [email]
  );
  return users.length > 0 ? users[0] : null;
};

exports.getUserId = async (email) => {
    const users = await query('SELECT id, balance FROM users WHERE email = ?', [email]);
    return users.length > 0 ? users[0] : null;
  };

exports.updateBalance = async (userId, newBalance, conn) => {
    const connection = conn || await require('../config/db').pool.getConnection();
    try {
        await connection.execute('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);
        if (!conn) connection.release();
    } catch (error) {
        if (!conn) connection.release();
        throw error;
    }
};

exports.createTransaction = async (data, conn) => {
    const { invoiceNumber, userId, serviceCode, transactionType, description, amount } = data;
    const connection = conn || await require('../config/db').pool.getConnection();
    
    try {
      await connection.execute(
        'INSERT INTO transactions (invoice_number, user_id, service_code, transaction_type, description, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
        [invoiceNumber, userId, serviceCode, transactionType, description, amount]
      );
      if (!conn) connection.release();
    } catch (error) {
      if (!conn) connection.release();
      throw error;
    }
};

exports.getService = async (serviceCode) => {
    const services = await query('SELECT * FROM services WHERE service_code = ?', [serviceCode]);
    return services.length > 0 ? services[0] : null;
};

exports.getTransactionHistory = async (userId, offset = 0, limit = null) => {
    let sql = `
      SELECT 
        invoice_number, 
        transaction_type, 
        CASE 
          WHEN transaction_type = 'TOPUP' THEN 'Top Up balance'
          ELSE (SELECT service_name FROM services WHERE service_code = transactions.service_code)
        END AS description,
        CAST(total_amount AS FLOAT) AS total_amount, 
        created_on 
      FROM transactions 
      WHERE user_id = ? 
      ORDER BY created_on DESC
    `;
    
    if (limit) {
      sql += ` LIMIT ${Number(offset)}, ${Number(limit)}`;
    }
    
    const results = await query(sql, [userId]);
    
    return results.map(row => ({
      ...row,
      total_amount: parseFloat(row.total_amount)
    }));
};

exports.generateInvoiceNumber = () => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV${date}-${random}`;
};