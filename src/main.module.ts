import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DevModule } from './modules/dev/dev.module.js';
import { LoggerModule } from './logger/logger.module.js';
import { LoggerMiddleware } from './middleware/logger.middleware.js';
import { IndexModule } from './modules/index/index.module.js';
import { SnippetModule } from './modules/snippets/snippet.module.js';

@Module({
  imports: [
    LoggerModule,
    IndexModule,
    DevModule,
    SnippetModule,
  ],
  providers: [],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(LoggerMiddleware)
        .forRoutes('*');
  }
}
