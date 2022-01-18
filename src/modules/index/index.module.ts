import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module.js';
import { IndexController } from './index.controller.js';

@Module({
  imports: [
    LoggerModule,
  ],
  controllers: [
    IndexController,
  ],
})
export class IndexModule {
  //
}