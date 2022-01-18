import { Controller, Inject } from '@nestjs/common';
import { Logger } from '../../logger/logger.service.js';

@Controller()
export class DevController {
  constructor(
    @Inject(Logger) private readonly log: Logger,
  ) {
    this.log.setContext(this);
  }
}