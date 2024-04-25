const express = require('express');
const router = express.Router();
const { createCategory, updateCategory, getCategory, getallCategory,deleteCategory } = require('../controller/blogCatController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/',getallCategory)
router.post('/create-category',authMiddleware,isAdmin,createCategory)
router.get('/:id',authMiddleware,isAdmin,getCategory)
router.put('/:id',authMiddleware,isAdmin,updateCategory)
router.delete('/:id',authMiddleware,isAdmin,deleteCategory)

module.exports = router;