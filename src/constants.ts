// https://github.com/winstonjs/winston
export const LOG_LEVEL = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  trace: 5,
} as const;
export type LOG_LEVEL = typeof LOG_LEVEL;
export type A_LOG_LEVEL_NAME = keyof LOG_LEVEL;
export type A_LOG_LEVEL_VALUE = LOG_LEVEL[keyof LOG_LEVEL];
export type A_LOG_LEVEL = A_LOG_LEVEL_NAME | A_LOG_LEVEL_VALUE;
export const LOG_LEVELS = Object.keys(LOG_LEVEL) as A_LOG_LEVEL_NAME[];
export const LOG_LEVEL_REVERSE = Object
  .fromEntries(Object
    .entries(LOG_LEVEL)
    .map(([k, v,]) => [v, k,])) as Record<A_LOG_LEVEL_VALUE, A_LOG_LEVEL_NAME> ;

// export enum Level {
//   error = 0,
//   warn = 1,
//   info = 2,
//   verbose = 3,
//   debug = 4,
//   trace = 5,
// }

// export namespace Level {
//   export const keys = Object.keys(
//     error = 0,
//     warn = 1,
//     info = 2,
//     verbose = 3,
//     debug = 4,
//     trace = 5,
//   );
//   export const
//   //
// }

// const q = Object.keys(LogLevel);

// // namespace LogLevel {
// //   // export const names = [

// //   // ]
// //   // export const honk = 0;
// // }


// const t: LogLevel = 15;
// 'q' in LogLevel;