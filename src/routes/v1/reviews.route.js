const express = require('express');
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const logger = require('../../config/logger');
const config = require('../../config/config');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Google Places reviews proxy — returns live guest reviews from your Google Business listing
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get live Google Places reviews for the restaurant (public)
 *     description: >
 *       Proxies the Google Places Details API to return the restaurant's
 *       most recent reviews. Requires `GOOGLE_PLACE_ID` and
 *       `GOOGLE_MAPS_API_KEY` to be set in the server `.env`.
 *
 *       Returns **503** if Google credentials are not configured, with a
 *       message explaining which env variables to set.
 *
 *       The frontend shows a clean empty state when this endpoint returns
 *       a non-200 — **no fake fallback reviews are ever displayed**.
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Array of Google reviews plus aggregate rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                   description: Number of reviews returned (Google Places returns up to 5)
 *                 rating:
 *                   type: number
 *                   example: 4.4
 *                   description: Overall Google rating for the place
 *                 total:
 *                   type: integer
 *                   example: 487
 *                   description: Total number of Google reviews on the listing
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GoogleReview'
 *       503:
 *         description: Google Places API not configured
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Google reviews not configured. Set GOOGLE_PLACE_ID and GOOGLE_MAPS_API_KEY."
 *       502:
 *         description: Failed to fetch from Google Places API
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    const { placeId, mapsApiKey } = config.google;

    if (!placeId || !mapsApiKey) {
      logger.warn('Google Places not configured — GOOGLE_PLACE_ID or GOOGLE_MAPS_API_KEY missing');
      throw new ApiError(
        httpStatus.SERVICE_UNAVAILABLE,
        'Google reviews not configured. Set GOOGLE_PLACE_ID and GOOGLE_MAPS_API_KEY.'
      );
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
      throw new ApiError(httpStatus.BAD_GATEWAY, 'Failed to fetch reviews from Google');
    }

    if (googleData.status !== 'OK') {
      logger.error(`Google Places API error: ${googleData.status} — ${googleData.error_message}`);
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        `Google Places error: ${googleData.status}`
      );
    }

    const reviews = (googleData.result?.reviews || []).map((r) => ({
      author_name: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.time,
      profile_photo_url: r.profile_photo_url || null,
      relative_time_description: r.relative_time_description || null,
    }));

    res.status(httpStatus.OK).json({
      success: true,
      count: reviews.length,
      rating: googleData.result?.rating,
      total: googleData.result?.user_ratings_total,
      data: reviews,
    });
  })
);

module.exports = router;
