import { Controller, Get, Header, HttpCode, Inject, Render } from '@nestjs/common';
import { Logger } from '../../logger/logger.service.js';

@Controller('/snippets')
export class SnippetController {
  constructor(
    @Inject(Logger) private readonly log: Logger,
  ) {
    this.log.setContext(this);
  }

  @Get('/create')
  @Header('Content-Type', 'text/html')
  @Render('snippets/create')
  @HttpCode(201)
  create() {
    return {
      //
    };
  }
}