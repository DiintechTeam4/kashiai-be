const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  timeout: 90000,
});

const uploadImage = async (filePath) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto' 
    });
    console.log('Cloudinary upload response:', uploadResponse);
    return uploadResponse;
  } catch (err) {
    console.error('Error during Cloudinary upload:', err);
    throw new Error('Cloudinary upload failed');
  }
};

module.exports = { uploadImage };
