const OrderHistory = require('../models/OrderHistory');
const OrderHistoryProduct = require('../models/OrderHistoryProduct');
const User = require('../models/User');
const Admin = require('../models/Admin');
const {Pooja} = require('../models/Pooja')
const mongoose = require("mongoose");

const checkAdmin = async (adminId) => {
    const admin = await Admin.findById(adminId);
    return !!admin;
};
exports.getPendingBookings = async (req, res) => {
    try {
        const { adminId } = req.params;

        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

        const pendingBookings = await OrderHistory.aggregate([
            { $match: { pooja_status: 'APPROVED' } },
            { $group: { _id: "$pooja_name", count: { $sum: 1 }, details: { $push: "$$ROOT" } } }
        ]);
        res.json(pendingBookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const { adminId } = req.params;
        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

        const allBookings = await OrderHistory.find();
        res.json(allBookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { adminId } = req.params;
        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { bookingIds, status } = req.body;

        if (!['PENDING', 'APPROVED', 'DONE'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const existingBookings = await OrderHistory.find({ _id: { $in: bookingIds } }, { _id: 1 });
        const validBookingIds = existingBookings.map(booking => booking._id.toString());


        const invalidBookingIds = bookingIds.filter(id => !validBookingIds.includes(id));

        if (validBookingIds.length === 0) {
            return res.status(404).json({ error: 'No valid bookings found for the provided IDs' });
        }

        await OrderHistory.updateMany({ _id: { $in: validBookingIds } }, { $set: { pooja_status: status } });

        res.json({
            message: 'Booking status updated successfully',
            updatedBookings: validBookingIds,
            invalidBookings: invalidBookingIds.length ? invalidBookingIds : null
        });

    } catch (err) {
        console.error("Error updating booking status:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.filterBookingsByDate = async (req, res) => {
    try {
        const { adminId } = req.params;
        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }

        const bookings = await OrderHistory.find({
            date: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
        });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getCompletedBookings = async (req, res) => {
    try {
        const { adminId } = req.params;
        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

        const completedBookings = await OrderHistory.aggregate([
            {
                $match: { pooja_status: 'DONE' }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "user_id", 
                    foreignField: "_id", 
                    as: "userDetails"
                }
            },
            {
                $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 1,
                    pooja_name: 1,
                    package_name: 1,
                    date: 1,
                    place: 1,
                    package_price: 1, 
                    poojaType: 1,
                    gst_amount: 1, 
                    total_amount_before_gst: 1, 
                    gst_percentage: 1, 
                    total_amount_after_gst: 1,
                    payment_status: 1,
                    pooja_status: 1,  
                    images: 1,  
                    addons: 1,
                    perform_pooja_date: 1,
                    perform_pooja_time: 1,
                    live_url: 1,
                    userDetails: {
                        fullName: 1,
                        email: 1,
                        mobileNumber: 1,
                        profileImage: 1,
                        city: 1,
                        pincode: 1
                    }
                }
            },
            {
                $sort: { date: -1 } 
            }
        ]);

        res.json({ success: true, data: completedBookings });
    } catch (err) {
        console.error("Error fetching completed bookings:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



exports.getPoojaOrderCount = async (req, res) => {
    try {
        const { adminId } = req.params;
        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

        const result = await Pooja.aggregate([
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "name",
                    foreignField: "pooja_name",
                    as: "orderedPoojas"
                }
            },
            {
                $addFields: {
                    orderedPoojas: {
                        $filter: {
                            input: "$orderedPoojas",
                            as: "pooja",
                            cond: { $eq: ["$$pooja.pooja_status", "APPROVED"] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    orderCount: { $size: "$orderedPoojas" },
                    poojaImages: {
                        $reduce: {
                            input: "$orderedPoojas",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this.images"] }
                        }
                    },
                    poojaDate: { $min: "$orderedPoojas.date" }
                }
            },
            {
                $match: {
                    orderCount: { $gt: 0 } 
                }
            },
            {
                $unwind: "$orderedPoojas"
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    orderCount: { $first: "$orderCount" },
                    poojaImages: { $first: "$poojaImages" },
                    poojaDate: { $first: "$poojaDate" },
                    poojaType: { $first: "$orderedPoojas.poojaType" }
                }
            },
            {
                $sort: { orderCount: -1 }
            }
        ]);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching pooja order counts:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




exports.getPoojaUsers = async (req, res) => {
    try {
        const { adminId, poojaId } = req.params; 
        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

        const result = await Pooja.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(poojaId) } 
            },
            {
                $lookup: {
                    from: "orderhistories",
                    localField: "name",
                    foreignField: "pooja_name",
                    as: "orderedPoojas"
                }
            },
            { $unwind: "$orderedPoojas" },
            {
                $match: { "orderedPoojas.pooja_status": "APPROVED" } 
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: { $toObjectId: "$orderedPoojas.user_id" } },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$_id", "$$userId"] } }
                        },
                        {
                            $project: {
                                fullName: 1,
                                email: 1,
                                profileImage: 1,
                                city: 1,
                                mobileNumber: 1,
                                pincode: 1
                            }
                        }
                    ],
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    orderDetails: {
                        $push: {
                            booking_id: "$orderedPoojas._id",
                            cart_id: "$orderedPoojas.cart_id",
                            package_price: "$orderedPoojas.package_price",
                            gst_percentage: "$orderedPoojas.gst_percentage",
                            pooja_name: "$orderedPoojas.pooja_name",
                            package_name: "$orderedPoojas.package_name",
                            date: "$orderedPoojas.date",
                            place: "$orderedPoojas.place",
                            poojaType: "$orderedPoojas.poojaType",
                            images: "$orderedPoojas.images",
                            total_amount_before_gst: "$orderedPoojas.total_amount_before_gst",
                            gst_amount: "$orderedPoojas.gst_amount",
                            total_amount_after_gst: "$orderedPoojas.total_amount_after_gst",
                            payment_status: "$orderedPoojas.payment_status",
                            payment_date: "$orderedPoojas.payment_date",
                            shipping_address: "$orderedPoojas.shipping_address",
                            addons: "$orderedPoojas.addons",
                            pooja_status: "$orderedPoojas.pooja_status",
                            perform_pooja_date: "$orderedPoojas.perform_pooja_date",
                            perform_pooja_time: "$orderedPoojas.perform_pooja_time",
                            live_url: "$orderedPoojas.live_url",
                            userDetails: {
                                userId: "$orderedPoojas.user_id",
                                fullName: "$userDetails.fullName",
                                email: "$userDetails.email",
                                profileImage: "$userDetails.profileImage",
                                city: "$userDetails.city",
                                mobileNumber: "$userDetails.mobileNumber",
                                pincode: "$userDetails.pincode"
                            }
                        }
                    }
                }
            }
        ]);

        if (!result.length || (result[0].orderDetails.length === 0)) {
            return res.status(404).json({
                success: false,
                message: "No pending orders found for this pooja"
            });
        }

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Error fetching pending pooja orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};














exports.getAllOrders = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { order_status } = req.query; 

        
        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

       
        let filter = {};
        if (order_status) {
            filter.order_status = order_status.toUpperCase(); 
        }

        const orders = await OrderHistoryProduct.find(filter)
            .populate('user_id', 'fullName email mobileNumber profileImage city pincode')
            .populate('products.productId', 'name price images')
            .sort({ payment_date: -1 });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



exports.updateOrderStatus = async (req, res) => {
    try {
        const { adminId } = req.params;

        
        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }


        const { orderIds, status } = req.body; 

        if (!['SHIPPED', 'APPROVED', 'DELIVERED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }

        await OrderHistoryProduct.updateMany(
            { _id: { $in: orderIds } },
            { $set: { order_status: status } }
        );

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getOrdersByDate = async (req, res) => {
    try {
        const { adminId } = req.params;

        const adminUser = await User.findById(adminId);
        if (!(await checkAdmin(adminId)) && (!adminUser || adminUser.role !== "admin")) {
            return res.status(403).json({ error: "Access denied" });
        }

        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ success: false, message: 'Date is required' });
        }

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(targetDate);
        nextDay.setDate(targetDate.getDate() + 1);

        const orders = await OrderHistoryProduct.find({
            payment_date: { $gte: targetDate, $lt: nextDay }
        })
        .populate('user_id', 'fullName email mobileNumber profileImage city pincode')
        .populate('products.productId', 'name price images')
        .sort({ payment_date: -1 });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error filtering orders by date:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
