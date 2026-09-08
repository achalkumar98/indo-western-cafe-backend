const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const listAdmins = () => User.find().sort({ createdAt: -1 }).select('-passwordHash');

const removeAdmin = async (id, callerUsername) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'Admin user not found');
  }
  if (user.username === callerUsername) {
    throw new ApiError(403, 'You cannot delete your own account');
  }
  await user.deleteOne();
  return user;
};

module.exports = { listAdmins, removeAdmin };
