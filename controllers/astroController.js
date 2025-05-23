const Astro = require('../models/Astro');
const { uploadImage } = require('../config/cloudinary');
const User = require('../models/User');  

const createAstro = async (req, res) => {
  try {

    let astroImageUrl = req.body.astro_image;
    if (req.file) {
      console.log('File received:', req.file); 
      const uploadResponse = await uploadImage(req.file.path); 
      console.log('Cloudinary response:', uploadResponse); 
      astroImageUrl = uploadResponse.secure_url; 
    }


    const astroData = { ...req.body, astro_image: astroImageUrl };

    console.log(astroData)
    const astro = new Astro(astroData);

    await astro.save();
    res.status(201).json({ id: astro.id, message: 'Astro created successfully.' });
  } catch (error) {
    console.error('Error during Astro creation:', error); 
    res.status(500).json({ message: 'Failed to create Astro', error: error.message });
  }
};


const updateAstro = async (req, res) => {
  let {astro_id} = req.params
  console.log(astro_id)
  let {name,description,languages_known, phone_number,experience,chat_number,status,skills,chat_price_per_minute,call_price_per_minute,astro_image} = req.body
  try {
    const astro = await Astro.findById(astro_id);
    if (!astro) {
      return res.status(404).json({ message: "astro not found." });
    }

    astro.name = name || astro.name;
    astro.description = description || astro.description;
    astro.languages_known = languages_known || astro.languages_known;
    astro.phone_number = phone_number || astro.phone_number;
    astro.experience = experience || astro.experience;
    astro.phone_number = phone_number || astro.phone_number;
    astro.chat_number = chat_number || astro.chat_number;
    astro.status = status || astro.status;
    astro.skills = skills || astro.skills;
    astro.chat_price_per_minute = chat_price_per_minute || astro.chat_price_per_minute;
    astro.call_price_per_minute = call_price_per_minute || astro.call_price_per_minute;
   
    
    if (req.file) {
      const uploadResponse = await uploadImage(req.file.path); 
      const astroImageUrl = uploadResponse.secure_url; 
      astro.astro_image = astroImageUrl || astro.astro_image;
    }
    console.log("astro after editing"+astro)
    await astro.save();
    res.status(200).json({ message: 'Astro details updated successfully.' });
  } catch (error) {
    console.error('Error during Astro update:', error); 
    res.status(500).json({ message: 'Failed to update Astro', error: error.message });
  }
};


const getAstro = async (req, res) => {
  try {
    console.log(req.params.astro_id)
    const astro = await Astro.findById(req.params.astro_id );
    res.status(200).json(astro);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve Astro', error: error.message });
  }
};

const getAllAstros = async (req, res) => {
  try {
    const astros = await Astro.find();
    res.status(200).json(astros);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve Astros', error: error.message });
  }
};


const deleteAstro = async (req, res) => {
  try {
    let {astro_id} = req.params
    const deletedAstro = await Astro.findByIdAndDelete(astro_id);
   console.log(deletedAstro)
    res.status(200).json({ message: 'Astro deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Astro', error: error.message });
  }
};


const submitRating = async (req, res) => {
  try {
    const { astro_id, user_id } = req.params;
    const { rating, review } = req.body;  

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!review || review.trim() === "") {
      return res.status(400).json({ message: "Review cannot be empty" });
    }


    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const astro = await Astro.findById(astro_id);
    if (!astro) {
      return res.status(404).json({ message: "Astro not found" });
    }

    const existingRating = astro.reviews.find(r => r.reviewer === user.fullName);
    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this Astro" });
    }


    const newReview = {
      reviewer: user.fullName,
      rating,
      review,
      date: new Date()
    };

    astro.reviews.push(newReview);
    await astro.save();

    res.status(200).json({ message: "Rating added successfully", astro });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



const getSatisfiedCustomers = async (req, res) => {
  try {
    const astros = await Astro.find().lean(); 
    const uniqueReviewers = new Set();
    const satisfiedCustomers = [];

    for (const astro of astros) {
      for (const review of astro.reviews) {
        if (review.rating > 4) {  
          let user = await User.findOne({ fullName: review.reviewer }).lean();

          const userImage = user?.profileImage || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer)}`;

       
          if (!uniqueReviewers.has(review.reviewer)) {
            uniqueReviewers.add(review.reviewer);

            satisfiedCustomers.push({
              userFullName: review.reviewer,
              userImage,
              rating: review.rating,
              review: review.review,  
              astroName: astro.name
            });
          }
        }
      }
    }

    res.status(200).json({ satisfiedCustomers });
  } catch (error) {
    console.error("Error fetching satisfied customers:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};





module.exports = { createAstro, updateAstro, getAstro, getAllAstros, deleteAstro,submitRating,getSatisfiedCustomers };
