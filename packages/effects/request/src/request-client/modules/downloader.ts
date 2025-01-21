import type { RequestClient } from '../request-client';
import type { RequestClientConfig, RequestResponse } from '../types';

class FileDownloader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async download(
    url: string,
    config?: RequestClientConfig,
  ): Promise<RequestResponse<Blob>> {
    const finalConfig: RequestClientConfig = {
      ...config,
      responseType: 'blob',
      responseReturn: 'raw',
    };

    const response = await this.client.get<RequestResponse<Blob>>(
      url,
      finalConfig,
    );

    return response;
  }
}

export { FileDownloader };
