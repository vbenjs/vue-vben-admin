import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import type { RequestClient } from '../request-client';

class FileUploader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async upload(
    url: string,
    data: Record<string, any> & { file: Blob | File },
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };

    return this.client.post(url, formData, finalConfig);
  }
}

export { FileUploader };
