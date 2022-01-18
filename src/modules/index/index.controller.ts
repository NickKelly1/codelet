import { Controller, Get, Inject, Render } from '@nestjs/common';
import { Logger } from '../../logger/logger.service.js';

@Controller('/')
export class IndexController {
  constructor(
    @Inject(Logger) private readonly log: Logger
  ) {
    this.log.setContext(this);
  }

  @Get('/')
  @Render('index')
  index() {
    return {
      title: 'Codelets',
      navTitle: 'Codelets',
      // tags: [
      //   'javascript',
      //   'typescript',
      //   'web',
      //   'nodejs',
      // ],
    };
  }

  @Get('/about')
  @Render('about')
  about() {
    return {
      title: 'Codelets',
      header: 'Codelets',
    };
  }
}
