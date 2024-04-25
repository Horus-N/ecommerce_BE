const expess = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  getWishlist,
  deleteImages,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {uploadPhoto,productImgResize}=require('../middlewares/uploadImages')
const router = expess.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.get("/wishlist", authMiddleware, getWishlist);

router.put("/rating", authMiddleware, rating);
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,uploadImages
);

router.get("/all-products", getAllProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

router.get("/:id", getaProduct);

module.exports = router;
