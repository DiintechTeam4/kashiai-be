const CartProduct = require('../models/CartProduct');
const Category = require("../models/Category");
const Product = require('../models/Product');
const User  = require("../models/User");


exports.addToCart = async (req, res) => {
    const { userId, categoryId, productId } = req.params;
    try {
        const product = await Product.findById(productId);  
        if (!product) return res.status(404).json({ error: 'Product not found' });
        console.log(product);

        const category = await Category.findById(categoryId);  
        if (!category) return res.status(404).json({ error: 'Category not found' });

        let cart = await CartProduct.findOne({ userId });  
        if (!cart) {
            cart = new CartProduct({ userId, products: [] });  
        }

        const existingProduct = cart.products.find(p => p.productId.toString() === productId);
        if (existingProduct) {
            return res.status(400).json({ error: 'Product already in cart' });
        }

   
        cart.products.push({
            productId,
            categoryId,
            name: product.name,
            price: product.offer_price,  
            gst: category.gst_percentage,  
            quantity: 1,
            images:product.images
        });

    
        let totalAmountBeforeGst = 0;
        let totalGstAmount = 0;
        let totalAmountAfterGst = 0;

        cart.products.forEach(product => {
            
            totalAmountBeforeGst += product.price * product.quantity;
            
           
            totalGstAmount += (product.price * product.quantity * product.gst) / 100;

            
            totalAmountAfterGst += (product.price * product.quantity) + ((product.price * product.quantity * product.gst) / 100);
        });

        
        cart.totalAmountBeforeGst = totalAmountBeforeGst;
        cart.totalGstAmount = totalGstAmount;
        cart.totalAmountAfterGst = totalAmountAfterGst;

        await cart.save();
        res.status(201).json({
            cart_id: cart._id,
            userId: cart.userId,
            products: cart.products,
            totalAmountBeforeGst: cart.totalAmountBeforeGst,
            totalGstAmount: cart.totalGstAmount,
            totalAmountAfterGst: cart.totalAmountAfterGst
        }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateQuantity = async (req, res) => {
    const {userId, productId, categoryId} = req.params;
    const { action } = req.body;
    try {
        let cart = await CartProduct.findOne({ userId });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const product = cart.products.find(p => p.productId.toString() === productId);
        if (!product) return res.status(404).json({ error: 'Product not found in cart' });

       
        if (action === 'increase') product.quantity += 1;
        if (action === 'decrease' && product.quantity > 1) product.quantity -= 1;

        
        let totalAmountBeforeGst = 0;

        cart.products.forEach(p => {
            totalAmountBeforeGst += p.price * p.quantity; 
        });

        
        let totalAmountAfterGst = totalAmountBeforeGst + cart.totalGstAmount; 

        
        cart.totalAmountBeforeGst = totalAmountBeforeGst;
        cart.totalAmountAfterGst = totalAmountAfterGst;
        cart.totalGstAmount = totalAmountAfterGst - totalAmountBeforeGst;

        
        await cart.save();
        res.status(201).json({
            cart_id: cart._id,
            userId: cart.userId,
            products: cart.products,
            totalAmountBeforeGst: cart.totalAmountBeforeGst,
            totalGstAmount: cart.totalGstAmount,
            totalAmountAfterGst: cart.totalAmountAfterGst
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.removeProduct = async (req, res) => { 
    const { userId, productId } = req.params;
    try {
        let cart = await CartProduct.findOne({ userId });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

       
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex === -1) return res.status(404).json({ error: 'Product not found in cart' });

        
        cart.products.splice(productIndex, 1);

        if (cart.products.length === 0) {
            
            await CartProduct.deleteOne({ userId });
            return res.status(200).json({ message: 'Cart is empty and has been deleted' });
        }

        
        let totalAmountBeforeGst = 0;
        let totalGstAmount = 0;

        cart.products.forEach(p => {
            totalAmountBeforeGst += p.price * p.quantity;
            totalGstAmount += (p.price * p.quantity * p.gst) / 100;
        });

        let totalAmountAfterGst = totalAmountBeforeGst + totalGstAmount;

       
        cart.totalAmountBeforeGst = totalAmountBeforeGst;
        cart.totalAmountAfterGst = totalAmountAfterGst;
        cart.totalGstAmount = totalGstAmount;

        
        await cart.save();
        res.status(201).json({
            cart_id: cart._id,
            userId: cart.userId,
            products: cart.products,
            totalAmountBeforeGst: cart.totalAmountBeforeGst,
            totalGstAmount: cart.totalGstAmount,
            totalAmountAfterGst: cart.totalAmountAfterGst
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getCartDetails = async (req, res) => {
    const { userId } = req.params;
    try {

        const cart = await CartProduct.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }


        res.status(200).json({
            cart_id: cart._id,
            userId: cart.userId,
            products: cart.products,
            totalAmountBeforeGst: cart.totalAmountBeforeGst,
            totalGstAmount: cart.totalGstAmount,
            totalAmountAfterGst: cart.totalAmountAfterGst
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
