import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module.js';
import { SnippetController } from './snippet.controller.js';
import { SnippetGateway } from './snippet.gateway.js';

@Module({
  imports: [
    LoggerModule,
  ],
  providers: [
    SnippetGateway,
  ],
  controllers: [
    SnippetController,
  ],
})
export class SnippetModule {
  //
}
