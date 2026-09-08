const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5000),
    MONGO_URI: Joi.string().required().description('MongoDB connection URI'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_EXPIRES_IN: Joi.string().default('12h').description('JWT expiry duration'),
    ADMIN_USERNAME: Joi.string().default('admin'),
    ADMIN_PASSWORD: Joi.string().default('indowestern2026'),
    ADMIN_SIGNUP_CODE: Joi.string().default('indo-western-admin'),
    CLIENT_URL: Joi.string().default('http://localhost:3000'),
    GOOGLE_PLACE_ID: Joi.string().allow('').optional(),
    GOOGLE_MAPS_API_KEY: Joi.string().allow('').optional(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGO_URI + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  admin: {
    username: envVars.ADMIN_USERNAME,
    password: envVars.ADMIN_PASSWORD,
    signupCode: envVars.ADMIN_SIGNUP_CODE,
  },
  clientUrl: envVars.CLIENT_URL,
  google: {
    placeId: envVars.GOOGLE_PLACE_ID,
    mapsApiKey: envVars.GOOGLE_MAPS_API_KEY,
  },
};
