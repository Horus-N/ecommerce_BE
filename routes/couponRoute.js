const express = require('express');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require('../controller/couponController');
const router = express.Router();

router.post('/create-coupon',createCoupon);
router.get('/',getAllCoupons);
router.put('/:id',updateCoupon);
router.delete('/:id',deleteCoupon);




module.exports = router