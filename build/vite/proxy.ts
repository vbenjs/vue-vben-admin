type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

const reg = /^https:\/\//;
export function createProxy(list: ProxyList = []) {
  const ret: any = {};
  for (const [prefix, target] of list) {
    const isHttps = reg.test(target);

    ret[prefix] = {
      target: target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ''),
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
