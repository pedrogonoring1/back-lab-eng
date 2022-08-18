import 'reflect-metadata';

import './config/setupDotenv';

import MongoDBConnectionFactory from './factories/MongoDBConnectionFactory';
import LoggerFactory from './factories/LoggerFactory';

(async () => {
  const logger = new LoggerFactory().apply();
  logger.info('Booting up...');

  const { default: settings } = await require('./config/settings');

  await new MongoDBConnectionFactory().apply(settings);
})();
