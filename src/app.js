const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes/v1');
const swaggerSpec = require('./config/swagger');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(compression());

// CORS — production: CLIENT_URL only; development: any localhost
function buildCorsOrigin() {
  const allowlist = config.clientUrl
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const isDev = config.env !== 'production';
  const localhostRe = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

  return (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowlist.includes('*') || allowlist.includes(origin)) return callback(null, true);
    if (isDev && localhostRe.test(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  };
}

app.use(cors({ origin: buildCorsOrigin(), credentials: true }));
app.options('*', cors());

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'Indo Western API' }));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// All API routes mounted under /api
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
