import { Ref, ref, unref } from 'compatible-vue';

type RFSMethodName =
  | 'webkitRequestFullScreen'
  | 'requestFullscreen'
  | 'msRequestFullscreen'
  | 'mozRequestFullScreen';
type EFSMethodName =
  | 'webkitExitFullscreen'
  | 'msExitFullscreen'
  | 'mozCancelFullScreen'
  | 'exitFullscreen';
type FSEPropName =
  | 'webkitFullscreenElement'
  | 'msFullscreenElement'
  | 'mozFullScreenElement'
  | 'fullscreenElement';
type ONFSCPropName =
  | 'onfullscreenchange'
  | 'onwebkitfullscreenchange'
  | 'onmozfullscreenchange'
  | 'MSFullscreenChange';

export function useFullscreen(
  target: Ref<HTMLElement> = ref(document.documentElement),
  options?: FullscreenOptions
) {
  const isFullscreenRef = ref(false);
  const DOC_EL = document.documentElement;
  let RFC_METHOD_NAME: RFSMethodName = 'requestFullscreen';
  let EFS_METHOD_NAME: EFSMethodName = 'exitFullscreen';
  let FSE_PROP_NAME: FSEPropName = 'fullscreenElement';
  let ON_FSC_PROP_NAME: ONFSCPropName = 'onfullscreenchange';

  if ('webkitRequestFullScreen' in DOC_EL) {
    RFC_METHOD_NAME = 'webkitRequestFullScreen';
    EFS_METHOD_NAME = 'webkitExitFullscreen';
    FSE_PROP_NAME = 'webkitFullscreenElement';
    ON_FSC_PROP_NAME = 'onwebkitfullscreenchange';
  } else if ('msRequestFullscreen' in DOC_EL) {
    RFC_METHOD_NAME = 'msRequestFullscreen';
    EFS_METHOD_NAME = 'msExitFullscreen';
    FSE_PROP_NAME = 'msFullscreenElement';
    ON_FSC_PROP_NAME = 'MSFullscreenChange';
  } else if ('mozRequestFullScreen' in DOC_EL) {
    RFC_METHOD_NAME = 'mozRequestFullScreen';
    EFS_METHOD_NAME = 'mozCancelFullScreen';
    FSE_PROP_NAME = 'mozFullScreenElement';
    ON_FSC_PROP_NAME = 'onmozfullscreenchange';
  } else if (!('requestFullscreen' in DOC_EL)) {
    throw new Error('当前浏览器不支持Fullscreen API !');
  }
  function enterFullscreen(): Promise<void> {
    return target.value[RFC_METHOD_NAME](options);
  }

  function exitFullscreen(): Promise<void> {
    return document[EFS_METHOD_NAME]();
  }

  function isFullscreen(): boolean {
    return unref(target) === document[FSE_PROP_NAME];
  }

  function toggleFullscreen(): Promise<void> {
    if (isFullscreen()) {
      return exitFullscreen();
    } else {
      return enterFullscreen();
    }
  }

  /**
   * 当全屏/退出时触发
   */
  function watchFullscreen(callback: (isFull: boolean) => void) {
    const cancel = () => {
      unref(target).onfullscreenchange = null;
    };

    const handler = () => {
      callback(isFullscreen());
    };

    unref(target)[ON_FSC_PROP_NAME] = handler;

    return {
      cancel,
    };
  }
  watchFullscreen((isFull: boolean) => {
    isFullscreenRef.value = isFull;
  });
  return {
    watchFullscreen,
    toggleFullscreen,
    exitFullscreen,
    isFullscreen,
    enterFullscreen,
    isFullscreenRef,
  };
}
