const PoojaPayment = require('../models/PoojaPayment'); 
const ProductPayment = require('../models/ProductPayment');
exports.confirmPoojaPayment = async (req, res) => {
    const { cartId } = req.params;  
    
    try {
        
        const payment = await PoojaPayment.findOne({ cart_id: cartId }).populate('user_id pooja_id');

        if (!payment) {
            return res.status(404).json({ error: 'Payment record not found for this cart' });
        }

       
        return res.status(200).json({
            user_id: payment.user_id,
            cart_id: payment.cart_id,
            payment_status: payment.payment_status
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.confirmProductPayment = async (req, res) => {
    const { cartId } = req.params;  
    
    try {
       
        const payment = await ProductPayment.findOne({ cart_id: cartId }).populate('user_id');

        if (!payment) {
            return res.status(404).json({ error: 'Payment record not found for this cart' });
        }

        
        return res.status(200).json({
            user_id: payment.user_id,
            cart_id: payment.cart_id,
            payment_status: payment.payment_status
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
