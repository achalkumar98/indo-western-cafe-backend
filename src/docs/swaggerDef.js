const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Indo Western Cafe API',
    version: '2.0.0',
    description:
      'Public reservations, menu, gallery, banners, settings and admin APIs for Indo Western Cafe & Restaurant.',
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Local development',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    responses: {
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 401, message: 'Please authenticate' },
          },
        },
      },
      Forbidden: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 403, message: 'Forbidden' },
          },
        },
      },
      NotFound: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 404, message: 'Not found' },
          },
        },
      },
      BadRequest: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { code: 400, message: 'Validation failed' },
          },
        },
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          code: { type: 'integer' },
          message: { type: 'string' },
        },
      },
    },
  },
};

module.exports = swaggerDef;
