import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module.js';
import { DevController } from './dev.controller.js';
import { DevGateway } from './dev.gateway.js';

@Module({
  imports: [
    LoggerModule,
  ],
  providers: [
    DevGateway,
  ],
  controllers: [
    DevController,
  ],
})
export class DevModule {
  //
}
