const express = require("express");
const {
  createColor,
  updateColor,
  getColor,
  getallColor,
  deleteColor,
} = require("../controller/colorController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getallColor);
router.post("/create-Color", authMiddleware, isAdmin, createColor);
router.get("/:id", authMiddleware, isAdmin, getColor);
router.put("/:id", authMiddleware, isAdmin, updateColor);
router.delete("/:id", authMiddleware, isAdmin, deleteColor);

module.exports = router;
