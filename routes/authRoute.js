const express = require('express');
const {createUser, loginUserCtrl, getallUser, getaUser,forgotPasswordToken, deleteaUser, updateaUser, blockUser, unblock, handleRefreshToken, handleLogout, updatePassword, resetPassword, loginAdmin, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus} = require('../controller/userController');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/login",loginUserCtrl);
router.post("/admin-login",loginAdmin);
router.post("/cart/applycoupon",authMiddleware,applyCoupon);
router.post("/cart/cash-order",authMiddleware,createOrder);


router.post("/cart",authMiddleware,userCart);
router.get('/cart',authMiddleware,getUserCart);
router.get('/get-order',authMiddleware,getOrders);

router.delete('/empty-cart',authMiddleware,emptyCart);


router.post("/register",createUser);
router.put('/edit-user',authMiddleware,isAdmin,updateaUser);
router.put('/save-address',authMiddleware,saveAddress);
router.put('/update-order/:id',authMiddleware,isAdmin,updateOrderStatus);

router.get('/all-users',getallUser);

router.get('/refresh',handleRefreshToken);
router.get('/logout',handleLogout);
router.put('/update-password',authMiddleware,updatePassword);
router.post('/forgot-password-token',forgotPasswordToken);
router.post('/reset-password/:token',resetPassword)
router.get('/:id',authMiddleware,isAdmin,getaUser);
router.delete('/:id',deleteaUser);
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblock);


module.exports = router;