const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbid");
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs');

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: true,
      newBlog: newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({
      status: true,
      updateBlog: updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    // const getBlog = await Blog.findById(id);
    // $inc là một toán tử cập nhật của MongoDB, cho phép bạn tăng giá trị của một trường trong tài liệu.
    // Trong trường hợp này, numViews là trường bạn muốn tăng lên 1 mỗi khi cập nhật.
    const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );

    res.json({
      status: true,
      getBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json({ getBlogs });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBlog = await Blog.findOneAndDelete({ _id: id });
    res.json({ deleteBlog });
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  // Find the blog which yout want to be liked
  const blog = await Blog.findById(blogId);
  // Find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isLiked = blog?.isLiked;
  console.log("blog dislike: ",blog?.dislikes);
  // find if the user has disliked the blog
  // Đoạn mã này sử dụng JavaScript Array method find() để tìm một phần tử trong mảng disLiked của đối tượng blog mà có userId trùng với loginUserId.
  // đoạn mã này kiểm tra xem loginUserId có tồn tại trong mảng disLiked của blog không và trả về phần tử đó nếu có, nếu không trả về undefined.
  const alreadyDisliked = blog?.dislikes?.find((userId=>userId?.toString()=== loginUserId?.toString()))

  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(blogId, {
      // { $pull: { likes: loginUserId }, isLiked: true }: Đây là phần cập nhật của truy vấn.
      //  Trong trường hợp này, $pull là một toán tử cập nhật của MongoDB, cho phép bạn loại bỏ 
      // các giá trị khỏi một mảng. Ở đây, chúng ta đang loại bỏ loginUserId khỏi mảng likes
      $pull: { dislikes: loginUserId },
      isDisliked: false,
    },{new:true});
 
  }
  if(isLiked){
    const blog = await Blog.findByIdAndUpdate(blogId, {
      $pull: { likes: loginUserId },
      isLiked: false,
    },{new:true});
    return res.json({blog})
  }else{
    const blog = await Blog.findByIdAndUpdate(blogId, {
      $push: { likes: loginUserId },
      isLiked: true,
    },{new:true});
    return res.json({blog})
  }
});

const disliketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  // Find the blog which yout want to be liked
  const blog = await Blog.findById(blogId);
  // Find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isDisliked = blog?.isDisliked;
  console.log(blog?.likes);
  // find if the user has disliked the blog
  // Đoạn mã này sử dụng JavaScript Array method find() để tìm một phần tử trong mảng disLiked của đối tượng blog mà có userId trùng với loginUserId.
  // đoạn mã này kiểm tra xem loginUserId có tồn tại trong mảng disLiked của blog không và trả về phần tử đó nếu có, nếu không trả về undefined.
  const alreadyLiked = blog?.likes?.find((userId=>userId?.toString()=== loginUserId?.toString()))

  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(blogId, {
      // { $pull: { likes: loginUserId }, isLiked: true }: Đây là phần cập nhật của truy vấn.
      //  Trong trường hợp này, $pull là một toán tử cập nhật của MongoDB, cho phép bạn loại bỏ 
      // các giá trị khỏi một mảng. Ở đây, chúng ta đang loại bỏ loginUserId khỏi mảng likes
      $pull: { likes: loginUserId },
      isLiked: false,
    },{new:true});
   
  }
  if(isDisliked){
    const blog = await Blog.findByIdAndUpdate(blogId, {
      $pull: { dislikes: loginUserId },
      isDisliked: false,
    },{new:true});
    return res.json({blog})
  }else{
    const blog = await Blog.findByIdAndUpdate(blogId, {
      $push: { dislikes: loginUserId },
      isDisliked: true,
    },{new:true});
    return res.json({blog})
  }
});

const uploadImages = asyncHandler(async (req, res) => {

  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = async (path) =>cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    console.log(files);
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);;
      urls.push(newpath);
      fs.unlinkSync(path);

    }
    const findBlog = await Blog.findByIdAndUpdate(id, {
      images: urls.map(
        (file) => {
          return file;
        },
        { new: true }
      ),
    });

    return res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  disliketheBlog,
  uploadImages
};
