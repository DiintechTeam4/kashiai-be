const express = require('express');
const { 
    getPendingBookings, 
    getAllBookings, 
    updateBookingStatus, 
    filterBookingsByDate, 
    getCompletedBookings,getPoojaOrderCount,getPoojaUsers,getAllOrders,updateOrderStatus,getOrdersByDate
} = require('../controllers/adminUserController');

const router = express.Router();




//pooja admin controllers


router.get('/pending-bookings/:adminId', getPendingBookings);
router.get('/all-bookings/:adminId', getAllBookings);
router.put('/update-booking-status/:adminId', updateBookingStatus);
router.get('/bookings-by-date/:adminId', filterBookingsByDate);
router.get('/completed-bookings/:adminId', getCompletedBookings);
router.get('/pooja-order-count/:adminId', getPoojaOrderCount);
router.get('/pooja-order-users/:adminId/:poojaId', getPoojaUsers);


//product admin controllers

router.get('/product/orders/:adminId',getAllOrders );

router.put('/product/orders/update-status/:adminId',updateOrderStatus );

router.get('/product/orders/filter-by-date/:adminId',getOrdersByDate );


module.exports = router;
