const UserAction = require("../models/UserAction");
const User = require("../models/User");
const Astro = require("../models/Astro")

const logUserAction = async (req, res) => {
    try {
        const {userId,astroId}=req.params;
        const { actionType } = req.body;

        if (!userId || !["call", "chat"].includes(actionType)) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const astroExists = await Astro.findById(astroId);
        if (!astroExists) {
            return res.status(404).json({ message: "Astrologer not found" });
        }


        const newAction = new UserAction({ userId,astroId, actionType });
        await newAction.save();

        res.status(201).json({ message: "User action logged successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const getUserActions = async (req, res) => {
    try {
        const actions = await UserAction.find().populate("userId", "name email");
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// const getPendingAstroRequests = async (req, res) => {
//     try {
//         const approvedActions = await UserAction.find({ action_status: "APPROVED" }).select("-__v");
//         if (!approvedActions.length) {
//             return res.status(404).json({ message: "No approved actions found." });
//         }


//         const enrichedActions = await Promise.all(
//             approvedActions.map(async (action) => {
//                 const user = await User.findById(action.userId).select("-__v");
    
//                 return { 
//                     action_id: action._id,
//                     userId: action.userId,
//                     astroId: action.astroId,
//                     actionType: action.actionType,
//                     action_status: action.action_status,
//                     timestamp: action.timestamp,
//                     user:{
//                     mobileNumber: user.mobileNumber,
//                     email: user.email,
//                     fullName: user.fullName,
//                     profileImage: user.profileImage,
//                     gender: user.gender,
//                     occupation: user.occupation,
//                     profileImage: user.profileImage
//                 } };
//             })
//         );
//         res.status(200).json({ success: true, data: enrichedActions });
//     } catch (error) {
//         console.error("Error fetching approved actions:", error);
//         res.status(500).json({ success: false, message: "Server error." });
//     }
// };






// const getCompletedAstroRequests = async (req, res) => {
//     try {
//         const completedRequests = await UserAction.find({ action_status: "DONE" }).select("-__v");
        
//         if (!completedRequests.length) {
//             return res.status(404).json({ message: "No completed actions found." });
//         }

//         const enrichedRequests = await Promise.all(
//             completedRequests.map(async (request) => {
//                 const user = await User.findById(request.userId).select("-__v");
                
//                 return { 
//                     action_id: request._id,
//                     userId: request.userId,
//                     astroId: request.astroId,
//                     actionType: request.actionType,
//                     action_status: request.action_status,
//                     timestamp: request.timestamp,
//                     user: {
//                         mobileNumber: user?.mobileNumber,
//                         email: user?.email,
//                         fullName: user?.fullName,
//                         profileImage: user?.profileImage,
//                         gender: user?.gender,
//                         occupation: user?.occupation
//                     }
//                 };
//             })
//         );

//         res.status(200).json({ success: true, data: enrichedRequests });
//     } catch (error) {
//         console.error("Error fetching completed actions:", error);
//         res.status(500).json({ success: false, message: "Server error." });
//     }
// };



const getPendingAstroRequests = async (req, res) => {
    try {
        const { page = 1, limit = 4 } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        const total = await UserAction.countDocuments({ action_status: "APPROVED" });

        const approvedActions = await UserAction.find({ action_status: "APPROVED" })
            .select("-__v")
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        if (!approvedActions.length) {
            return res.status(404).json({ message: "No approved actions found." });
        }

        const enrichedActions = await Promise.all(
            approvedActions.map(async (action) => {
                const user = await User.findById(action.userId).select("-__v");
                return {
                    action_id: action._id,
                    userId: action.userId,
                    astroId: action.astroId,
                    actionType: action.actionType,
                    action_status: action.action_status,
                    timestamp: action.timestamp,
                    user: user ? {
                        mobileNumber: user.mobileNumber,
                        email: user.email,
                        fullName: user.fullName,
                        profileImage: user.profileImage,
                        gender: user.gender,
                        occupation: user.occupation
                    } : null
                };
            })
        );

        res.status(200).json({ 
            success: true, 
            data: enrichedActions,
            pagination: {
                totalRecords: total,
                currentPage: pageNumber,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.error("Error fetching approved actions:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const getCompletedAstroRequests = async (req, res) => {
    try {
        const { page = 1, limit = 4 } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        const total = await UserAction.countDocuments({ action_status: "DONE" });

        const completedRequests = await UserAction.find({ action_status: "DONE" })
            .select("-__v")
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        if (!completedRequests.length) {
            return res.status(404).json({ message: "No completed actions found." });
        }

        const enrichedRequests = await Promise.all(
            completedRequests.map(async (request) => {
                const user = await User.findById(request.userId).select("-__v");
                return {
                    action_id: request._id,
                    userId: request.userId,
                    astroId: request.astroId,
                    actionType: request.actionType,
                    action_status: request.action_status,
                    timestamp: request.timestamp,
                    user: user ? {
                        mobileNumber: user.mobileNumber,
                        email: user.email,
                        fullName: user.fullName,
                        profileImage: user.profileImage,
                        gender: user.gender,
                        occupation: user.occupation
                    } : null
                };
            })
        );

        res.status(200).json({ 
            success: true, 
            data: enrichedRequests,
            pagination: {
                totalRecords: total,
                currentPage: pageNumber,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.error("Error fetching completed actions:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};



const updateAstroRequestStatus = async (req, res) => {
    try {
        const { action_id, adminId } = req.params;
        const { action_status } = req.body;

        
        if (!["APPROVED", "PENDING", "DONE"].includes(action_status)) {
            return res.status(400).json({ message: "Invalid action status" });
        }

        
        const adminUser = await User.findById(adminId);
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized: Only admins can update the action status" });
        }

        
        const updatedAction = await UserAction.findByIdAndUpdate(
            action_id,
            { action_status },
            { new: true }
        ).select("-__v"); 

        if (!updatedAction) {
            return res.status(404).json({ message: "Action not found" });
        }

        
        const { _id, ...rest } = updatedAction.toObject();
        res.status(200).json({ 
            message: "Action status updated successfully", 
            updatedAction: { action_id: _id, ...rest } 
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating action status", error: error.message });
    }
};




module.exports = { logUserAction, getUserActions,getPendingAstroRequests,getCompletedAstroRequests,updateAstroRequestStatus };
