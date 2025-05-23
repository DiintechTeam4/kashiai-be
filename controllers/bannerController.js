
const Banner = require('../models/Banner');
const Slider = require('../models/Slider');
const {Pooja} = require('../models/Pooja')
const { uploadImage } = require('../config/cloudinary');
const Admin = require('../models/Admin');


exports.getFilteredPoojaImages = async (req, res) => {
  try {
    const pooja = await Pooja.find();
    const sliderImages = pooja
  .filter(eachPooja => eachPooja.poojaType === "special")
  .map(eachPooja => ({
    pooja_id: eachPooja._id,
    images: eachPooja.images[0]?.image_url, 
    poojaType: eachPooja.poojaType
  }));

const bannerImages = pooja
  .filter(eachPooja => eachPooja.poojaType === "ondemand")
  .map(eachPooja => ({
    pooja_id: eachPooja._id,
    images: eachPooja.images[0]?.image_url, 
    poojaType: eachPooja.poojaType
  }));
    res.status(200).json({
      sliders: sliderImages,
      banners: bannerImages
    });
  } catch (error) {
    console.error('Error fetching pooja images:', error);
    res.status(500).json({ message: 'Error fetching pooja images', error: error.message });
  }
};
