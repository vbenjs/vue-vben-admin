function getTypeVersion() {
  const userAgent = navigator.userAgent.toLowerCase();

  const browserTypes = {
    IE: /(?:msie|trident.*rv).([\d.]+)/,
    Edge: /edge.([\d.]+)/,
    Chrome: /chrome.([\d.]+)/,
    Firefox: /firefox.([\d.]+)/,
    Opera: /opera.([\d.]+)/,
    Safari: /(?:safari|version).([\d.]+)/,
  };
  type BrowserKeys = keyof typeof browserTypes;

  /** browser type */
  let type!: BrowserKeys | null;
  /** browser version */
  let version!: string | null;

  for (type in browserTypes) {
    if ((version = browserTypes[type as BrowserKeys].exec(userAgent) as any)) {
      version = version[1];
      break;
    }
  }

  if (version) {
    if (type === 'IE') {
      try {
        document.execCommand('BackgroundImageCache', false, true as any);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    type = version = null;
  }
  return { type, version };
}

const { type, version } = getTypeVersion();

export function getType() {
  return type;
}

export function getVersion() {
  return version;
}

export function isIeFn() {
  return type === 'IE';
}

export function isChromeFn() {
  return type === 'Chrome';
}

export function isEdgeFn() {
  return type === 'Edge';
}

export function isSafariFn() {
  return type === 'Safari';
}

export function isFirefoxFn() {
  return type === 'Firefox';
}

export function isOperaFn() {
  return type === 'Opera';
}

/**
 * set page Title
 * @param {*} title  :page Title
 */
function setDocumentTitle(title: string) {
  document.title = title;
  const ua = navigator.userAgent;
  const regex = /\bMicroMessenger\/([\d.]+)/;
  // 兼容
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe');
    i.src = '/favicon.ico';
    i.style.display = 'none';
    i.onload = function () {
      setTimeout(function () {
        i.remove();
      }, 9);
    };
    document.body.appendChild(i);
  }
}

export function setTitle(title: string, appTitle?: string) {
  if (title) {
    const _title = title ? ` ${title}-${appTitle} ` : `${appTitle}`;
    setDocumentTitle(_title);
  }
}
