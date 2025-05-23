const OrderHistoryCredit = require("../models/OrderHistoryCredit");
const CreditPayment = require("../models/CreditPayment");

exports.getOrderHistoryForCredits = async (req, res) => {
  const { user_id } = req.params;

  try {
    const orderHistory = await OrderHistoryCredit.find({ user_id });

    if (!orderHistory.length) {
      return res.status(404).json({ message: "No order history found for this user." });
    }

    return res.status(200).json({ orderHistory });

  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
