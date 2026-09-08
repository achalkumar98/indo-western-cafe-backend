const express = require('express');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const logger = require('../../config/logger');
const config = require('../../config/config');

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const { placeId, mapsApiKey } = config.google;

    if (!placeId || !mapsApiKey) {
      logger.warn('Google Places not configured — GOOGLE_PLACE_ID or GOOGLE_MAPS_API_KEY missing');
      throw new ApiError(503, 'Google reviews not configured. Set GOOGLE_PLACE_ID and GOOGLE_MAPS_API_KEY.');
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=reviews,rating,user_ratings_total` +
      `&reviews_sort=newest` +
      `&key=${mapsApiKey}`;

    let googleData;
    try {
      const response = await fetch(url);
      googleData = await response.json();
    } catch (fetchErr) {
      logger.error(`Google Places fetch failed: ${fetchErr.message}`);
      throw new ApiError(502, 'Failed to fetch reviews from Google');
    }

    if (googleData.status !== 'OK') {
      logger.error(`Google Places API error: ${googleData.status} — ${googleData.error_message}`);
      throw new ApiError(502, `Google Places error: ${googleData.status}`);
    }

    const reviews = (googleData.result?.reviews || []).map((r) => ({
      author_name: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.time,
      profile_photo_url: r.profile_photo_url || null,
      relative_time_description: r.relative_time_description || null,
    }));

    res.status(200).json({
      success: true,
      count: reviews.length,
      rating: googleData.result?.rating,
      total: googleData.result?.user_ratings_total,
      data: reviews,
    });
  })
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Google Places reviews proxy
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get Google Places reviews for the restaurant (public)
 *     tags: [Reviews]
 *     responses:
 *       "200":
 *         description: Array of Google reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 rating:
 *                   type: number
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       author_name:
 *                         type: string
 *                       rating:
 *                         type: integer
 *                       text:
 *                         type: string
 *                       time:
 *                         type: integer
 *                       profile_photo_url:
 *                         type: string
 *                       relative_time_description:
 *                         type: string
 *       "503":
 *         description: Google Places API not configured
 */
