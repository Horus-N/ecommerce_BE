const express = require('express');
const { createBrand, updateBrand, getBrand, getallBrand, deleteBrand } = require('../controller/brandController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/',getallBrand)
router.post('/create-Brand',authMiddleware,isAdmin,createBrand)
router.get('/:id',authMiddleware,isAdmin,getBrand)
router.put('/:id',authMiddleware,isAdmin,updateBrand)
router.delete('/:id',authMiddleware,isAdmin,deleteBrand)


module.exports = router;