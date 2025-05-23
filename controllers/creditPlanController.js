const CreditPlan = require("../models/CreditPlan");
const Admin = require("../models/Admin"); 
const CreditPayment = require("../models/CreditPayment");
exports.addCreditPlan = async (req, res) => {
    console.log(req.body)
    try {
        const {adminId} = req.params;
        const { creditAmount, credit, questionPerCredit, voicePerMinute, description, validUpto, offer, extraCredit } = req.body;

        if (!adminId) {
            return res.status(403).json({ message: "Admin ID is required" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(403).json({ message: "Unauthorized: Admin access required" });
        }

        const newPlan = new CreditPlan({
          questionPerCredit,
          voicePerMinute,
            creditAmount,
            credit,
            description,
            validUpto,
            offer,
            extraCredit
        });

        await newPlan.save();
        res.status(201).json({ message: "Credit plan added successfully", newPlan });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCreditPlans = async (req, res) => {
    try {
        const creditPlans = await CreditPlan.find();
        res.status(200).json(creditPlans);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch credit plans", error: error.message });
    }
};

exports.updateCreditPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        console.log("updated data",updatedData )
        const updatedCreditPlan = await CreditPlan.findByIdAndUpdate(id, updatedData, { new: true });
        console.log(updatedCreditPlan)
        if (!updatedCreditPlan) {
            return res.status(404).json({ message: "Credit plan not found" });
        }

        res.status(200).json({ message: "Credit plan updated successfully", updatedCreditPlan });
    } catch (error) {
        res.status(500).json({ message: "Failed to update credit plan", error: error.message });
    }
};

exports.deleteCreditPlan = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPlan = await CreditPlan.findByIdAndDelete(id);
  
      if (!deletedPlan) {
        return res.status(404).json({ message: "Credit plan not found" });
      }
  
      res.json({ message: "Credit plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting credit plan:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

exports.getCreditPaymentStatus = async (req, res) => {
  const { order_id } = req.params; 

  try {
   
    const creditPayment = await CreditPayment.findOne({ cashfree_order_id: order_id });

    if (!creditPayment) {
      return res.status(404).json({ message: "Credit payment not found for this order ID." });
    }

    return res.status(200).json({
      payment_status: creditPayment.payment_status
    });

  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
