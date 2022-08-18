import { Container } from 'inversify';
import Settings from '../types/Settings';
import settings from '../config/settings';
import { Logger } from 'winston';
import LoggerFactory from './LoggerFactory';

export const apply = (): Container => {
  const container = new Container({ autoBindInjectable: true });
  const logger = new LoggerFactory().apply();

  container
    .bind<Settings>('Settings')
    .toDynamicValue(() => settings)
    .inSingletonScope();

  container
    .bind<Logger>('Logger')
    .toDynamicValue(() => logger)
    .inSingletonScope();

  return container;
};
