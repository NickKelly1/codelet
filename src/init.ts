import { logger } from './logger.js';

let booted = false;

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

  process.on(
    'uncaughtException',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function handleUnhandledRejection(err) {
      // you may put telemetry stuff like Sentry here

      // log and then exit

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logger.error(err as any, () => {
        // eslint-disable-next-line no-process-exit
        process.exit(1);
      });
    }
  );

  logger.info('booted');
}

