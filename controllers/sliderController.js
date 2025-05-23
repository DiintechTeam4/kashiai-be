
const Slider = require('../models/Slider');
const { uploadImage } = require('../config/cloudinary');
const Admin = require('../models/Admin');

exports.uploadSliderImages = async (req, res) => {
  const { poojaId, poojaType, images } = req.body;

  try {

    const newSlider = new Slider({
      poojaId,
      poojaType,
      images
    });


    const savedSlider = await newSlider.save();
    
    res.status(201).json({
      message: 'Slider added successfully!',
      slider: savedSlider,
    });
  } catch (error) {
    console.error('Error adding slider:', error);
    res.status(500).json({ message: 'Error adding slider', error: error.message });
  }
};


exports.getAllSliderImages = async (req, res) => {
  try {
    const sliders = await Slider.find();

    if (!sliders || sliders.length === 0) {
      return res.status(404).json({ message: 'No slider images found' });
    }

    const allImages = sliders.flatMap(slider => slider.images);

    res.status(200).json({ images: allImages });
  } catch (error) {
    console.error('Error fetching slider images:', error);
    res.status(500).json({ message: 'Error fetching slider images', error: error.message });
  }
};
