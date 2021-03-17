import { app } from 'electron'
import path from 'path'
const log4js = require('log4js');

const logFileDir = process.env.NODE_ENV === 'production' ? path.join(app.getPath('userData'), './logDir') : './logDir' 

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: path.join(logFileDir, './log') }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug' }
  }
});

export default log4js.getLogger();