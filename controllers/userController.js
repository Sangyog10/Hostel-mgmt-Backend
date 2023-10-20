const User = require("../models/userModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createToken, sendCookieToResponse } = require("../utils");

const register = async (req, res) => {
  const { email } = req.body;

  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new CustomError.BadRequestError("Please register with new email");
  }
  const user = await User.create(req.body);
  const userToken = createToken(user);
  sendCookieToResponse({ res, user: userToken });
  res.status(StatusCodes.CREATED).json({ msg: "User registered !!" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Enter both Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("User not found");
  }
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new CustomError.UnauthenticatedError("Enter correct password");
  }
  const userToken = createToken(user);
  sendCookieToResponse({ res, user: userToken });
  res.status(StatusCodes.OK).json({
    name: user.name,
    userId: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
};

module.exports = { register, login };
