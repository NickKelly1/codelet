import path from 'node:path';
import { config } from 'dotenv';
import { boolean, integer, key, oneOf, parse, string } from '@nkp/config';
import { LOG_LEVELS } from './constants.js';

config({ path: path.join(process.cwd(), '.env'), });

const DIR_ROOT = path.normalize(key('DIR_ROOT').string().default(process.cwd()).parse());
const DIR_STORAGE = path.normalize(key('DIR_STORAGE').string().default(path.join(DIR_ROOT, 'storage')).parse());
const DIR_LOGS = path.normalize(key('DIR_LOGS').string().default(path.join(DIR_STORAGE, 'logs')).parse());
const DIR_PUBLIC = path.normalize(key('DIR_PUBLIC').string().default(path.join(DIR_ROOT, 'public')).parse());
const DIR_VIEWS = path.normalize(key('DIR_VIEWS').string().default(path.join(DIR_ROOT, 'views')).parse());

export const Config = {
  DIR_ROOT,
  DIR_STORAGE,
  DIR_LOGS,
  DIR_PUBLIC,
  DIR_VIEWS,
  ...parse({
    LOG_LEVEL: oneOf(LOG_LEVELS).default('debug'),
    NODE_ENV: oneOf(['development', 'testing', 'production',] as const),
    LOG_INSPECT_LEVEL: integer({ gte: 0, }).default(10),
    LOGS_COMPRESS: boolean().default(true),
    LOGS_MAX_SIZE: string().default('10mb'),
    LOGS_ROTATION_MAX_AGE: string().default('7d'),

    PORT: integer({ gte: 0, }).default(3000),
  }),
};

export type IConfig = typeof Config;