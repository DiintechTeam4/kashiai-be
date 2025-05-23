
const crypto = require('crypto');
const PoojaPayment = require('../models/PoojaPayment');
const CartPooja = require('../models/CartPooja')
const User = require('../models/User');
const OrderHistory = require('../models/OrderHistory')
const dotenv = require('dotenv');
const { Cashfree } = require("cashfree-pg");
const Address = require('../models/Address')
const {Pooja} = require('../models/Pooja')
dotenv.config();

exports.initiatePayment = async (req, res) => {
  const { user_id, cart_id } = req.params;

  try {
    const user = await User.findById(user_id);
    if (!user) return res.status(400).json({ message: "User not found" });

    const cart = await CartPooja.findById(cart_id);
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    let totalAmount = cart.total_amount_after_gst;
    totalAmount = Number(totalAmount.toFixed(2));
    
    console.log("typeof totalamount"+typeof totalAmount)
    console.log("value of totalamount "+totalAmount)

    const address = await Address.findOne({ userId: user_id });
    

   
    await PoojaPayment.deleteOne({ cart_id });


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
        notify_url: process.env.NOTIFY_URL,
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);

    const newOrder = new PoojaPayment({
      amount: totalAmount,
      user_id,
      address_id: address ? address._id : null,
      cart_id,
      pooja_id: cart.pooja_id,
      cashfree_order_id: response.data.order_id
    });

    await newOrder.save();

    res.json(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to create order." });
  }
};

exports.handlePaymentResponse = async (req, res) => {
  try {
    const response = req.body;
    const { data } = response;
    console.log(data)

    if (!data || !data.payment) {
      return res.status(400).json({ message: 'Invalid payment response format' });
    }
    console.log(data.payment)
    const { cf_payment_id, payment_status, payment_amount, payment_time } = data.payment;
    const { order_id } = data.order;
    console.log(`payment status ${payment_status}`)

    const poojaPayment = await PoojaPayment.findOne({cashfree_order_id: order_id });

    const cart = await CartPooja.findOne({ _id: poojaPayment.cart_id });
    console.log(`in callback pooja cart ${cart}`)
    console.log(`in callback pooja poojaPayment entry${poojaPayment}`)
    if (!poojaPayment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    poojaPayment.payment_status = payment_status;
    poojaPayment.amount = payment_amount;
    poojaPayment.payment_date = new Date(payment_time);
    await poojaPayment.save();

    if (payment_status === 'SUCCESS') {
      const existingOrder = await OrderHistory.findOne({ cart_id: poojaPayment.cart_id });
      if (!existingOrder) {
        const pooja = await Pooja.findOne({ _id: cart.pooja_id });

        if (!pooja) {
          return res.status(404).json({ message: 'Pooja record not found' });
        }

        const orderDetails = {
          cart_id: poojaPayment.cart_id,
          user_id: poojaPayment.user_id,
          pooja_name: cart.pooja_name,
          package_name: cart.package_name,
          payment_date: poojaPayment.payment_date,
          date: cart.date,
          place: cart.place,
          images: cart.images,
          total_amount_before_gst: cart.total_amount_before_gst,
          gst_amount: cart.gst_amount,
          total_amount_after_gst: cart.total_amount_after_gst,
          addons: cart.addons,
          package_price: cart.package_price, 
          gst_percentage: cart.gst_percentage,
          poojaType: pooja.poojaType
        };

        await OrderHistory.create(orderDetails);
        console.log(`Order created successfully for cart_id: ${poojaPayment.cart_id}`);
      } else {
        console.log(`Order already exists for cart_id: ${poojaPayment.cart_id}`);
      }
    }


    res.status(200).json({ message: 'Payment details saved successfully' });

  } catch (error) {
    console.error('Error handling payment response:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};