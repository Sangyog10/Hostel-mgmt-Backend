const User = require("../models/userModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createToken, sendCookieToResponse } = require("../utils");

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const numberAlreadyExist = await User.findOne({ phone });
  if (numberAlreadyExist) {
    throw new CustomError.BadRequestError("Please register with new number");
  }
  const user = await User.create(req.body);
  const userToken = createToken(user);
  sendCookieToResponse({ res, user: userToken });
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    throw new CustomError.BadRequestError("Enter both Email and Password");
  }
  const user = await User.findOne({ phone });
  if (!user) {
    throw new CustomError.BadRequestError("User not found");
  }
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new CustomError.UnauthenticatedError("Enter correct password");
  }
  const userToken = createToken(user);
  sendCookieToResponse({ res, user: userToken });
  res.status(StatusCodes.OK).json({ user });
};

module.exports = { register, login };
