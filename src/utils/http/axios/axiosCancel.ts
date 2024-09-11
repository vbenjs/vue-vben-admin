import type { AxiosRequestConfig } from 'axios';

// 用于存储每个请求的标识和取消函数
const pendingMap = new Map<string, AbortController>();

const getPendingUrl = (config: AxiosRequestConfig): string => {
  return [config.method, config.url].join('&');
};

export class AxiosCanceler {
  /**
   * 添加请求
   * @param config 请求配置
   */
  public addPending(config: AxiosRequestConfig): void {
    this.removePending(config);
    const url = getPendingUrl(config);
    const controller = new AbortController();
    config.signal = config.signal || controller.signal;
    if (!pendingMap.has(url)) {
      // 如果当前请求不在等待中，将其添加到等待中
      pendingMap.set(url, controller);
    }
  }

  /**
   * 清除所有等待中的请求
   */
  public removeAllPending(): void {
    pendingMap.forEach((abortController) => {
      if (abortController) {
        abortController.abort();
      }
    });
    this.reset();
  }

  /**
   * 移除请求
   * @param config 请求配置
   */
  public removePending(config: AxiosRequestConfig): void {
    const url = getPendingUrl(config);
    if (pendingMap.has(url)) {
      // 如果当前请求在等待中，取消它并将其从等待中移除
      const abortController = pendingMap.get(url);
      if (abortController) {
        abortController.abort(url);
      }
      pendingMap.delete(url);
    }
  }

  /**
   * 重置
   */
  public reset(): void {
    pendingMap.clear();
  }
}
