const express = require('express');
const router = express.Router();

const {createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disliketheBlog, uploadImages}  = require('../controller/blogController') ;
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImages');


router.post('/create-blog',authMiddleware,isAdmin,createBlog)
router.get('/',getAllBlogs);
router.put('/likes',authMiddleware,isAdmin,likeBlog)
router.put('/dislikes',authMiddleware,isAdmin,disliketheBlog)
router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    blogImgResize,uploadImages
  );
router.put('/update-blog/:id',authMiddleware,isAdmin,updateBlog)
router.get('/:id',getBlog);
router.delete('/:id',authMiddleware,isAdmin,deleteBlog);

module.exports = router;