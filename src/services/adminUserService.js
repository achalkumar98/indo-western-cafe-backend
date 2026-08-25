const User = require("../models/User");

const notFound = () => {
  const err = new Error("Admin user not found");
  err.statusCode = 404;
  return err;
};

const forbidden = (msg) => {
  const err = new Error(msg);
  err.statusCode = 403;
  return err;
};

// List all admins (never expose passwordHash).
const listAdmins = () => User.find().sort({ createdAt: -1 }).select("-passwordHash");

// Delete an admin — the calling admin cannot delete themselves.
const removeAdmin = async (id, callerUsername) => {
  const user = await User.findById(id);
  if (!user) {throw notFound();}
  if (user.username === callerUsername) {
    throw forbidden("You cannot delete your own account");
  }
  await user.deleteOne();
  return user;
};

module.exports = { listAdmins, removeAdmin };
