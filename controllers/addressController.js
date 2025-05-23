const Address = require("../models/Address");

exports.createAddress = async (req, res) => {
  try {
    const { address, state, city, nearby, pincode } = req.body;
    const { userId } = req.params;

    if (!address || !state || !city || !pincode) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const existingAddress = await Address.findOne({ userId });

    if (existingAddress) {
      return res.status(400).json({ error: "User already has an address. Update it instead." });
    }

    const newAddress = new Address({ userId, address, state, city, nearby, pincode });
    await newAddress.save();

    res.status(201).json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.find({ userId });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { userId }, 
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ error: "Address not found for this user" });
    }

    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
