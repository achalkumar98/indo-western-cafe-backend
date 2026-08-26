const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

// OpenAPI spec assembled from @swagger JSDoc blocks in the route files.
const spec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Indo Western Cafe API",
      version: "2.0.0",
      description:
        "Public reservations & Google reviews proxy plus admin authentication, menu management, banner management, settings, admin user management, and dashboard analytics for the Indo Western Cafe & Restaurant site.",
    },
    servers: [{ url: "/api", description: "API root" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        Reservation: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            partySize: { type: "integer", example: 4 },
            date: { type: "string", example: "2026-08-30" },
            time: { type: "string", example: "19:30" },
            occasion: { type: "string" },
            notes: { type: "string" },
            status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        MenuItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            category: { type: "string", example: "Starters" },
            name: { type: "string", example: "Chicken Chilli" },
            price: { type: "number", example: 220 },
            isVeg: { type: "boolean", example: false },
            signature: { type: "boolean", example: true },
            available: { type: "boolean", example: true },
            sortOrder: { type: "integer", example: 0 },
            imageUrl: {
              type: "string",
              example: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Banner: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string", example: "Indo Western" },
            subtitle: { type: "string", example: "Cafe & Restaurant" },
            tagline: { type: "string", example: "Where Indian spice meets Western comfort" },
            imageUrl: { type: "string", example: "https://images.unsplash.com/..." },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Settings: {
          type: "object",
          properties: {
            _id: { type: "string" },
            phone: { type: "string", example: "092637 50882" },
            address: { type: "string" },
            closesAt: { type: "string", example: "10:00 PM" },
            isOpenNow: { type: "boolean" },
            priceRange: { type: "string", example: "₹200–400" },
            instagramUrl: { type: "string" },
            instagramHandle: { type: "string" },
            directionsUrl: { type: "string" },
            highlights: { type: "array", items: { type: "string" } },
            rating: { type: "number", example: 4.4 },
            reviewCount: { type: "integer", example: 487 },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string", example: "priya" },
            name: { type: "string", example: "Priya Sharma" },
            role: { type: "string", enum: ["admin"], example: "admin" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  // Forward slashes required — swagger-jsdoc's glob fails on Windows backslashes.
  apis: [path.join(__dirname, "../routes/*.js").replace(/\\/g, "/")],
});

module.exports = spec;
