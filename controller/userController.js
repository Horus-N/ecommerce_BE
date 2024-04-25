const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const uniquid = require("uniquid");
const { generateeToken } = require("../config/jwtToken");
const { validateMongoDbId } = require("../utils/validateMongodbid");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailController");
const { generateRefreshToken } = require("../config/refreshtoken");

// create a suer
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const mobile = req.body.mobile;
  const passwordHash = bcrypt.hash(req.body.password, 10);
  const findUser = await User.findOne({ $or: [{ email }, { mobile }] });
  if (!findUser) {
    const newUser = User.create({ ...req.body, password: await passwordHash });
    return res.json({
      ismessage: "Register Success!",
      newUser: newUser,
    });
  } else {
    throw new Error("Email or mobile already exists!");
  }
});

// login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  if (!email || !password) {
    throw new Error("Please enter email or password ! ");
  }

  const findUser = await User.findOne({ email });
  if (findUser) {
    const decode = await bcrypt.compare(password, findUser.password);
    if (decode) {
      const refreshToken = await generateRefreshToken(findUser?.id);
      findUser.refreshToken = refreshToken;
      await findUser.save();
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      return res.json({
        _id: findUser._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateeToken(findUser?._id),
      });
    } else {
      throw new Error("Incorrect Password !");
    }
  } else {
    throw new Error("Account or password is incorrect!");
  }
});
// admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  if (!email || !password) {
    throw new Error("Please enter email or password ! ");
  }
  const findAdmin = await User.findOne({ email });

  if (findAdmin.role !== "Admin") throw new Error("Not Authorised");
  if (findAdmin) {
    const decode = await bcrypt.compare(password, findAdmin.password);
    if (decode) {
      const refreshToken = await generateRefreshToken(findAdmin?.id);
      findAdmin.refreshToken = refreshToken;
      console.log(await findAdmin.save());
      await findAdmin.save();

      res.json(findAdmin);
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   maxAge: 72 * 60 * 60 * 1000,
      // });
      return res.json({
        hello: "hi",
        // _id: findAdmin._id,
        // firstname: findAdmin?.firstname,
        // lastname: findAdmin?.lastname,
        // email: findAdmin?.email,
        // mobile: findAdmin?.mobile,
        // token: generateeToken(findAdmin?._id),
      });
    } else {
      throw new Error("Incorrect Password !");
    }
  } else {
    throw new Error("Account or password is incorrect!");
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) {
    throw new Error("No Refresh Token in Cookies");
  } else {
    const refreshToken = cookie.refreshToken;
    const findUser = await User.findOne({ refreshToken });
    if (!findUser)
      throw new Error("No Refresh token present in db or not matched");

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
      if (err || findUser.id !== decode.id) {
        throw new Error("There is something wrong with refresh token");
      } else {
        const accessToken = generateeToken(findUser?.id);
        res.json({ accessToken });
      }
    });
  }
});

// logout function

const handleLogout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No Refresh Token in Cookies");
  } else {
    const refreshToken = cookie.refreshToken;
    const findUser = await User.findOne({ refreshToken });
    if (findUser) {
      findUser.refreshToken = "";
      await findUser.save();
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.status(200).json({
        message: "logout success",
      });
    } else {
      throw new Error("There is something wrong with refresh token");
    }
  }
});
// Update a user

const updateaUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  validateMongoDbId();
  try {
    const findaUser = await User.findOne({ _id: id });
    if (findaUser) {
      findaUser.firstname = req?.body?.firstname;
      findaUser.lastname = req?.body?.lastname;
      findaUser.email = req?.body?.email;
      findaUser.mobile = req?.body?.mobile;
      const updateUser = await findaUser.save();
      return res.json({
        ismessage: true,
        message: "update a user Success!",
        updateUser,
      });
    } else {
      return res.json({
        message: "User not found!",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// save user address

const saveAddress = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  console.log(id);
  validateMongoDbId(id);
  try {
    const updateProduct = await User.findByIdAndUpdate(
      id,
      { address: req?.body?.address },
      { new: true }
    );
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    return res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findOne({ _id: id });
    if (getaUser) {
      return res.json(getaUser);
    } else {
      return res.json({
        message: "user not found",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a single user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteaUser = await User.findByIdAndDelete({ _id: id });
    if (deleteaUser) {
      return res.json({
        ismessage: true,
        message: "Delete success!",
      });
    } else {
      return res.json({
        message: "user not found",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findUser = await User.findOne({ _id: id });
    console.log(findUser);
    if (findUser) {
      findUser.isBlocked = true;
      await findUser.save();
      res.json({
        message: "user Blocked",
        findUser,
      });
    } else {
      res.json("Id not found!");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const unblock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findOne({ _id: id });
    if (block) {
      block.isBlocked = false;
      await block.save();
      res.json({
        message: "user unBlocked",
        block,
      });
    } else {
      res.json("Id not found!");
    }
  } catch (error) {
    throw new Error(error);
  }
});

// update password

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    validateMongoDbId(_id);
    const user = await User.findOne({ _id });
    if (req.body.password) {
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      console.log(passwordHash);
      user.password = passwordHash;
      const updatePassword = user.save();
      console.log(updatePassword);
      res.json(user);
    } else {
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//forgot password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password.
     This link is valid till 10 minutes from now.
      <a href='http://localhost:4000/api/user/reset-password/${token}'>Click</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Fogot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  console.log(token);
  const hashedtoken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedtoken,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);
  if (!user) throw new Error(error);
  if (req.body.password) {
    const password = await bcrypt.hash(req.body.password, 10);
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  }

  throw new Error("token incorect or passwordResetExpires expired");
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    console.log(products, cartTotal);
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();

    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (!validCoupon) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let cartt = await Cart.findOne({
    orderby: user._id,
  });
  console.log(cartt);
  let { products, cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");

  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById({ _id });
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
    }

    let newOrder = await new Order({
      Product: userCart.products,
      paymentIntent: {
        id: uniquid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userOrders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(findOrder)
  } catch (error) {
    throw new Error(error);
    
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  updateaUser,
  getallUser,
  getaUser,
  deleteaUser,
  blockUser,
  unblock,
  handleRefreshToken,
  handleLogout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
