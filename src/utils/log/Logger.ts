import logger from 'pino';
import pretty from 'pino-pretty';
import dayjs from 'dayjs';

const Logger = logger(
  {
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  },
  pretty()
);

export default Logger;
