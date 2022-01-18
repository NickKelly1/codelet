import { logger } from './logger/logger.service.js';
import { kv } from '@nkp/kv';
import chalk from 'chalk';

let booted = false;

kv.defaults.formatKey = (key) => chalk.green(key);


/**
 * Prepare the application
 *
 * Hook into the NodeJS process to normalise behavior
 */
export function init(): void {
  if (booted) return;
  booted = true;

  // ensure consistent behaviour across NodeJS versions
  // cause an 'uncaughtException' on promise rejection
  // causing the process to error and exit
  process.on(
    'unhandledRejection',
    function handleUnhandledRejection(err) {
      throw err;
    }
  );

  logger.info('initialised');
}

