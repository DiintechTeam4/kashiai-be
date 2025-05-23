const CartPooja  = require('../models/CartPooja');
const { Pooja } = require('../models/Pooja'); 


async function addPoojaToCart(req, res) {
  try {
    const { user_id, pooja_id } = req.params;
    const { package_id } = req.body;

    const pooja = await Pooja.findById(pooja_id);
    if (!pooja) return res.status(404).json({ message: 'Pooja not found' });

    const packageDetails = pooja.packages.find(pkg => pkg.packageId === package_id);
    if (!packageDetails) return res.status(404).json({ message: 'Package not found' });

    const package_price = packageDetails.online_price || packageDetails.offline_price;
    if (!package_price) return res.status(400).json({ message: 'No price available for this package' });

    const gst_percentage = pooja.gst_percentage;
    const pooja_name = pooja.name;
    const date = pooja.date;
    const place = pooja.location;
    const package_name = packageDetails.name;

    const total_amount_before_gst = Number(package_price);
    const gst_amount = (total_amount_before_gst * gst_percentage) / 100;
    const total_amount_after_gst = total_amount_before_gst + gst_amount;


    console.log(`Type of total_amount_before_gst:`, typeof total_amount_before_gst);

    console.log(`gst_amount:`, typeof gst_amount);
    console.log(`Type of total_amount_after_gst:`, typeof total_amount_after_gst);

    await CartPooja.deleteOne({ user_id });

    const newCartPooja = new CartPooja({
      user_id,
      pooja_id,
      package_id,
      package_price,
      gst_percentage,
      pooja_name,
      total_amount_before_gst,
      gst_amount,
      total_amount_after_gst,
      images: pooja.images,
      date,
      place,
      package_name
    });
    console.log(`newcartpooja${newCartPooja}`)
    await newCartPooja.save();
    return res.status(201).json({ message: 'Pooja added to cart', cart: newCartPooja });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
  

async function addAddonToCart(req, res) {
    try {
      const { user_id, pooja_id } = req.params;
      const { addon_id } = req.body;

      const pooja = await Pooja.findById(pooja_id);
      if (!pooja) return res.status(404).json({ message: 'Pooja not found' });
 
      const addon = pooja.addons.find(a => a._id.toString() === addon_id);
      if (!addon) return res.status(404).json({ message: 'Addon not found for this pooja' });

      const cart = await CartPooja.findOne({ user_id, pooja_id });
      if (!cart) return res.status(404).json({ message: 'Cart entry not found for this pooja' });


      const addonExists = cart.addons.some(item => item.addon_id.equals(addon_id));
      if (addonExists) {
        return res.status(400).json({ message: 'Addon already added to the cart' });
      }
  

      cart.addons.push({
        addon_id: addon._id,
        name: addon.name,
        price: addon.price,
        addon_image: addon.image
      });
  

      cart.total_amount_before_gst += addon.price;
  

      cart.total_amount_after_gst = cart.total_amount_before_gst + cart.gst_amount;

      console.log(`Type of total_amount_before_gst:`, typeof cart.total_amount_before_gst);

    console.log(`addon price:`, typeof addon.price);
    console.log(`Type of total_amount_after_gst:`, typeof cart.total_amount_after_gst);
      await cart.save();
      return res.status(200).json({ message: 'Addon added to cart', cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  

async function removeAddonFromCart(req, res) {
    try {
      const { user_id, pooja_id } = req.params;
      const { addon_id } = req.body;
  
      
      const cart = await CartPooja.findOne({ user_id, pooja_id });
      if (!cart) return res.status(404).json({ message: 'Cart entry not found for this pooja' });
  
      
      const addonIndex = cart.addons.findIndex(item => item.addon_id.equals(addon_id));
      if (addonIndex === -1) {
        return res.status(404).json({ message: 'Addon not found in the cart' });
      }
  
     
      const addonPrice = cart.addons[addonIndex].price;
  
      
      cart.addons.splice(addonIndex, 1);
  
      
      cart.total_amount_before_gst -= addonPrice;
  
      
      cart.gst_amount = (cart.total_amount_before_gst * cart.gst_percentage) / 100;
      cart.total_amount_after_gst = cart.total_amount_before_gst + cart.gst_amount;
  
      await cart.save();
      return res.status(200).json({ message: 'Addon removed from cart', cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

async function getCartDetails(req, res) {
  try {
    const { user_id } = req.params;

    
    const cart = await CartPooja.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty or not found' });
    }
    const { _id, ...cartWithoutId } = cart.toObject(); 

    const response = {
        cart_id: _id, 
        cart: cartWithoutId 
    };
        return res.status(200).json(response);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { addPoojaToCart, addAddonToCart, removeAddonFromCart, getCartDetails };


