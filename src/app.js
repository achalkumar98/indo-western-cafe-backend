const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes/v1');
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

function buildCorsOrigin() {
  const allowlist = config.clientUrl.split(',').map((s) => s.trim()).filter(Boolean);
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

app.get('/v1/health', (_req, res) => res.json({ success: true, status: 'ok' }));

app.use('/v1', routes);

app.use((_req, _res, next) => {
  next(new ApiError(404, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
