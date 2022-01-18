import DailyRotateFile from 'winston-daily-rotate-file';
import winston, { LogCallback } from 'winston';
import { Injectable, Scope, LoggerService } from '@nestjs/common';
import { Config } from '../config.js';
import { A_LOG_LEVEL, LOG_LEVEL, LOG_LEVEL_REVERSE } from '../constants.js';
import chalk, { ForegroundColor } from 'chalk';

const nocolorFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss', }),
  winston.format.printf((info) => {
    const { timestamp, level, message, label, } = info;
    return `${timestamp} [${label}] ${level}: ${message}`;
  }),
  winston.format.uncolorize(),
  winston.format.align(),
);

const colorFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss', }),
  winston.format.colorize(),
  winston.format.printf((info) => {
    const { timestamp, level, message, label, } = info;
    return `${timestamp} [${label}] ${level}: ${message}`;
  }),
  winston.format.align(),
);

// app logger config
export const rootLogger: winston.Logger = winston.createLogger({
  exitOnError: false,
  levels: LOG_LEVEL,
  level: Config.LOG_LEVEL,

  transports: [
    // https://www.npmjs.com/package/winston-daily-rotate-file

    // info file
    new DailyRotateFile({
      level: 'debug',
      dirname: Config.DIR_LOGS,
      filename: '%DATE%.info.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: Config.LOGS_COMPRESS, // gzip
      format: nocolorFormat,
      maxSize: Config.LOGS_MAX_SIZE,
      maxFiles: Config.LOGS_ROTATION_MAX_AGE,
      handleExceptions: true,
    }),

    // error file
    new DailyRotateFile({
      level: 'warn',
      dirname: Config.DIR_LOGS,
      filename: '%DATE%.error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: Config.LOGS_COMPRESS, // gzip
      format: nocolorFormat,
      maxSize: Config.LOGS_MAX_SIZE,
      maxFiles: Config.LOGS_ROTATION_MAX_AGE,
      handleExceptions: true,
    }),

    // console
    new winston.transports.Console({
      level: 'debug',
      format: colorFormat,
      handleExceptions: true,
    }),
  ],
}).child({ label: chalk.redBright('~root'), });

const randomColors: ForegroundColor[] = [
  'blue',
  'blueBright',
  'green',
  'greenBright',
  'magenta',
  'magentaBright',
  'cyan',
  'cyanBright',
  'yellow',
  'yellowBright',
  'red',
  'redBright',
];

@Injectable({ scope: Scope.TRANSIENT, })
export class Logger implements LoggerService {
  protected _context: undefined | string;
  protected _logger: winston.Logger;

  constructor() {
    this._logger = rootLogger;
  }

  child(context: object | string): Logger {
    const logger = new Logger();
    logger.setLogger(this._logger);
    logger.setContext(context);
    return logger;
  }

  /**
   * Set the winston logger instance
   *
   * @param logger
   */
  setLogger(logger: winston.Logger) {
    this._logger = logger;
  }

  /**
   * Set the context for this logger
   *
   * @param context
   */
  setContext(context: object | string) {
    let ctx: string;
    if (typeof context === 'object') {
      const name: string = Object.getPrototypeOf(context)?.constructor?.name
        ?? '[Object: null prototype]';
      ctx = name;
    } else {
      ctx = context;
    }
    const seed = String(ctx)
      .split('')
      .reduce((s, c) => s + c.charCodeAt(0), 0);
    const normalised = seed % Number.MAX_SAFE_INTEGER;
    const integer = Math.floor(normalised);
    const safe = integer % randomColors.length;
    const color = randomColors[safe]!;
    this._context = chalk[color](ctx);
    this._logger = this._logger.child({ label: this._context, });
  }

  /**
   * Set the level for this logger
   *
   * @param level
   */
  setLevel(level: A_LOG_LEVEL) {
    this._logger = this._logger.child({});
    if (typeof level === 'number')
      this._logger.level = LOG_LEVEL_REVERSE[level];
    else
      this._logger.level = level;
  }

  /**
   * @inheritdoc
   */
  public log(message: string, callback: LogCallback): void;
  // public log(message: string, meta: any, callback: LogCallback): void;
  // public log(message: string, ...meta: any[]): void;
  public log(message: any): void;
  public log(infoObject: object): void;
  public log(arg: any, ...args: any[]): void {
    this._logger.info(arg, ...args);
  }

  /**
   * @inheritdoc
   */
  public info(message: string, callback: LogCallback): void;
  // public info(message: string, meta: any, callback: LogCallback): void;
  // public info(message: string, ...meta: any[]): void;
  public info(message: any): void;
  public info(infoObject: object): void;
  public info(arg: any, ...args: any[]): void {
    this._logger.info(arg, ...args);
  }

  /**
   * @inheritdoc
   */
  public warn(message: string, callback: LogCallback): void;
  // public warn(message: string, meta: any, callback: LogCallback): void;
  // public warn(message: string, ...meta: any[]): void;
  public warn(message: any): void;
  public warn(infoObject: object): void;
  public warn(arg: any, ...args: any[]): void {
    this._logger.warn(arg, ...args);
  }

  /**
   * @inheritdoc
   */
  public error(message: string, callback: LogCallback): void;
  // public error(message: string, meta: any, callback: LogCallback): void;
  // public error(message: string, ...meta: any[]): void;
  public error(message: any): void;
  public error(infoObject: object): void;
  public error(arg: any, ...args: any[]): void {
    this._logger.error(arg, ...args);
  }

  /**
   * @inheritdoc
   */
  public debug(message: string, callback: LogCallback): void;
  // public debug(message: string, meta: any, callback: LogCallback): void;
  // public debug(message: string, ...meta: any[]): void;
  public debug(message: any): void;
  public debug(infoObject: object): void;
  public debug(arg: any, ...args: any[]): void {
    this._logger.debug(arg, ...args);
  }

  /**
   * @inheritdoc
   */
  public verbose(message: string, callback: LogCallback): void;
  // public verbose(message: string, meta: any, callback: LogCallback): void;
  // public verbose(message: string, ...meta: any[]): void;
  public verbose(message: any): void;
  public verbose(infoObject: object): void;
  public verbose(arg: any, ...args: any[]): void {
    this._logger.verbose(arg, ...args);
  }

  /**
   * @inheritdoc
   */
  public trace(message: string, callback: LogCallback): void;
  // public trace(message: string, meta: any, callback: LogCallback): void;
  // public trace(message: string, ...meta: any[]): void;
  public trace(message: any): void;
  public trace(infoObject: object): void;
  public trace(arg: any, ...args: any[]): void {
    this._logger.debug(arg, ...args);
  }
}

export const logger = rootLogger;