import moment from 'moment';
// @ts-ignore
import pkg from '../../../package.json';
export function setupBasicEnv() {
  // version
  process.env.VITE_VERSION = (pkg as any).version;
  // build time
  process.env.VITE_APP_BUILD_TIME = moment().format('YYYY-MM-DD HH:mm:ss');
  process.env.VITE_BUILD_SHORT_TIME = moment().format('MMDDHHmmss');
}
