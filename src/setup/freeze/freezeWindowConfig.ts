/**
 * 冻结window配置对象,不让修改
 */
import { isProdMode } from '@/utils/envUtil';
import { getShortName } from 'config/getShortName';

if (isProdMode()) {
  const configName = getShortName(process.env);
  // 冻结对象
  Object.freeze(window[configName]);
  // 只可读
  Object.defineProperty(window, configName, {
    configurable: false,
    writable: false,
  });
}
