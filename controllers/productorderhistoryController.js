const OrderHistoryProduct = require('../models/OrderHistoryProduct');
const CartProduct = require('../models/CartProduct');
const ProductPayment = require('../models/ProductPayment');
const Address = require('../models/Address')

exports.getOrderHistoryForProducts = async (req, res) => {
  const { user_id } = req.params;

  try {

    const productPayments = await ProductPayment.find({ user_id, payment_status: 'SUCCESS' });

    if (!productPayments.length) {
      return res.status(404).json({ message: 'No successful payments found for this user.' });
    }

    for (const productPayment of productPayments) {
      const cart = await CartProduct.findOne({ _id: productPayment.cart_id });

      if (!cart) {
        console.log(`Cart not found for cart_id: ${productPayment.cart_id}`);
        continue;
      }

      const existingOrder = await OrderHistoryProduct.findOne({ cart_id: productPayment.cart_id });
      if (existingOrder) {
        console.log(`Order already exists for cart_id: ${productPayment.cart_id}`);
        continue; 
      }
      const address = await Address.findOne({ _id: productPayment.address_id });
            if (!address) {
              console.log(`Address not found for address_id: ${productPayment.address_id}`);
              continue;
            }

      const orderDetails = {
        cart_id: productPayment.cart_id,
        user_id: productPayment.user_id,
        products: cart.products,
        payment_date: productPayment.payment_date,
        totalAmountBeforeGst: cart.totalAmountBeforeGst,
        totalGstAmount: cart.totalGstAmount,
        totalAmountAfterGst: cart.totalAmountAfterGst,
        shipping_address: {
          address: address.address,
          state: address.state,
          city: address.city,
          nearby: address.nearby,
          pincode: address.pincode,
        }
      };

      await OrderHistoryProduct.create(orderDetails);

     
      await CartProduct.deleteOne({ _id: productPayment.cart_id });
      console.log(`Cart with cart_id: ${productPayment.cart_id} deleted successfully.`);
    }


    const orderHistory = await OrderHistoryProduct.find({ user_id });
    return res.status(200).json({ orderHistory });

  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
