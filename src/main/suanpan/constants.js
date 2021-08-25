import { isWindows } from './utils';

export const SP_SERVER_NAME = isWindows ? 'rto-server.exe' : 'rto-server.out';