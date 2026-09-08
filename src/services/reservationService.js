const ApiError = require('../utils/ApiError');
const { Reservation } = require('../models');

const create = (payload) => Reservation.create(payload);

const list = async ({ status, search, page = 1, limit = 20, sort = '-createdAt' } = {}) => {
  const query = {};
  if (status && status !== 'all') {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { customerMobileNumber: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(limit) || 20));

  const [data, total] = await Promise.all([
    Reservation.find(query)
      .sort(sort)
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
    Reservation.countDocuments(query),
  ]);

  return { data, total, page: pageNum, limit: perPage, pages: Math.ceil(total / perPage) || 1 };
};

const updateStatus = async (id, status) => {
  const reservation = await Reservation.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!reservation) {
    throw new ApiError(404, 'Reservation not found');
  }
  return reservation;
};

const remove = async (id) => {
  const reservation = await Reservation.findByIdAndDelete(id);
  if (!reservation) {
    throw new ApiError(404, 'Reservation not found');
  }
  return reservation;
};

module.exports = { create, list, updateStatus, remove };
