import { message } from 'ant-design-vue';
import { AxiosResponse } from 'axios';
import { downloadByData, downloadByUrl } from './download';
import { useUserStore } from '@/store/modules/user';

export interface downloadRecord {
  uuid?: string;
}
type uuid = string;

export const toDownloadFile = (data?: downloadRecord | uuid, fileName?: string) => {
  const url = toDownloadUrl(data);
  downloadByUrl({ url, fileName });
};

export const toDownloadFiles = (uuids: string[], fileName?: string) => {
  const uuidsStr = uuids.map((item) => `uuids=${item}`).join('&');
  const token = useUserStore().getMobileToken;
  const api = import.meta.env.VITE_GLOB_API_URL + '/file/download/';

  const url = token ? `${api}?${uuidsStr}&t=${token}` : `${api}${uuidsStr}`;
  downloadByUrl({ url, fileName });
};

export const toDownloadUrl = (data?: downloadRecord | uuid, s?: 0 | 120 | 640) => {
  if (!data) return '';
  const uuid = typeof data === 'string' ? data : data.uuid;
  if (!uuid) return '';
  const token = useUserStore().getMobileToken;
  const api = import.meta.env.VITE_GLOB_API_URL + '/file/download/';
  if (token) return `${api}${uuid}?t=${token}${s ? '&s=' + s : ''}`;
  return `${api}${uuid}${s ? '?s=' + s : ''}`;
};

export const downloadBlob = (res: AxiosResponse) => {
  const contentDisposition = res.headers['content-disposition'];
  const fileName = decodeURI(contentDisposition.split(';')[1].split('=')[1]);
  // 判断是否有引号
  const newfileName = fileName.replace(/"/g, '');
  downloadByData(res.data, newfileName);
};
export const getFileSuffix = (name?: string, point = false) => {
  if (!name) return '';
  const nameArray = name.split('.');
  return nameArray.length === 1 ? '' : (point ? '.' : '') + nameArray.pop()?.toLowerCase();
};
const typeImage = ['jpg', 'jpeg', 'png', 'gif'];
export const isImageByname = (name: string) => {
  const type = getFileSuffix(name);
  return typeImage.includes(type);
};

export const beforeUpload = (file?: File, maxSize = 0, allowType?: string[]) => {
  if (!file) return false;
  const type = getFileSuffix(file.name);
  const isType = !allowType || allowType.includes(type) || allowType.length === 0;
  if (!isType) {
    message.error('不支持的文件类型!');
  }
  const isLtSize = !maxSize || file.size < maxSize;
  if (!isLtSize) {
    message.error(`请不要上传超过${maxSize}的文件!`);
  }
  return isLtSize && isType;
};

export const getFileSize: (number?: string | number) => {
  sizeNum?: number;
  sizeLevel?: number;
  sizeString?: string;
} = (number) => {
  if (number === undefined) return {};
  const bytes = Number(number);
  if (bytes === 0)
    return {
      sizeNum: 0,
      sizeLevel: 0,
      sizeString: '0 B',
    };
  const k = 1024; // or 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  const sizeNum = (bytes / Math.pow(k, i)).toPrecision(3);
  return {
    sizeNum: Number(sizeNum),
    sizeLevel: i,
    sizeString: sizeNum.length > 4 ? sizeNum.slice(0, 4) : sizeNum + '' + sizes[i],
  };
};
