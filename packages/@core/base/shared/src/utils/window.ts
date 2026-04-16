interface OpenWindowOptions {
  noopener?: boolean;
  noreferrer?: boolean;
  target?: '_blank' | '_parent' | '_self' | '_top' | string;
}

interface OpenRouteInNewWindowOptions {
  /**
   * @zh_CN 窗口名称（仅在 reuseExisting 为 true 且同源时生效）
   */
  name?: string;
  /**
   * @zh_CN 复用同名窗口：已存在则导航并聚焦，避免重复打开多个标签页。
   * 出于安全考虑，仅同源 URL 才会启用复用（并关闭 noopener/noreferrer）。
   */
  reuseExisting?: boolean;
}

function isSameOriginUrl(url: string): boolean {
  try {
    return new URL(url, location.href).origin === location.origin;
  } catch {
    return false;
  }
}

/**
 * 新窗口打开URL。
 *
 * @param url - 需要打开的网址。
 * @param options - 打开窗口的选项。
 */
function openWindow(
  url: string,
  options: OpenWindowOptions = {},
): null | Window {
  // 解构并设置默认值
  const { noopener = true, noreferrer = true, target = '_blank' } = options;

  // 基于选项创建特性字符串
  const features = [noopener && 'noopener=yes', noreferrer && 'noreferrer=yes']
    .filter(Boolean)
    .join(',');

  // 打开窗口
  return window.open(url, target, features);
}

/**
 * 在新窗口中打开路由。
 * @param path
 * @param options
 */
function openRouteInNewWindow(
  path: string,
  options: OpenRouteInNewWindowOptions = {},
) {
  const { name = 'vben-route-window', reuseExisting = false } = options;
  const { hash, origin } = location;
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${origin}${hash && !fullPath.startsWith('/#') ? '/#' : ''}${fullPath}`;

  const canReuse = reuseExisting && isSameOriginUrl(url);
  const target = canReuse ? name : '_blank';
  const win = openWindow(url, {
    noreferrer: canReuse ? false : undefined,
    noopener: canReuse ? false : undefined,
    target,
  });
  if (canReuse) {
    win?.focus?.();
  }
}

export { openRouteInNewWindow, openWindow };
