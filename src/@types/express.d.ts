import { Logger } from '../logger/logger.service.js';

export declare module 'express' {
  interface Request {
    log: Logger
  }
}