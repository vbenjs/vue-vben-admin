import { useUserStoreWithOut } from '/@/store/modules/user';
import { AxiosResponse } from 'axios';
import { loginApi } from '/@/api/sys/user';
import { defHttp } from '/@/utils/http/axios';
import { RsaEncryption } from '/@/utils/cipher';

const key =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0+ohmM/1vWwc/INoKNNThjSr3BrWfnw9Gtg6pL+zJ8x4jpEBGwcpUyjWzBjwWAK8p6FoqaGuhZfFo8xOYXct4okpqr6F/KkyesIbDaTv2Dp/ev7EZascBze3Qj4xmr9FNQ5stkSbzhR6Anv1YDCSPPUtQqhBi7xNOS2lNdx+ybf7YizGGyO2zbt6XgNAAnmYchLyoZxTIg6J5foE6RVOLizGReFgCUgvEApWqyRG/T5t9hbWjoO3DcJkkZms9BAr2ruiiNu0Wq1zMcGBSrds/ZoNAutAKkaoRfDAWuBe+9l3It0I0tYcXGOvR7BkPv+4uuVHAoA2sT/b95Zq0YeKuQIDAQAB';
const rsaEncrypt = new RsaEncryption(key);

export class AxiosRefreshToken {
  private isRefreshing: boolean;
  private requests: Array<Function>;
  constructor() {
    this.isRefreshing = false;
    this.requests = [];
  }

  public refeshing(response: AxiosResponse<any>) {
    console.log('response', response);
    const userStore = useUserStoreWithOut();
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      return loginApi({
        grant_type: 'refresh_token',
        refresh_token: rsaEncrypt.encrypt(userStore.getRefreshToken),
      })
        .then((res) => {
          const token = res.access_token;
          userStore.setToken(token);
          // token 刷新后将数组的方法重新执行
          this.requests.forEach((cb) => cb(token));
          this.requests = []; // 重新请求完清空
          response.config.headers.Authorization = `${token}`;
          return defHttp.request(response.config, { joinPrefix: false });
        })
        .catch((err) => {
          if (err.code == '400') {
            userStore.setSessionTimeout(true);
            userStore.setToken(undefined);
            userStore.setRefreshToken(undefined);
          }
          return Promise.reject(err);
        })
        .finally(() => {
          this.isRefreshing = false;
        });
    } else {
      return new Promise((resolve) => {
        // 用函数形式将 resolve 存入，等待刷新后再执行
        this.requests.push((token) => {
          response.config.headers.Authorization = `${token}`;
          resolve(defHttp.request(response.config, { joinPrefix: false }));
        });
      });
    }
  }
}
