const multer = require('multer');
exports.imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Format Image tidak sesuai'), false);
    }
};

exports.getImageUrl = (req) => {
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
};