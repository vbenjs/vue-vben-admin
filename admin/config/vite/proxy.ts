/**
 * Used to parse the .env.development proxy configuration
 */
import type { ProxyOptions } from 'vite'

/**
 * Configure according to the proxy list
 * @param proxyList
 */
export const configProxy = (proxyList: [string, string][] = []) => {
  const proxy: Record<string, ProxyOptions> = {}
  for (const [prefix, target] of proxyList) {
    const isHttps = /^https:\/\//.test(target)
    // https://github.com/http-party/node-http-proxy#options
    proxy[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    }
  }
  return proxy
}
