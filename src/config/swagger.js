const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

/**
 * OpenAPI 3.0 specification assembled from JSDoc blocks in src/routes/v1/*.
 *
 * Schema objects are defined here so every route file can reference them
 * cleanly via `$ref` without repeating field definitions.
 *
 * Reusable responses (Unauthorized, NotFound, ValidationError, TooManyRequests)
 * are also centralised here.
 */
const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Indo Western Cafe — REST API',
      version: '2.0.0',
      description: `
REST API for the **Indo Western Cafe & Restaurant** website (Pakari, Arrah, Bihar).

### Authentication
Admin endpoints require a JWT bearer token obtained via \`POST /auth/login\`.
Include it in the \`Authorization\` header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

### Rate Limiting
- **Public forms** (reservations): 20 requests / 15 min per IP
- **Auth endpoints** (login, register): 10 requests / 15 min per IP

### Base URL
All paths below are relative to \`/api\`.
      `,
      contact: {
        name: 'Indo Western Cafe Admin',
        url: 'https://www.instagram.com/indo__western_ara/',
      },
    },
    servers: [
      { url: '/api', description: 'Current server' },
      { url: 'http://localhost:5000/api', description: 'Local development' },
    ],

    // ─── Security schemes ───────────────────────────────────────────────────
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT obtained from POST /auth/login',
        },
      },

      // ─── Reusable response objects ───────────────────────────────────────
      responses: {
        Unauthorized: {
          description: 'Missing or invalid JWT token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                code: 401,
                message: 'Not authorized — admin sign-in required',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { success: false, code: 404, message: 'Not found' },
            },
          },
        },
        ValidationError: {
          description: 'Request body / params failed Joi validation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                code: 400,
                message: 'name is required, price must be a number',
              },
            },
          },
        },
        TooManyRequests: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Too many requests, please try again later.',
              },
            },
          },
        },
      },

      // ─── Reusable schema objects ─────────────────────────────────────────
      schemas: {
        // ── Generic ────────────────────────────────────────────────────────
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            code: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
          },
        },

        // ── Auth ───────────────────────────────────────────────────────────
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            token: {
              type: 'string',
              description: 'JWT — include as Bearer token in subsequent requests',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: { $ref: '#/components/schemas/AdminUser' },
          },
        },
        AdminUser: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            username: { type: 'string', example: 'achalkumar@gmail.com' },
            name: { type: 'string', example: 'Achal Kumar' },
            role: { type: 'string', enum: ['admin'], example: 'admin' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Reservation ────────────────────────────────────────────────────
        ReservationInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'customerMobileNumber', 'tableSize', 'date', 'time'],
          properties: {
            firstName: { type: 'string', example: 'Rahul', minLength: 2, maxLength: 40 },
            lastName: { type: 'string', example: 'Sharma', minLength: 1, maxLength: 40 },
            customerMobileNumber: {
              type: 'string',
              example: '9263750882',
              description: 'Valid 10-digit Indian mobile number (starts with 6-9)',
            },
            email: { type: 'string', format: 'email', example: 'rahul@example.com' },
            tableSize: {
              type: 'integer',
              minimum: 1,
              maximum: 30,
              example: 4,
              description: 'Number of guests',
            },
            date: {
              type: 'string',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$',
              example: '2026-10-15',
              description: 'Booking date in YYYY-MM-DD format',
            },
            time: {
              type: 'string',
              pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
              example: '19:30',
              description: 'Booking time in HH:mm (24-hour) format',
            },
            occasion: { type: 'string', example: 'Birthday', maxLength: 60 },
            notes: { type: 'string', example: 'Window seat preferred', maxLength: 300 },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            firstName: { type: 'string', example: 'Rahul' },
            lastName: { type: 'string', example: 'Sharma' },
            customerMobileNumber: { type: 'string', example: '9263750882' },
            email: { type: 'string', example: 'rahul@example.com' },
            tableSize: { type: 'integer', example: 4 },
            date: { type: 'string', example: '2026-10-15' },
            time: { type: 'string', example: '19:30' },
            occasion: { type: 'string', example: 'Birthday' },
            notes: { type: 'string', example: 'Window seat preferred' },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'cancelled'],
              example: 'pending',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PaginatedReservations: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { $ref: '#/components/schemas/Reservation' } },
            total: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            pages: { type: 'integer', example: 5 },
          },
        },

        // ── Menu ───────────────────────────────────────────────────────────
        MenuItemInput: {
          type: 'object',
          required: ['category', 'name', 'price', 'isVeg'],
          properties: {
            category: {
              type: 'string',
              enum: ['Beverages', 'Starters', 'Egg', 'Dal', 'Rice', 'Roti', 'Naan', 'Biryani', 'Mains', 'Salads', 'Desserts'],
              example: 'Biryani',
            },
            name: { type: 'string', example: 'Chicken Biryani', minLength: 2, maxLength: 100 },
            price: { type: 'number', minimum: 0, example: 250 },
            isVeg: { type: 'boolean', example: false },
            signature: { type: 'boolean', example: true },
            available: { type: 'boolean', example: true, default: true },
            sortOrder: { type: 'integer', minimum: 0, example: 3 },
            imageUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600',
            },
          },
        },
        MenuItemUpdateInput: {
          type: 'object',
          minProperties: 1,
          description: 'Partial update — supply only the fields to change',
          properties: {
            category: {
              type: 'string',
              enum: ['Beverages', 'Starters', 'Egg', 'Dal', 'Rice', 'Roti', 'Naan', 'Biryani', 'Mains', 'Salads', 'Desserts'],
            },
            name: { type: 'string', minLength: 2, maxLength: 100 },
            price: { type: 'number', minimum: 0 },
            isVeg: { type: 'boolean' },
            signature: { type: 'boolean' },
            available: { type: 'boolean' },
            sortOrder: { type: 'integer', minimum: 0 },
            imageUrl: { type: 'string', format: 'uri' },
          },
        },
        MenuItem: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            category: { type: 'string', example: 'Biryani' },
            name: { type: 'string', example: 'Chicken Biryani' },
            price: { type: 'number', example: 250 },
            isVeg: { type: 'boolean', example: false },
            signature: { type: 'boolean', example: true },
            available: { type: 'boolean', example: true },
            sortOrder: { type: 'integer', example: 3 },
            imageUrl: {
              type: 'string',
              example: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Banner ─────────────────────────────────────────────────────────
        BannerInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Indo Western', maxLength: 100 },
            subtitle: { type: 'string', example: 'Cafe & Restaurant', maxLength: 100 },
            tagline: {
              type: 'string',
              example: 'Where Indian spice meets Western comfort',
              maxLength: 200,
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600',
            },
            isActive: { type: 'boolean', example: true, default: false },
          },
        },
        BannerUpdateInput: {
          type: 'object',
          minProperties: 1,
          description: 'Partial update — supply only the fields to change',
          properties: {
            title: { type: 'string', maxLength: 100 },
            subtitle: { type: 'string', maxLength: 100 },
            tagline: { type: 'string', maxLength: 200 },
            imageUrl: { type: 'string', format: 'uri' },
            isActive: { type: 'boolean' },
          },
        },
        Banner: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            title: { type: 'string', example: 'Indo Western' },
            subtitle: { type: 'string', example: 'Cafe & Restaurant' },
            tagline: { type: 'string', example: 'Where Indian spice meets Western comfort' },
            imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Gallery ────────────────────────────────────────────────────────
        GalleryItemInput: {
          type: 'object',
          required: ['imageUrl'],
          properties: {
            imageUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
            },
            label: { type: 'string', example: 'Cold Coffee', maxLength: 60 },
            span: {
              type: 'string',
              enum: ['normal', 'tall', 'wide'],
              default: 'normal',
              description: 'Grid cell size: normal (1×1), tall (1×2 portrait), wide (2×1 landscape)',
            },
            sortOrder: { type: 'integer', minimum: 0, example: 1 },
            visible: { type: 'boolean', default: true },
          },
        },
        GalleryItemUpdateInput: {
          type: 'object',
          minProperties: 1,
          description: 'Partial update — supply only the fields to change',
          properties: {
            imageUrl: { type: 'string', format: 'uri' },
            label: { type: 'string', maxLength: 60 },
            span: { type: 'string', enum: ['normal', 'tall', 'wide'] },
            sortOrder: { type: 'integer', minimum: 0 },
            visible: { type: 'boolean' },
          },
        },
        GalleryItem: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600' },
            label: { type: 'string', example: 'Cold Coffee' },
            span: { type: 'string', enum: ['normal', 'tall', 'wide'], example: 'tall' },
            sortOrder: { type: 'integer', example: 1 },
            visible: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Settings ───────────────────────────────────────────────────────
        PopularTimesDay: {
          type: 'array',
          description: '12 hourly busyness values (0–100) from 11 AM to 10 PM',
          minItems: 12,
          maxItems: 12,
          items: { type: 'integer', minimum: 0, maximum: 100 },
          example: [20, 32, 40, 58, 82, 95, 90, 75, 55, 40, 28, 14],
        },
        SettingsUpdateInput: {
          type: 'object',
          minProperties: 1,
          description: 'Partial update — supply only the fields to change',
          properties: {
            phone: { type: 'string', example: '092637 50882' },
            address: { type: 'string', example: 'Madan Jee Ka Hata, Pakari Chowk, Arrah, Bihar 802301' },
            closesAt: { type: 'string', example: '10:00 PM', description: 'Format: H:mm AM/PM' },
            isOpenNow: { type: 'boolean', example: true },
            priceRange: { type: 'string', example: '₹200–400' },
            instagramUrl: { type: 'string', format: 'uri', example: 'https://www.instagram.com/indo__western_ara/' },
            instagramHandle: { type: 'string', example: '@indo__western_ara' },
            directionsUrl: { type: 'string', format: 'uri' },
            highlights: {
              type: 'array',
              maxItems: 10,
              items: { type: 'string', maxLength: 60 },
              example: ['All you can eat', 'Happy-hour food', 'Fireplace'],
            },
            rating: { type: 'number', minimum: 0, maximum: 5, example: 4.4 },
            reviewCount: { type: 'integer', minimum: 0, example: 487 },
            reviewSummary: {
              type: 'string',
              maxLength: 600,
              example: 'Guests love the cold coffee and attentive service.',
            },
            reportedByCount: { type: 'integer', minimum: 0, example: 91 },
            popularTimes: {
              type: 'object',
              description: 'Partial or full popular-times map — only days supplied are updated',
              properties: {
                Mon: { $ref: '#/components/schemas/PopularTimesDay' },
                Tue: { $ref: '#/components/schemas/PopularTimesDay' },
                Wed: { $ref: '#/components/schemas/PopularTimesDay' },
                Thu: { $ref: '#/components/schemas/PopularTimesDay' },
                Fri: { $ref: '#/components/schemas/PopularTimesDay' },
                Sat: { $ref: '#/components/schemas/PopularTimesDay' },
                Sun: { $ref: '#/components/schemas/PopularTimesDay' },
              },
            },
          },
        },
        Settings: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            phone: { type: 'string', example: '092637 50882' },
            address: { type: 'string', example: 'Madan Jee Ka Hata, Pakari Chowk, Arrah, Bihar 802301' },
            closesAt: { type: 'string', example: '10:00 PM' },
            isOpenNow: { type: 'boolean', example: true },
            priceRange: { type: 'string', example: '₹200–400' },
            instagramUrl: { type: 'string', example: 'https://www.instagram.com/indo__western_ara/' },
            instagramHandle: { type: 'string', example: '@indo__western_ara' },
            directionsUrl: { type: 'string', example: 'https://maps.google.com/maps?q=Indo+Western...' },
            highlights: {
              type: 'array',
              items: { type: 'string' },
              example: ['All you can eat', 'Happy-hour food', 'Fireplace'],
            },
            rating: { type: 'number', example: 4.4 },
            reviewCount: { type: 'integer', example: 487 },
            reviewSummary: { type: 'string', example: 'Guests love the cold coffee...' },
            reportedByCount: { type: 'integer', example: 91 },
            popularTimes: {
              type: 'object',
              description: 'Map of day abbreviation → 12-slot hourly busyness array (11 AM–10 PM)',
              additionalProperties: { $ref: '#/components/schemas/PopularTimesDay' },
              example: {
                Mon: [10, 15, 20, 35, 55, 70, 60, 45, 30, 20, 10, 5],
                Sat: [20, 32, 40, 58, 82, 95, 90, 75, 55, 40, 28, 14],
              },
            },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Google Reviews ─────────────────────────────────────────────────
        GoogleReview: {
          type: 'object',
          properties: {
            author_name: { type: 'string', example: 'Rahul Sharma' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            text: {
              type: 'string',
              example: 'Amazing cold coffee and great ambience. Highly recommended!',
            },
            time: {
              type: 'integer',
              example: 1720000000,
              description: 'Unix timestamp of the review',
            },
            profile_photo_url: {
              type: 'string',
              nullable: true,
              example: 'https://lh3.googleusercontent.com/a/...',
            },
            relative_time_description: {
              type: 'string',
              nullable: true,
              example: 'a week ago',
            },
          },
        },

        // ── Stats ──────────────────────────────────────────────────────────
        StatsSummary: {
          type: 'object',
          properties: {
            reservations: {
              type: 'object',
              properties: {
                total: { type: 'integer', example: 171 },
                thisMonth: { type: 'integer', example: 44 },
                lastMonth: { type: 'integer', example: 38 },
                growthPct: { type: 'integer', example: 16, description: 'Month-over-month growth percentage' },
                byStatus: {
                  type: 'object',
                  properties: {
                    pending: { type: 'integer', example: 12 },
                    confirmed: { type: 'integer', example: 25 },
                    cancelled: { type: 'integer', example: 7 },
                  },
                },
              },
            },
            customers: {
              type: 'object',
              properties: {
                total: { type: 'integer', example: 684, description: 'Sum of all partySize values' },
                thisMonth: { type: 'integer', example: 176 },
              },
            },
          },
        },
        TrendPoint: {
          type: 'object',
          properties: {
            month: { type: 'string', example: 'Sep', description: 'Abbreviated month name' },
            year: { type: 'integer', example: 2026 },
            bookings: { type: 'integer', example: 44 },
            guests: { type: 'integer', example: 176 },
          },
        },
      },
    },
  },

  // Scan all v1 route files for @swagger JSDoc blocks
  apis: [
    path.join(__dirname, '../routes/v1/*.route.js').replace(/\\/g, '/'),
    path.join(__dirname, '../routes/v1/index.js').replace(/\\/g, '/'),
  ],
});

module.exports = spec;
