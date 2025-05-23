const crypto = require('crypto');
const ProductPayment = require('../models/ProductPayment');
const CartProduct = require('../models/CartProduct')
const OrderHistoryProduct  = require('../models/OrderHistoryProduct')
const User = require('../models/User');
const dotenv = require('dotenv');
const { Cashfree } = require("cashfree-pg");
const Address = require('../models/Address')
dotenv.config();

exports.initiatePayment = async (req, res) => {
  const { user_id, cart_id } = req.params;
  console.log(cart_id);

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const cart = await CartProduct.findById(cart_id);
    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    console.log(cart);
    const totalAmount = cart.totalAmountAfterGst;
    const address = await Address.findOne({ userId: user_id });
    if (!address) return res.status(400).json({ message: "Address not found" });
   
    await ProductPayment.deleteOne({ cart_id });


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
        notify_url: process.env.NOTIFY_URL_Prod,
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);
    console.log(response);

    const newOrder = new ProductPayment({
      amount: totalAmount,
      user_id,
      address_id: address._id,
      cart_id,
      cashfree_order_id: response.data.order_id,
      status: "PENDING",
    });

    await newOrder.save();

    res.json(response.data);
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to create order." });
  }
};


exports.handlePaymentResponse = async (req, res) => {
  console.log(`product callback`)
  try {
    const response = req.body; 
    const { data } = response;
    console.log(data)
    if (!data || !data.payment) {
      return res.status(400).json({ message: 'Invalid payment response format' });
    }

    const { cf_payment_id, payment_status, payment_amount, payment_time } = data.payment;
    const { order_id } = data.order;
    console.log(data.payment)
    
    const productPayment = await ProductPayment.findOne({cashfree_order_id: order_id });
    const cart = await CartProduct.findOne({ _id: productPayment.cart_id })
    console.log(`in callback product payment status ${payment_status}`)
    if (!productPayment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }
    console.log(`in callback poojaPayment entry${productPayment}`)
    
    productPayment.payment_status = payment_status;
    productPayment.amount = payment_amount;
    productPayment.payment_date = new Date(payment_time);
    await productPayment.save();

    
    res.status(200).json({ message: 'Payment details saved successfully' });
  } catch (error) {
    console.error('Error handling payment response:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
