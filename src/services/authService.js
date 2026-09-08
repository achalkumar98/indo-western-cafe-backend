const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const SALT_ROUNDS = 10;

const signToken = ({ username, role = 'admin', name }) => {
  const token = jwt.sign({ username, role, name }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  return { token, user: { username, role, name } };
};

const register = async ({ name, username, password, signupCode }) => {
  if (signupCode !== config.admin.signupCode) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid signup code');
  }

  const exists = await User.findOne({ username });
  if (exists) {
    throw new ApiError(httpStatus.CONFLICT, 'That username is already taken');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name: name || undefined, username, passwordHash });

  return signToken({ username: user.username, role: user.role, name: user.name });
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ username }).select('+passwordHash');
  if (user) {
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid username or password');
    }
    return signToken({ username: user.username, role: user.role, name: user.name });
  }

  if (username === config.admin.username && password === config.admin.password) {
    return signToken({ username, role: 'admin' });
  }

  throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid username or password');
};

module.exports = { register, login, signToken };
