import { Ref, ref, unref } from 'vue';

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

export function useFullscreen(
  target: Ref<Nullable<HTMLElement>> | Nullable<HTMLElement> = ref(document.documentElement),
  options?: FullscreenOptions
) {
  const isFullscreenRef = ref(false);
  const el = document.documentElement;
  let RFC_METHOD_NAME: RFSMethodName = 'requestFullscreen';
  let EFS_METHOD_NAME: EFSMethodName = 'exitFullscreen';
  let FSE_PROP_NAME: FSEPropName = 'fullscreenElement';

  if ('webkitRequestFullScreen' in el) {
    RFC_METHOD_NAME = 'webkitRequestFullScreen';
    EFS_METHOD_NAME = 'webkitExitFullscreen';
    FSE_PROP_NAME = 'webkitFullscreenElement';
  } else if ('msRequestFullscreen' in el) {
    RFC_METHOD_NAME = 'msRequestFullscreen';
    EFS_METHOD_NAME = 'msExitFullscreen';
    FSE_PROP_NAME = 'msFullscreenElement';
  } else if ('mozRequestFullScreen' in el) {
    RFC_METHOD_NAME = 'mozRequestFullScreen';
    EFS_METHOD_NAME = 'mozCancelFullScreen';
    FSE_PROP_NAME = 'mozFullScreenElement';
  } else if (!('requestFullscreen' in el)) {
    throw new Error('当前浏览器不支持Fullscreen API !');
  }
  function enterFullscreen(): Promise<void> {
    isFullscreenRef.value = true;
    return (unref(target) as any)[RFC_METHOD_NAME](options);
  }

  function exitFullscreen(): Promise<void> {
    isFullscreenRef.value = false;
    return (document as any)[EFS_METHOD_NAME]();
  }

  function isFullscreen(): boolean {
    return unref(target) === (document as any)[FSE_PROP_NAME];
  }

  async function toggleFullscreen(): Promise<void> {
    if (!unref(target)) return;

    if (isFullscreen()) {
      return exitFullscreen();
    } else {
      return enterFullscreen();
    }
  }

  return {
    // watchFullscreen,
    toggleFullscreen,
    exitFullscreen,
    isFullscreen,
    enterFullscreen,
    isFullscreenRef,
  };
}
