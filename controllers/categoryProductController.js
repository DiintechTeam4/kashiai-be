const { v4: uuidv4 } = require('uuid');
const Category = require('../models/Category');

const User = require('../models/User')
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { uploadImage } = require('../config/cloudinary'); 

exports.createCategory = async (req, res) => {
  try {
    
    let categoryImageUrl = req.body.image;
    if (req.file) {
      console.log('File received:', req.file); 
      const uploadResponse = await uploadImage(req.file.path); 
      categoryImageUrl = uploadResponse.secure_url; 
    }
    console.log(categoryImageUrl) 
    const categoryData = {...req.body, 
      gst_percentage: Number(req.body.gst_percentage),images: [{ image_url: categoryImageUrl }] };
    console.log(categoryData)
   
    const category = new Category(categoryData);
    console.log(category)
    
    await category.save();
    res.status(201).json({ id: category.id, message: 'Category created successfully.' });
  } catch (error) {
    console.error('Error during Category creation:', error);
    res.status(500).json({ message: 'Failed to create Category', error: error.message });
  }
};


exports.updateCategory = async(req,res) =>{
  const { category_id } = req.params;
  const { name, description, gst_percentage } = req.body;
  let uploadResponse
    try {

    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    
    console.log( gst_percentage)
    console.log(category.gst_percentage)
    category.name = name || category.name;
    category.description = description || category.description;
    category.gst_percentage = Number(gst_percentage) || category.gst_percentage
    if (req.file) {
      uploadResponse = await uploadImage(req.file.path);
      
    }
    if (uploadResponse && uploadResponse.secure_url) {
      category.images[0].image_url = uploadResponse.secure_url;
      category.markModified("images");
    }
    category.save()
    res.status(200).json({ message: "Category updated successfully with associated data." });
  } catch (error) {
    console.error("Error updating Category:", error);
    res.status(500).json({ error: error.message });
  }
}



exports.deleteCategory = async (req, res) => {
  const { category_id } = req.params;

  try {
    await Category.findByIdAndDelete(category_id);
    await Product.deleteMany({ category_id });
    res.status(200).json({ message: 'Category and all associated products deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    
    const { category_id, name, price, offer_price, description, availability, faqs } = req.body;
    const parsedFaqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs;
    let images = [];
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => uploadImage(file.path)); 
      const imageUrls = await Promise.all(imagePromises);
      images = imageUrls.map(response => ({ image_url: response.secure_url })); 

    }
    console.log("faqs"+faqs)
    console.dir(parsedFaqs,{ depth: null })
    const productData = {
      name,
      price,
      offer_price,
      description,
      availability,
      images,
      faqs:parsedFaqs,
      category: category_id 
    };


    const product = new Product(productData);

    await product.save();
    res.status(201).json({ id: product.id, message: 'Product created successfully.' });
  } catch (error) {
    console.error('Error during Product creation:', error);
    res.status(500).json({ message: 'Failed to create Product', error: error.message });
  }
};



exports.updateProduct = async (req, res) => {
  const { product_id } = req.params;
  const { price, offer_price, description, availability, faqs } = req.body;

  try {
    await Product.findByIdAndUpdate(product_id, { price, offer_price, description, availability, faqs });
    res.status(200).json({ message: 'Product details updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};


exports.getProductsByCategory = async (req, res) => {
  const { category_id } = req.params;
  try {
    const products = await Product.find({ category:category_id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};


// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate('category');
//     const groupedProducts = products.reduce((acc, product) => {
//       const categoryName = product.category.name;
//       if (!acc[categoryName]) {
//         acc[categoryName] = {
//           category: categoryName,
//           image: product.category.image,
//           products: [],
//         };
//       }
//       acc[categoryName].products.push({
//         id: product._id,
//         name: product.name,
//         price: product.price,
//         offer_price: product.offer_price,
//         availability: product.availability,
//         images: product.images,
//         faqs: product.faqs,
//       });
//       return acc;
//     }, {});

//     const result = Object.values(groupedProducts);
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching products' });
//   }
// };

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    await Product.findByIdAndDelete(product_id);
    res.status(200).json({ message: 'Product deleted successfully from the category.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};





