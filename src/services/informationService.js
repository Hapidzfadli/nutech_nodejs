const { query } = require('../config/db');

exports.getBanners = async () => {
  return await query(
    'SELECT banner_name, banner_image, description FROM banners',
    []
  );
};

exports.getServices = async () => {
    return await query(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services',
      []
    );
};