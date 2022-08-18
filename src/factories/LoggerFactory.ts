import { inject, injectable } from 'inversify';
import { Logger, createLogger, format, transports } from 'winston';
import settings from '../config/settings';
import Settings from '../types/Settings';

@injectable()
class LoggerFactory {
  @inject('Settings') settings!: Settings;

  apply(): Logger {
    return createLogger({
      level: settings.logger.level,
      format: format.combine(
        format.errors({ stack: true }),
        format.colorize(),
        format.timestamp(),
        format.printf(({ level, message, timestamp, stack }) => {
          if (stack) {
            return `${timestamp} ${level}: ${message}\n${stack}`;
          } else {
            return `${timestamp} ${level}: ${message}`;
          }
        })
      ),
      transports: [new transports.Console()],
    });
  }
}

export default LoggerFactory;
