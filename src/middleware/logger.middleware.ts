import chalk from 'chalk';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger/logger.service.js';
import { performance } from 'perf_hooks';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger) private readonly log: Logger,
  ) {
    this.log.setContext(chalk.cyanBright('request'));
  }

  /**
   * @inheritdoc
   */
  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    req.log = this.log.child(
      chalk.cyan('HttpRequest')
      + ' '
      + chalk.magenta(req.ip)
      + ' '
      + chalk.cyan(req.path));

    res.once('finish', () => {
      const end = performance.now();
      const delta = Math.round(end - start);
      const code = res.statusCode;
      const msg = chalk.green(req.path)
        + '  '
        + (
          (code >= 200 && code < 300) ? chalk.green(code)
          : (code >= 300 && code < 400) ? chalk.yellow(code)
          : (code >= 400 && code < 500) ? chalk.red(code)
          : (code >= 500 && code < 600) ? chalk.bgRed.white.bold(code)
          : code
        )
        + '  '
        + (
          delta <= 25 ? chalk.greenBright(`${delta}ms`)
          : delta <= 50 ? chalk.blueBright(`${delta}ms`)
          : delta <= 75 ? chalk.yellowBright(`${delta}ms`)
          : delta <= 125 ? chalk.magentaBright(`${delta}ms`)
          : chalk.redBright(`${delta}ms`)
        )
        + '  '
        + req.ip
        + (req.ips.length ? '  ' + req.ips.join(',') : '')
      ;

      req.log.info(msg);
    });

    next();
  }
}