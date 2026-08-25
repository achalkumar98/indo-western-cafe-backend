const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const logger = require("../utils/logger");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Google Places reviews proxy
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get Google Places reviews for the restaurant (public)
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Array of Google reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       author_name: { type: string }
 *                       rating: { type: integer }
 *                       text: { type: string }
 *                       time: { type: integer }
 *                       profile_photo_url: { type: string }
 *                 cached: { type: boolean }
 *       503: { description: Google Places API not configured }
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!placeId || !apiKey) {
      logger.warn("Google Places not configured — GOOGLE_PLACE_ID or GOOGLE_MAPS_API_KEY missing");
      return res.status(503).json({
        success: false,
        message: "Google reviews not configured. Set GOOGLE_PLACE_ID and GOOGLE_MAPS_API_KEY.",
      });
    }

    // Use Node's built-in fetch (Node 18+) or fall back to https
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=reviews,rating,user_ratings_total` +
      `&reviews_sort=newest` +
      `&key=${apiKey}`;

    let googleData;
    try {
      const response = await fetch(url);
      googleData = await response.json();
    } catch (fetchErr) {
      logger.error(`Google Places fetch failed: ${fetchErr.message}`);
      return res.status(502).json({ success: false, message: "Failed to fetch reviews from Google" });
    }

    if (googleData.status !== "OK") {
      logger.error(`Google Places API error: ${googleData.status} — ${googleData.error_message}`);
      return res.status(502).json({
        success: false,
        message: `Google Places error: ${googleData.status}`,
      });
    }

    const reviews = (googleData.result?.reviews || []).map((r) => ({
      author_name: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.time,
      profile_photo_url: r.profile_photo_url || null,
      relative_time_description: r.relative_time_description || null,
    }));

    res.json({
      success: true,
      count: reviews.length,
      rating: googleData.result?.rating,
      total: googleData.result?.user_ratings_total,
      data: reviews,
    });
  })
);

module.exports = router;
