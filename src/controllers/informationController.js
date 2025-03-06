const informationService = require('../services/informationService');

exports.getBanners = async (req, res) => {
  try {
    const banners = await informationService.getBanners();
    
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: banners
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

exports.getServices = async (req, res) => {
    try {
      const services = await informationService.getServices();
      
      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: services
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