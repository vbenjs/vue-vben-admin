import type { App, Directive, DirectiveBinding } from 'vue';
import { on } from '/@/utils/domUtils';
import { isFunction } from '/@/utils/is';
import { dateUtil } from '/@/utils/dateUtil';
import { downloadByData } from '../utils/file/download';

const exportExcelDirective: Directive = {
  mounted(el: Element, binding: DirectiveBinding<any>) {
    const api = binding.value['api'];
    let params = binding.value['params'];
    const fileName = binding.value['fileName'];
    const beginDownloadFn: Fn = binding.value['beginDownloadFn'];
    const downloadSuccessFn: Fn = binding.value['downloadSuccessFn'];
    const downloadErrorFn: Fn = binding.value['downloadErrorFn'];
    const downLoadComplete: Fn = binding.value['downLoadComplete'];
    if (api && isFunction(api)) {
      on(el, 'click', (): void => {
        el.setAttribute('disabled', 'true');
        if (beginDownloadFn && isFunction(beginDownloadFn)) {
          params = beginDownloadFn();
        }
        api(params)
          .then((data: Blob) => {
            if (!(data instanceof Blob) || data.size === 0) {
              downloadErrorFn(new Error('down load error'));
              return;
            }
            let name = `${dateUtil().format('YYYY-MM-DD HH-mm:ss')}.xlsx`;
            if (fileName && fileName.length > 0) {
              name = `${fileName}`;
            }
            downloadByData(data, name);
            if (downloadSuccessFn && isFunction(downloadSuccessFn)) {
              downloadSuccessFn();
            }
          })
          .catch((er: Error) => {
            if (downloadErrorFn && isFunction(downloadErrorFn)) {
              downloadErrorFn(er);
            }
          })
          .finally(() => {
            el.removeAttribute('disabled');
            if (downLoadComplete && isFunction(downLoadComplete)) {
              downLoadComplete();
            }
          });
      });
    }
  },
};

export function setupExportExcelDirective(app: App) {
  app.directive('excel', exportExcelDirective);
}
