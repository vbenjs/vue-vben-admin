// 创建worker
export const createWorker = (func: () => void, deps?: Array<() => void>) => {
  // work 依赖 fns
  const depsFncStr = `${deps?.map((dep) => dep.toString()).join(';\n\n') || ''}`;
  const blob = new Blob(
    [
      `
				${depsFncStr};
				(${func.toString()})();
			`,
    ],
    {
      type: 'application/javascript',
    },
  );
  return new Worker(window.URL.createObjectURL(blob));
};
export const createWorkFn = () => {
  const opts = {
    checkUpdatesInterval: 1, // min
    fetchUrl: '/',
    immediate: true,
  };
  let timer: any = null;
  const stop = () => {
    clearInterval(timer);
  };
  const temp: Worker = globalThis as any;
  let lastVersionTag = '';
  const getVersionTag = async () => {
    try {
      const response = await fetch(opts.fetchUrl, {
        cache: 'no-cache',
        method: 'HEAD',
      });

      return (
        response.headers.get('etag') || response.headers.get('last-modified')
      );
    } catch {
      console.error('Failed to fetch version tag');
      return null;
    }
  };
  const doFetch = async () => {
    const versionTag = await getVersionTag();
    console.error(versionTag, 'versionTag');
    if (!versionTag) return;
    // 首次运行时不提示更新
    if (!lastVersionTag) {
      lastVersionTag = versionTag;
      return;
    }
    if (lastVersionTag !== versionTag) {
      stop();
      temp.postMessage({ data: versionTag, type: 'showNotice' });
    }
  };
  temp.addEventListener('message', async (event: any) => {
    // { type: 'start' | 'stop' }
    switch (event.data.type) {
      case 'start': {
        {
          const data = event.data.data;
          if (data.checkUpdatesInterval)
            opts.checkUpdatesInterval = data.checkUpdatesInterval;
          if (data.fetchUrl) opts.fetchUrl = data.fetchUrl;
          if (data.immediate) {
            await doFetch();
          }
          if (timer) stop();
          timer = setInterval(doFetch, opts.checkUpdatesInterval * 60 * 1000);
        }
        break;
      }
      case 'stop': {
        stop();
        break;
      }
    }
  });
  return temp;
};
