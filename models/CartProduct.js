const mongoose = require('mongoose');
const cartProductSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        gst: Number,
        images: { type: Array, default: [] },
    }],
    totalAmountBeforeGst: Number,
    totalGstAmount: Number,
    totalAmountAfterGst: Number
});

const CartProduct = mongoose.model('CartProduct', cartProductSchema);
module.exports = CartProduct;