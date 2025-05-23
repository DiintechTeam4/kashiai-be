const User = require('../models/User');
const DeleteRequest = require('../models/DeleteRequest');

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params; 
    const { email, mobileNumber, fullName, dateOfBirth,birthTime,birthPlace,occupation,gender, city, pincode, gotra,profileImage } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (fullName) user.fullName = fullName;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (birthTime) user.birthTime = birthTime;
    if (birthPlace) user.birthPlace = birthPlace;
    if (occupation) user.occupation = occupation;
    if (gender) user.gender = gender;
    if (city) user.city = city;
    if (pincode) user.pincode = pincode;
    if (gotra) user.gotra = gotra;
    if (profileImage) user.profileImage = profileImage;


    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const requestDeleteAccount = async (req, res) => {
  try {
    const { fullName, email, mobileNumber } = req.body;

    if (!fullName || (!email && !mobileNumber)) {
      return res.status(400).json({ success: false, message: 'Full name and at least one contact detail (email or mobile number) are required' });
    }
    const user = await User.findOne({
      $or: [{ email }, { mobileNumber }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const existingRequest = await DeleteRequest.findOne({ userId: user._id });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Deletion request already submitted' });
    }

    const deleteRequest = new DeleteRequest({
      userId: user._id,
      fullName,
      email: user.email || '', 
      mobileNumber: user.mobileNumber || '' 
    });

    await deleteRequest.save();

    res.json({ success: true, message: 'Your account deletion request has been submitted successfully. Your account will be permanently deleted within 30 days.' });
  } catch (error) {
    console.error('Error submitting delete request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { updateProfile, requestDeleteAccount };
