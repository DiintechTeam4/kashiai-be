const Yatra = require('../models/Yatra');

exports.createYatra = async (req, res) => {
    try {
        const { location, name, mobileNumber, gender, numberOfPassengers,bookingDate  } = req.body;
        const { userId } = req.params;  

        if (!location || !name || !mobileNumber || !gender || !numberOfPassengers || !bookingDate ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newYatra = new Yatra({
            userId,
            location,
            name,
            mobileNumber,
            gender,
            numberOfPassengers,
            bookingDate: new Date(bookingDate) 
        });

        await newYatra.save();
        res.status(201).json({ message: "Yatra created successfully", yatra: newYatra });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getYatraBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const yatras = await Yatra.find({ userId }).select('-__v');

        if (!yatras.length) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        const formattedYatras = yatras.map(yatra => ({
            yatra_booking_id: yatra._id,
            userId: yatra.userId,
            location: yatra.location,
            name: yatra.name,
            mobileNumber: yatra.mobileNumber,
            gender: yatra.gender,
            numberOfPassengers: yatra.numberOfPassengers,
            bookingDate : yatra.bookingDate,
            status: yatra.status
        }));

        res.status(200).json(formattedYatras);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

