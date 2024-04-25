const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const slugify = require("slugify");
const { validateMongoDbId } = require("../utils/validateMongodbid");
const {cloudinaryUploadImg,cloudinaryDeleteImg} = require("../utils/cloudinary");
const fs = require('fs');
const createProduct = asyncHandler(async (req, res) => {
  const slug = req.body.slug;
  const findOne = await Product.findOne({ slug: slug });
  if (findOne) {
    throw new Error("Slug Already Exist");
  } else {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const newProduct = await Product.create(req.body);
      res.json({
        message: "success!",
        newProduct: newProduct,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deleteProduct = await Product.findOneAndDelete({ _id: id });
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const findProduct = await Product.findOne({ _id: id });
    res.json({ findProduct });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // lay all query params

    // filtering
    const queryObj = { ...req.query };
    const excludeFields = ["pages", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);

    // '$gte' là một phép toán so sánh trong MongoDB, chỉ định rằng giá sản phẩm phải lớn hơn hoặc bằng giá trị được cung cấp (trong trường hợp này là n).
    // '$gt' là một phép toán so sánh trong MongoDB, chỉ định rằng giá sản phẩm phải lớn hơn gia tri duoc cung cấp (trong trường hợp này là n).
    // '$lte' là một phép toán so sánh trong MongoDB, chỉ định rằng giá sản phẩm phải nho hơn hoặc bằng giá trị được cung cấp (trong trường hợp này là n).
    // '$lt' là một phép toán so sánh trong MongoDB, chỉ định rằng giá sản phẩm phải lớn hơn giá trị được cung cấp (trong trường hợp này là n).

    // tìm va thay the chuoi trong params thành $... ứng với phép toán so sánh trong MOongoDb
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      return `$${match}`;
    });

    // tim all nhung product co gia tu pram tro len
    let query = Product.find(JSON.parse(queryString));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      // sắp xếp trước theo trường category, và nếu có các giá trị giống nhau trong trường category, thì sẽ sắp xếp tiếp theo theo trường brand.
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      // select lấy các trường chỉ định trong fields ('name email')
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    query = await Product.find({}).skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page does not exists!");
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { prodId } = req.body;

  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );

      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );

      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getWishlist = asyncHandler(async(req,res)=>{
  const {_id}=req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser)
  } catch (error) {
    throw new Error(error);
    
  }
})


const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );

      //  return res.json({updateRating:updateRating});
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );

      // res.json(rateProduct);
    }

    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, current) => prev + current, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    console.log(ratingsum, totalRating, actualRating);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );

    res.json({
      finalProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = async (path) =>cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);;
      urls.push(newpath);
      fs.unlinkSync(path);
    }

    const images = urls.map(
      (file) => {
        return file;
      });
    return res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});


const deleteImages = asyncHandler(async (req, res) => {
  const {id} = req.params;
  try {
    const deleteImage =  cloudinaryDeleteImg(id, "images");
    res.json({message:"deleted",deleteImage})
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  getWishlist,
  deleteImages
};
