const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const User = require("../models/User");

const SALT_ROUNDS = 10;

const signToken = ({ username, role = "admin", name }) => {
  const token = jwt.sign({ username, role, name }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  return { token, user: { username, role, name } };
};

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Registers a new admin. Guarded by a shared signup code.
 */
const register = async ({ name, username, password, signupCode }) => {
  if (signupCode !== config.admin.signupCode) {
    throw httpError("Invalid signup code", 403);
  }

  const exists = await User.findOne({ username });
  if (exists) {throw httpError("That username is already taken", 409);}

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name: name || undefined, username, passwordHash });

  return signToken({ username: user.username, role: user.role, name: user.name });
};

/**
 * Authenticates an admin. DB users take precedence over .env fallback.
 */
const login = async ({ username, password }) => {
  const user = await User.findOne({ username }).select("+passwordHash");
  if (user) {
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {throw httpError("Invalid username or password", 401);}
    return signToken({ username: user.username, role: user.role, name: user.name });
  }

  if (username === config.admin.username && password === config.admin.password) {
    return signToken({ username, role: "admin" });
  }

  throw httpError("Invalid username or password", 401);
};

module.exports = { register, login, signToken };
