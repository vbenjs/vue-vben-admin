import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

class AxiosCanceler {
  public pending: Map<string, AbortController> = new Map();

  // 添加请求
  public addRequest(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    const requestKey = this.getRequestKey(config);
    if (this.pending.has(requestKey)) {
      // 如果存在相同的请求，取消前一个请求
      const controller = this.pending.get(requestKey);
      controller?.abort();
    }

    // 创建新的AbortController并添加到pending中
    const controller = new AbortController();
    config.signal = controller.signal;
    this.pending.set(requestKey, controller);

    return config;
  }

  // 生成请求的唯一标识
  public getRequestKey(config: AxiosRequestConfig): string {
    const { data = {}, method, params = {}, url } = config;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }

  /**
   * 清除所有等待中的请求
   */
  public removeAllPending(): void {
    for (const [, abortController] of this.pending) {
      abortController?.abort();
    }
    this.pending.clear();
  }

  // 移除请求
  public removeRequest(config: AxiosRequestConfig | AxiosResponse): void {
    const requestKey = this.getRequestKey(config);
    this.pending.delete(requestKey);
  }
}

export { AxiosCanceler };
