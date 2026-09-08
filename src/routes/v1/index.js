const express = require('express');
const authRoute = require('./auth.route');
const reservationRoute = require('./reservation.route');
const menuRoute = require('./menu.route');
const bannerRoute = require('./banner.route');
const settingsRoute = require('./settings.route');
const galleryRoute = require('./gallery.route');
const reviewsRoute = require('./reviews.route');
const statsRoute = require('./stats.route');
const adminUserRoute = require('./adminUser.route');

const router = express.Router();

const routes = [
  { path: '/auth', route: authRoute },
  { path: '/reservations', route: reservationRoute },
  { path: '/menu', route: menuRoute },
  { path: '/banners', route: bannerRoute },
  { path: '/settings', route: settingsRoute },
  { path: '/gallery', route: galleryRoute },
  { path: '/reviews', route: reviewsRoute },
  { path: '/admin/stats', route: statsRoute },
  { path: '/admin/users', route: adminUserRoute },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
