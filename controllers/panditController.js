const { default: mongoose } = require("mongoose");
const { uploadImage } = require("../config/cloudinary");
const { Pandit } = require("../models/Pandit");
const PanditBooking = require("../models/PanditBooking");
const User = require("../models/User");

exports.createPandit = async (req, res) => {
  try {
    let panditImageUrl = req.body.profilePhoto;

    // Handle profile photo upload
    if (req.file) {
      console.log("File received:", req.file);
      const uploadResponse = await uploadImage(req.file.path);
      console.log("Cloudinary response:", uploadResponse);
      panditImageUrl = uploadResponse.secure_url;
    }

    const panditData = { ...req.body, profilePhoto: panditImageUrl };

    // Create and save pandit
    const pandit = new Pandit(panditData);
    await pandit.save();

    res.status(200).json({ message: "Pandit data created successfully" });
    console.log(pandit);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error saving pandit data", error: error.message });
  }
};

exports.getPandit = async (req, res) => {
  try {
    const pandit = await Pandit.find();
    res.status(200).json(pandit);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve pandit", error: error.message });
  }
};

// exports.getPanditbyId = async (req, res) => {
//   const pandit_id=req.params;
//   try {
//     const pandit = await Pandit.findById(pandit_id);
//     res.status(200).json(pandit);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to retrieve pandit", error: error.message });
//   }
// };

exports.deletePandit = async (req, res) => {
  try {
    let { pandit_id } = req.params;
    const deletedpandit = await Pandit.findByIdAndDelete(pandit_id);
    console.log(deletedpandit);
    res.status(200).json({ message: "pandit ji deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "pandit ji not deleted", error });
  }
};

exports.updatePandit = async (req, res) => {
  const { pandit_id } = req.params;

  const {
    fullName,
    mobileNumber,
    email,
    profilePhoto,
    languagesSpoken,
    panditCategory,
    specializations,
    yearsOfExperience,
    servicesOffered,
    modeOfService,
    travelAvailability,
    serviceLanguages,
    availableDays,
    preferredTimeSlots,
    consultationFee,
    startingPrice,
    customPricingAvailable,
    preferredCommunication,
    readyForLiveConsultation,
    additionalInfo,
  } = req.body;

  try {
    const pandit = await Pandit.findById(pandit_id);
    if (!pandit) {
      return res.status(404).json({ message: "Pandit not found" });
    }

    pandit.fullName = fullName || pandit.fullName;
    pandit.mobileNumber = mobileNumber || pandit.mobileNumber;
    pandit.email = email || pandit.email;
    pandit.profilePhoto = profilePhoto || pandit.profilePhoto;

    pandit.languagesSpoken = Array.isArray(languagesSpoken)
      ? languagesSpoken
      : [languagesSpoken].filter(Boolean) || pandit.languagesSpoken;

    pandit.panditCategory = Array.isArray(panditCategory)
      ? panditCategory
      : [panditCategory].filter(Boolean) || pandit.panditCategory;

    pandit.specializations = Array.isArray(specializations)
      ? specializations
      : [specializations].filter(Boolean) || pandit.specializations;

    pandit.yearsOfExperience = yearsOfExperience || pandit.yearsOfExperience;

    pandit.servicesOffered = Array.isArray(servicesOffered)
      ? servicesOffered
      : [servicesOffered].filter(Boolean) || pandit.servicesOffered;

    pandit.modeOfService = modeOfService || pandit.modeOfService;
    pandit.travelAvailability = travelAvailability ?? pandit.travelAvailability;

    pandit.serviceLanguages = Array.isArray(serviceLanguages)
      ? serviceLanguages
      : [serviceLanguages].filter(Boolean) || pandit.serviceLanguages;

    pandit.availableDays = Array.isArray(availableDays)
      ? availableDays
      : [availableDays].filter(Boolean) || pandit.availableDays;

    pandit.preferredTimeSlots = preferredTimeSlots || pandit.preferredTimeSlots;
    pandit.consultationFee = consultationFee || pandit.consultationFee;
    pandit.startingPrice = startingPrice || pandit.startingPrice;
    pandit.customPricingAvailable =
      customPricingAvailable ?? pandit.customPricingAvailable;

    pandit.preferredCommunication =
      preferredCommunication || pandit.preferredCommunication;

    pandit.readyForLiveConsultation =
      readyForLiveConsultation ?? pandit.readyForLiveConsultation;

    pandit.additionalInfo = additionalInfo || pandit.additionalInfo;


    if (req.file) {
      const uploadResponse = await uploadImage(req.file.path);
      const panditImageUrl = uploadResponse.secure_url;
      pandit.profilePhoto = panditImageUrl || pandit.profilePhoto;
    }

    await pandit.save();
    console.log(pandit)
    res.status(200).json({ message: "Pandit details updated successfully." });
  } catch (error) {
    console.error("Error updating pandit:", error);
    res
      .status(500)
      .json({ message: "Failed to update pandit", error: error.message });
  }
};

exports.getPanditBooking= async(req,res)=>{
  try {
    const panditbooking = await PanditBooking.find();
    res.status(200).json(panditbooking);

  } catch (error) {
    console.log(error)
    res.status(400).json({message:"not able to retrieve"})
  }
}

exports.assignpandit = async(req,res) =>
{
  const { id } = req.params;  // Booking ID
  const { panditId } = req.body;  // Pandit ID

  try {
    // Find the booking by ID
    const booking = await PanditBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found!" });
    }

    // Find the Pandit by ID
    const pandit = await Pandit.findById(panditId);
    if (!pandit) {
      return res.status(404).json({ message: "Pandit not found!" });
    }

    // Assign Pandit to booking
    booking.assignedPandit = pandit._id;
    booking.status = "APPROVED"; 
    booking.assignedAt = new Date();
    await booking.save();

    res.status(200).json({ message: "Pandit assigned successfully", booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error assigning Pandit." });
  }
}

exports.bookPandit = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      userName,
      contactNumber,
      address,
      latitude,
      longitude,
      bookingDate,
      bookingTime,
      houseNumber,
      nearLandmark,
    } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required for booking" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newBooking = new PanditBooking({
      userId,
      userName,
      contactNumber,
      address,
      latitude,
      longitude,
      bookingDate,
      bookingTime,
      houseNumber,
      nearLandmark,
    });

    await newBooking.save();

    const formattedBooking = newBooking.toObject();

    formattedBooking.booking_id = formattedBooking._id;
    delete formattedBooking._id;
    delete formattedBooking.__v;
    res.status(201).json({
      message: "Pandit Ji booked successfully!",
      booking: formattedBooking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking Pandit Ji", error: error.message });
  }
};

exports.getPanditBookingHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const bookings = await PanditBooking.find({ userId });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    const formattedBookings = bookings.map((booking) => ({
      booking_id: booking._id,
      userName: booking.userName,
      contactNumber: booking.contactNumber,
      houseNumber: booking.houseNumber,
      nearLandmark: booking.nearLandmark,
      address: booking.address,
      latitude: booking.latitude,
      longitude: booking.longitude,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      status: booking.status,
    }));

    res.status(200).json({ bookings: formattedBookings });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving booking history",
      error: error.message,
    });
  }
};
