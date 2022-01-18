import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import http from 'http';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import path from 'node:path';
import { init } from './init.js';
import { MainModule } from './main.module.js';
import { Config } from './config.js';
import { Logger } from './logger/logger.service.js';
import session from 'express-session';
import chalk from 'chalk';
import { IoAdapter } from '@nestjs/platform-socket.io';
import hbs from 'hbs';

init();

bootstrap();

async function bootstrap() {
  const nestLogger = new Logger();
  nestLogger.setContext(chalk.greenBright('@nestjs'));
  const nest = await NestFactory.create<NestExpressApplication>(
    MainModule,
    new ExpressAdapter(express()),
    { logger: nestLogger, cors: true, },
  );
  nest.useWebSocketAdapter(new IoAdapter(nest.getHttpServer()));

  nest.useStaticAssets(Config.DIR_PUBLIC);
  nest.setBaseViewsDir(Config.DIR_VIEWS);
  nest.setViewEngine('hbs');
  hbs.registerPartials(path.join(Config.DIR_VIEWS, 'partials'));

  nest.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }));

  await nest.listen(Config.PORT);
}
