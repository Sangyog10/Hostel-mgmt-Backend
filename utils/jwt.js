const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.SECRET_KEY);

const time = 30 * 24 * 60 * 60;
const sendCookieToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + time),
    signed: true,
  });
};

module.exports = { createJWT, isTokenValid, sendCookieToResponse };
