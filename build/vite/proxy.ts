type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<
  string,
  {
    target: string;
    changeOrigin: boolean;
    rewrite: (path: string) => any;
    secure?: boolean;
  }
>;

const httpsRE = /^https:\/\//;

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);

    ret[prefix] = {
      target: target,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
