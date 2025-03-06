const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null
            });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (jwtError) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null
            });
        }
        
    } catch (error) {
        console.error('Error authenticating user: ', error);
        return res.status(500).json({
            status: 999,
            message: 'Internal Server Error',
            data: null
        });
    }
}