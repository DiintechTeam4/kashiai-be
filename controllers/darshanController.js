const Darshan = require('../models/Darshan');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { uploadImage } = require('../config/cloudinary'); 


exports.createDarshan = async (req, res) => {
  try {
   
    console.log(req.body)
    let darshanImageUrl = req.body.darshan_image;

  
    if (req.file) {
     
      const uploadResponse = await uploadImage(req.file.path);

     
      darshanImageUrl = uploadResponse.secure_url;

    }

   
    let darshanData = {...req.body,darshan_image:darshanImageUrl}
    console.log(darshanData)
    const newDarshan = new Darshan(darshanData);

    await newDarshan.save();
    res.status(201).json(newDarshan); 
  } catch (error) {
    console.error('Error creating darshan:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// exports.updateDarshan = async (req, res) => {
//   try {
//     const { darshan_id } = req.params;
//     const updates = req.body;
//     if (req.file) {
//       // For instance, you can set the local file path as the new image URL
//       const uploadResponse = await uploadImage(req.file.path);

     
//       darshanImageUrl = uploadResponse.secure_url;
//       updates.darshan_image = darshanImageUrl;
//       // Or, if you're using an image hosting service, call the appropriate upload function here.
//     }
//     console.log(updates)
//     const updatedDarshan = await Darshan.findByIdAndUpdate(darshan_id, updates, { new: true });

//     if (!updatedDarshan) {
//       return res.status(404).json({ message: 'Darshan not found.' });
//     }

//     res.status(200).json({ message: 'Darshan details updated successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.updateDarshan = async (req, res) => {
  try {
    const { darshan_id } = req.params;
    const updates = req.body;

    console.log(updates)
    // console.log(`updates.darshan_name value ${updates.darshan_name}`)
    // console.log("updates.darshan name type"+typeof updates.darshan_name)
    const darshan = await Darshan.findById(darshan_id);
    // console.log(`fetched darshan before change ${darshan}`)
    if (!darshan) {
      return res.status(404).json({ message: 'Darshan not found.' });
    }

    if (updates.darshan_name !== "undefined" && updates.darshan_name !== "" ) {
      darshan.darshan_name = updates.darshan_name;
    }
    if (updates.darshan_streaming_time !== "undefined" && updates.darshan_streaming_time !== "" ) {
      darshan.darshan_streaming_time = updates.darshan_streaming_time;
    }
    if (updates.live_streaming_link !== "undefined" && updates.live_streaming_link !== "" ) {
      darshan.live_streaming_link = updates.live_streaming_link;
    }
    if (updates.live !== "undefined" && updates.live !== "" ) {
      darshan.live = updates.live;
    }

   
    if (req.file) {
     
      const uploadResponse = await uploadImage(req.file.path);
      darshan.darshan_image = uploadResponse.secure_url;
    }

    console.log(`fetched darshan after change ${darshan}`)

    await darshan.save();

    res.status(200).json({ message: 'Darshan details updated successfully.', data: darshan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDarshan = async (req, res) => {
  try {
    const { darshan_id } = req.params;

    const darshan = await Darshan.findById(darshan_id);

    if (!darshan) {
      return res.status(404).json({ message: 'Darshan not found.' });
    }

    res.status(200).json(darshan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDarshans = async (req, res) => {
  try {
    const darshans = await Darshan.find();
    res.status(200).json(darshans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDarshan = async (req, res) => {
  try {
    const { darshan_id } = req.params;

    const deletedDarshan = await Darshan.findByIdAndDelete(darshan_id);

    if (!deletedDarshan) {
      return res.status(404).json({ message: 'Darshan not found.' });
    }

    res.status(200).json({ message: 'Darshan deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getTotalDarshans = async (req, res) => {
  try {
    const total = await Darshan.countDocuments(); // counts all documents
    res.status(200).json({ totalDarshans: total });
  } catch (err) {
    console.error('Error counting Poojas:', err);
    res.status(500).json({ message: 'Server error' });
  }
};