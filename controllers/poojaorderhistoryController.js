const OrderHistory = require('../models/OrderHistory');
const PoojaPayment = require('../models/PoojaPayment')
const CartPooja = require('../models/CartPooja')
const {Pooja} = require('../models/Pooja')

const Address = require('../models/Address')




// exports.getOrderHistoryForPoojas = async (req, res) => {
//   const { user_id } = req.params;

//   try {
//     const orderHistory = await OrderHistory.find({ user_id });

//     if (!orderHistory.length) {
//       return res.status(404).json({ message: 'No order history found for this user.' });
//     }

//     return res.status(200).json({ orderHistory });
//   } catch (error) {
//     console.error('Error fetching order history:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



exports.getOrderHistoryForPoojas = async (req, res) => {
  const { user_id } = req.params;

  try {
    const orderHistory = await OrderHistory.find({ user_id }).lean();

    console.log(orderHistory);
    if (!orderHistory.length) {
      return res.status(404).json({ message: 'No order history found for this user.' });
    }

    const orders = orderHistory.map(order => {
      const {  __v, ...orderData } = order;
      return { 
        ...orderData
      };
    });

    return res.status(200).json({ orderHistory: orders });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getApprovedPoojas = async (req, res) => {
  try {
    const approvedOrders = await OrderHistory.find({ pooja_status: 'APPROVED' })
      .populate('user_id', 'fullName') 
      .lean();

    if (!approvedOrders.length) {
      return res.status(404).json({ message: 'No approved poojas found.' });
    }

    const formattedOrders = approvedOrders.map(order => ({
      fullName: order.user_id.fullName,
      pooja_name: order.pooja_name,
      package_name: order.package_name,
      date: order.date,
      place: order.place,
      total_amount_after_gst: order.total_amount_after_gst,
      total_amount_before_gst: order.total_amount_before_gst,
      gst_amount: order.gst_amount,
      payment_status: order.payment_status,
      payment_date: order.payment_date,
      addons: order.addons,
      poojaType: order.poojaType,
      perform_pooja_date: order.perform_pooja_date,
      perform_pooja_time: order.perform_pooja_time,
      live_url: order.live_url
    }));

    return res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching approved poojas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getDonePoojas = async (req, res) => {
  try {
    const doneOrders = await OrderHistory.find({ pooja_status: 'DONE' })
      .populate('user_id', 'fullName') 
      .lean();

    if (!doneOrders.length) {
      return res.status(404).json({ message: 'No completed poojas found.' });
    }

    const formattedOrders = doneOrders.map(order => ({
      fullName: order.user_id.fullName,
      pooja_name: order.pooja_name,
      package_name: order.package_name,
      date: order.date,
      place: order.place,
      total_amount_after_gst: order.total_amount_after_gst,
      total_amount_before_gst: order.total_amount_before_gst,
      gst_amount: order.gst_amount,
      payment_status: order.payment_status,
      payment_date: order.payment_date,
      addons: order.addons,
      poojaType: order.poojaType,
      perform_pooja_date: order.perform_pooja_date,
      perform_pooja_time: order.perform_pooja_time,
      live_url: order.live_url
    }));

    return res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching done poojas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};