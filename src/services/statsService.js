const Reservation = require("../models/Reservation");

// Headline KPIs for the dashboard: reservation totals + month-over-month growth,
// total guests booked.
const getSummary = async () => {
  const now = new Date();
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalReservations,
    statusAgg,
    guestsAgg,
    reservationsThisMonth,
    reservationsLastMonth,
    guestsThisMonthAgg,
  ] = await Promise.all([
    Reservation.countDocuments(),
    Reservation.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Reservation.aggregate([{ $group: { _id: null, guests: { $sum: "$partySize" } } }]),
    Reservation.countDocuments({ createdAt: { $gte: startThisMonth } }),
    Reservation.countDocuments({ createdAt: { $gte: startLastMonth, $lt: startThisMonth } }),
    Reservation.aggregate([
      { $match: { createdAt: { $gte: startThisMonth } } },
      { $group: { _id: null, guests: { $sum: "$partySize" } } },
    ]),
  ]);

  const byStatus = { pending: 0, confirmed: 0, cancelled: 0 };
  statusAgg.forEach((s) => {
    if (s._id in byStatus) {byStatus[s._id] = s.count;}
  });

  const growthPct =
    reservationsLastMonth === 0
      ? reservationsThisMonth > 0
        ? 100
        : 0
      : Math.round(
          ((reservationsThisMonth - reservationsLastMonth) / reservationsLastMonth) * 100
        );

  return {
    reservations: {
      total: totalReservations,
      thisMonth: reservationsThisMonth,
      lastMonth: reservationsLastMonth,
      growthPct,
      byStatus,
    },
    customers: {
      total: guestsAgg[0]?.guests || 0,
      thisMonth: guestsThisMonthAgg[0]?.guests || 0,
    },
  };
};

// Monthly time-series for the last `months` months (default 6), zero-filled.
const getTrends = async (months = 6) => {
  const n = Math.min(24, Math.max(1, Number(months) || 6));
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (n - 1), 1);

  const [resAgg] = await Promise.all([
    Reservation.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          bookings: { $sum: 1 },
          guests: { $sum: "$partySize" },
        },
      },
    ]),
  ]);

  const resMap = new Map(resAgg.map((r) => [`${r._id.y}-${r._id.m}`, r]));

  const series = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1) + i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const res = resMap.get(key);
    series.push({
      month: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear(),
      bookings: res?.bookings || 0,
      guests: res?.guests || 0,
    });
  }

  return series;
};

module.exports = { getSummary, getTrends };
