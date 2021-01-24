import type { PropType } from 'vue';

import { useI18n } from '/@/hooks/web/useI18n';
import { propTypes } from '/@/utils/propTypes';
const { t } = useI18n();

export const footerProps = {
  confirmLoading: propTypes.bool,
  /**
   * @description: Show close button
   */
  showCancelBtn: propTypes.bool.def(true),
  cancelButtonProps: Object as PropType<Recordable>,
  cancelText: propTypes.string.def(t('common.cancelText')),
  /**
   * @description: Show confirmation button
   */
  showOkBtn: propTypes.bool.def(true),
  okButtonProps: Object as PropType<Recordable>,
  okText: propTypes.string.def(t('common.okText')),
  okType: propTypes.string.def('primary'),
  showFooter: propTypes.bool,
  footerHeight: {
    type: [String, Number] as PropType<string | number>,
    default: 60,
  },
};
export const basicProps = {
  isDetail: propTypes.bool,
  title: propTypes.string.def(''),
  loadingText: propTypes.string,
  showDetailBack: propTypes.bool.def(true),
  visible: propTypes.bool,
  loading: propTypes.bool,
  maskClosable: propTypes.bool.def(true),
  getContainer: {
    type: [Object, String] as PropType<any>,
  },
  scrollOptions: {
    type: Object as PropType<any>,
    default: null,
  },
  closeFunc: {
    type: [Function, Object] as PropType<any>,
    default: null,
  },
  triggerWindowResize: propTypes.bool,
  destroyOnClose: propTypes.bool,
  ...footerProps,
};
