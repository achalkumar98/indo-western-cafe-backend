/**
 * Entry point — delegates to src/index.js which wires the Express app
 * (src/app.js) to MongoDB and starts the HTTP server.
 *
 * All routes live in src/routes/v1/.
 * Swagger docs are served at /api/docs.
 */
require('./src/index');
