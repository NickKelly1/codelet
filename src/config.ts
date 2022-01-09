import path from 'node:path';
import { config } from 'dotenv';
import { boolean, integer, key, parse, string } from '@nkp/config';

config({ path: path.join(process.cwd(), '.env'), });

const DIR_ROOT = key('DIR_ROOT').string().default(process.cwd()).parse();
const DIR_STORAGE = key('DIR_STORAGE').string().default(path.join(DIR_ROOT, 'storage')).parse();
const DIR_LOGS = key('DIR_LOGS').string().default(path.join(DIR_STORAGE, 'logs')).parse();

export const Config = {
  DIR_ROOT,
  DIR_STORAGE,
  DIR_LOGS,
  ...parse({
    LOG_INSPECT_LEVEL: integer({ gte: 0, }).default(10),
    LOGS_COMPRESS: boolean().default(true),
    LOGS_MAX_SIZE: string().default('10mb'),
    LOGS_ROTATION_MAX_AGE: string().default('7d'),
  }),
};

export type IConfig = typeof Config;