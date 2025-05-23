const CreditPayment = require("../models/CreditPayment");
const CreditPlan = require("../models/CreditPlan");
const User = require("../models/User");
const dotenv = require("dotenv");
const { Cashfree } = require("cashfree-pg");
const OrderHistoryCredit = require("../models/OrderHistoryCredit");
dotenv.config();


exports.initiateCreditPayment = async (req, res) => {
    const { user_id, credit_id } = req.params;

    try {
        const user = await User.findById(user_id);
        if (!user) return res.status(400).json({ message: "User not found" });

        const creditPlan = await CreditPlan.findById(credit_id);
        if (!creditPlan) return res.status(400).json({ message: "Credit plan not found" });

        
        let totalAmount = creditPlan.creditAmount;
        // if (creditPlan.offer > 0) {
        //     const discount = (totalAmount * creditPlan.offer) / 100;
        //     totalAmount -= discount;
        // }

        // totalAmount = Number(totalAmount.toFixed(2));

       
        // const totalCredits = creditPlan.credit + creditPlan.extraCredit;

       
        // await CreditPayment.deleteOne({ user_id, credit_id, payment_status: "PENDING" });

        Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
        Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
        Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

        const orderRequest = {
            order_amount: totalAmount,
            order_currency: "INR",
            customer_details: {
                customer_id: user._id.toString(),
                customer_name: user.fullName,
                customer_email: user.email,
                customer_phone: user.mobileNumber,
            },
            order_meta: {
                notify_url: process.env.NOTIFY_URL_CREDIT,
            },
        };

        console.log("orderrequest")
        console.log(orderRequest)

        const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);

        const newPayment = new CreditPayment({
            user_id,
            credit_id,
            creditAmount: creditPlan.creditAmount,
            credit: creditPlan.credit,
            offer: creditPlan.offer,
            extraCredit:creditPlan.extraCredit,
            cashfree_order_id: response.data.order_id,
            payment_session_id: response.data.payment_session_id,
            validUpto : creditPlan.validUpto,
            voicePerMinute: creditPlan.voicePerMinute,
            questionPerCredit: creditPlan.questionPerCredit,
            description: creditPlan.description
        });


       

        await newPayment.save();

        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to initiate credit payment." });
    }
};

exports.handlePaymentResponse = async (req, res) => {
    try {
        const response = req.body;
        const { data } = response;
        console.log(data);

        if (!data || !data.payment) {
            return res.status(400).json({ message: "Invalid payment response format" });
        }

        const { cf_payment_id, payment_status, payment_amount, payment_time } = data.payment;
        const { order_id } = data.order;

        console.log(`Payment Status: ${payment_status}`);

        const creditPayment = await CreditPayment.findOne({ cashfree_order_id: order_id });
        if (!creditPayment) {
            return res.status(404).json({ message: "Payment record not found" });
        }

        creditPayment.payment_status = payment_status;
        creditPayment.amount_after_discount = payment_amount;
        creditPayment.payment_date = new Date(payment_time);
        await creditPayment.save();


        if (payment_status === "SUCCESS") {
            const existingOrder = await OrderHistoryCredit.findOne({ payment_id: creditPayment._id });

            if (!existingOrder) {
                const orderHistory = new OrderHistoryCredit({
                    user_id: creditPayment.user_id,
                    credit_id: creditPayment.credit_id,
                    payment_id: creditPayment._id,
                    creditAmount: creditPayment.creditAmount,
                    credit: creditPayment.credit,
                    extraCredit: creditPayment.extraCredit || 0,
                    offer: creditPayment.offer || 0,
                    payment_date: creditPayment.payment_date,
                    validUpto: creditPayment.validUpto,
                    voicePerMinute: creditPayment.voicePerMinute || 0,
                    questionPerCredit: creditPayment.questionPerCredit || 0,
                    description: creditPayment.description
                });

                await orderHistory.save();
                console.log(`Order history created for payment_id: ${creditPayment._id}`);
            } else {
                console.log(`Order history already exists for payment_id: ${creditPayment._id}`);
            }
        }



        res.status(200).json({ message: "Payment details saved successfully" });
    } catch (error) {
        console.error("Error handling payment response:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
