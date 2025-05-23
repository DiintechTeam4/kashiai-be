const OnDemandPooja = require("../models/ondemandPooja");
const OrderHistory = require("../models/OrderHistory");
const { Pooja } = require("../models/Pooja");
const mongoose = require("mongoose");
// exports.sendPujaRequest = async (req, res) => {
//     try {
//         const { userId, poojaId } = req.params;

//         if (!userId || !poojaId) {
//             return res.status(400).json({ message: "User ID and Pooja ID are required" });
//         }

//         const newRequest = new OnDemandPooja({ userId, poojaId });
//         await newRequest.save();

//         res.status(201).json({ message: "Puja request sent successfully", 
//             request: {
//                 request_id: newRequest._id, 
//                 userId: newRequest.userId,
//                 poojaId: newRequest.poojaId,
//                 status: newRequest.status,
//                 createdAt: newRequest.createdAt
//             }
//          });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

exports.sendPujaRequest = async (req, res) => {
    try {
        const { userId, poojaId } = req.params;

        if (!userId || !poojaId) {
            return res.status(400).json({ message: "User ID and Pooja ID are required" });
        }

        const pooja = await Pooja.findById(poojaId);
        if (!pooja) {
            return res.status(404).json({ message: "Pooja not found" });
        }

        const newRequest = new OnDemandPooja({ userId, poojaId });
        await newRequest.save();

        const gstAmount = (pooja.starting_price * pooja.gst_percentage) / 100;
        const totalAmountAfterGst = pooja.starting_price + gstAmount;

        const newOrder = new OrderHistory({
            cart_id:new mongoose.Types.ObjectId(), 
            user_id: userId,
            package_price: pooja.starting_price,
            gst_percentage: pooja.gst_percentage,
            pooja_name: pooja.name,
            package_name: pooja.name, 
            date: pooja.date,
            place: pooja.location || "Not specified",
            images: pooja.images || [],
            total_amount_before_gst: pooja.starting_price,
            gst_amount: gstAmount,
            total_amount_after_gst: totalAmountAfterGst,
            payment_status: "PENDING",
            payment_date: new Date(), 
            addons:  [],
            poojaType: pooja.poojaType,
            pooja_status: "APPROVED",
            perform_pooja_date: pooja.date,
            perform_pooja_time: "",
            live_url: ""
        });
        
        await newOrder.save();
        

        res.status(201).json({
            message: "Puja request sent and added to order history successfully",
            request: {
                request_id: newRequest._id,
                userId: newRequest.userId,
                poojaId: newRequest.poojaId,
                status: newRequest.status,
                createdAt: newRequest.createdAt
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};