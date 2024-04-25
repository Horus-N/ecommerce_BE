const express = require('express');
const { createCategory, updateCategory, getCategory, getallCategory } = require('../controller/prodcategoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/',getallCategory)
router.post('/create-category',authMiddleware,isAdmin,createCategory)
router.get('/:id',authMiddleware,isAdmin,getCategory)
router.put('/:id',authMiddleware,isAdmin,updateCategory)
router.delete('/:id',authMiddleware,isAdmin,updateCategory)


module.exports = router;