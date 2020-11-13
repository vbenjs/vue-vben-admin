type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

const reg = /^https:\/\//;

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list: ProxyList = []) {
  const ret: any = {};
  for (const [prefix, target] of list) {
    const isHttps = reg.test(target);

    ret[prefix] = {
      target: target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
