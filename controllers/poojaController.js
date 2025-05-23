const { v4: uuidv4 } = require('uuid');
const { Pooja } = require('../models/Pooja');
const { uploadImage } = require('../config/cloudinary'); 
const Slider = require('../models/Slider');
const Banner = require('../models/Banner');

const User = require('../models/User')


exports.createPooja = async (req, res) => {
  try {
    console.log(req.body)
    
    const parsedPackages = typeof req.body.packages === "string" ? JSON.parse(req.body.packages) : req.body.packages;
    const parsedFaqs = typeof req.body.faqs === "string" ? JSON.parse(req.body.faqs) : req.body.faqs;
    const parsedAddons = typeof req.body.addons === "string" ? JSON.parse(req.body.addons) : req.body.addons;

   
    let images = req.body.images || [];
    if (req.files['images'] && req.files['images'].length > 0) {
      const imagePromises = req.files['images'].map((file) => uploadImage(file.path)); 
      const imageUrls = await Promise.all(imagePromises);
      images = imageUrls.map((response) => ({ image_url: response.secure_url })); 
    }

    let addonImages = [];
    if (req.files['addonImages']) {
      const addonImagePromises = req.files['addonImages'].map((file) => uploadImage(file.path));
      addonImages = await Promise.all(addonImagePromises);
    }

    
    parsedAddons.forEach((addon, index) => {
      if (addonImages[index]) {
        addon.image = addonImages[index].secure_url;
      }
      delete addon.imagePreview;
    });

    const packageIdMapping = {
      single: 'PKG001-SINGLE',
      couple: 'PKG002-COUPLE',
      family: 'PKG003-FAMILY'
    };

    
    const validPackages = parsedPackages
      .map(pkg => {
        const packageName = pkg.name.trim().toLowerCase();
        if (packageIdMapping[packageName]) {
          return { ...pkg, packageId: packageIdMapping[packageName] };
        }
        return pkg;
      })
      .filter(pkg => pkg.name && (pkg.online_price || pkg.offline_price));


      const lowestOnlinePrice = validPackages
  .filter(pkg => pkg.online_price) 
  .reduce((min, pkg) => Math.min(min, Number(pkg.online_price)), Infinity);

console.log("lowest"+lowestOnlinePrice);

      

    const poojaData = {
      ...req.body,
      starting_price: lowestOnlinePrice,
      images: images, 
      packages: validPackages, 
      faqs: parsedFaqs,
      addons: parsedAddons,
    };
    console.log(poojaData)
   
    const pooja = new Pooja(poojaData);
    await pooja.save();

    res.status(201).json({ id: pooja.id, message: "Pooja created successfully." });
  } catch (error) {
    console.error("Error during Pooja creation:", error);
    res.status(500).json({ message: "Failed to create Pooja", error: error.message });
  }
};


exports.updatePooja = async (req, res) => {
  const { pooja_id } = req.params;

  let images = req.body.images || [];

    if (req.files['images'] && req.files['images'].length > 0) {
      const imagePromises = req.files['images'].map((file) => uploadImage(file.path));
      const imageUrls = await Promise.all(imagePromises);
      images = imageUrls.map((response) => ({ image_url: response.secure_url }));
    }
  const { name, description, location, date, availability, starting_price,poojaType,addonPrices,
    packagePrices, valid_till,gst_percentage } = req.body;

  try {

    const pooja = await Pooja.findById(pooja_id);
    console.log("pooja before update")
    console.log(pooja.images)

    if (!pooja) {
      return res.status(404).json({ message: "Pooja not found." });
    }
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        if (pooja.images[i]) {
          pooja.images[i].image_url = images[i].image_url; 
        } else {
          pooja.images.push(images[i]); 
        }
      }
    }

    pooja.name = name || pooja.name;
    pooja.description = description || pooja.description;
    pooja.location = location || pooja.location;
    pooja.date = date || pooja.date;
    pooja.availability = availability || pooja.availability;
    pooja.starting_price = starting_price || pooja.starting_price;
    pooja.poojaType = poojaType || pooja.poojaType
    pooja.valid_till = valid_till || pooja.valid_till
    pooja.gst_percentage = gst_percentage || pooja.gst_percentage
    if (addonPrices) {
      pooja.addons = pooja.addons.map(addon => ({
        ...addon,
        price: addonPrices[addon._id] || addon.price,  
      }));
    }

    if (packagePrices) {
      pooja.packages = pooja.packages.map(pkg => ({
        ...pkg,
        online_price: packagePrices[pkg.packageId] || pkg.online_price,
      }));
    }


    const lowestOnlinePrice = pooja.packages
  .filter(pkg => pkg.online_price) 
  .reduce((min, pkg) => Math.min(min, Number(pkg.online_price)), Infinity);



    pooja.starting_price = lowestOnlinePrice || pooja.starting_price

    pooja.markModified("images");
    await pooja.save();
    console.log("pooja after update")
    console.log(pooja.images)
    

    res.status(200).json({ message: "Pooja updated successfully with associated data." });
  } catch (error) {
    console.error("Error updating pooja:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePooja = async (req, res) => {
  try {
    console.log(req.params)
    const { pooja_id } = req.params;  
    
    if (!pooja_id) {
      return res.status(400).json({ message: "Pooja ID is required" });
    }

    const pooja = await Pooja.findByIdAndDelete(pooja_id);

    if (!pooja) {
      return res.status(404).json({ message: "Pooja not found" });
    }

    res.status(200).json({ message: "Pooja deleted successfully" });
  } catch (error) {
    console.error("Error deleting pooja:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getAllPoojaDetails = async (req, res) => {
  // try {
    
  //   const poojas = await Pooja.find();
  //   res.status(200).json(
  //     poojas); 
  // } catch (error) {
  //   console.error("Error fetching all pooja details:", error);
  //   res.status(500).json({ error: error.message });
  // }

  try {
    const recentPooja = await Pooja.find().sort({ date: 1 });
    
    if (!recentPooja.length) {
      return res.status(404).json({ message: "No pooja details found" });
    }

    res.status(200).json(recentPooja); 
  } catch (error) {
    console.error("Error fetching recent pooja details:", error);
    res.status(500).json({ error: error.message });
  }

};



exports.getPoojaById = async (req, res) => {
  const { pooja_id } = req.params;

  try {

    const pooja = await Pooja.findById(pooja_id);

    if (!pooja) {
      return res.status(404).json({ message: "Pooja not found." });
    }

    res.status(200).json(pooja);
  } catch (error) {
    console.error("Error fetching Pooja by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalPoojas = async (req, res) => {
  try {
    const total = await Pooja.countDocuments(); // counts all documents
    res.status(200).json({ totalPoojas: total });
  } catch (err) {
    console.error('Error counting Poojas:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
