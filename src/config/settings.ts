import './setupDotenv';

import Settings from '../types/Settings';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

const settings: Settings = {
  port: parseInt(process.env.PORT || '3003'),
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/dbname',
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
  tokenKey: process.env.TOKEN_KEY,
  environment: process.env.ENVIRONMENT || process.env.NODE_ENV,
  version: packageJson.version,
  secret: process.env.JWT_SECRET,
};

export default settings;
