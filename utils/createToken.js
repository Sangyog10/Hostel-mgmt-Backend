const createToken = (user) => {
  return { name: user.name, userId: user._id };
};

module.exports = { createToken };
