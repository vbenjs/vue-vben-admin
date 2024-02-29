import axios, { AxiosProgressEvent } from 'axios';
import {
  MaterialFile,
  MaterialFileForm,
  MaterialFileUpdate,
  PreviewResultModel,
  UploadFileResult,
} from './model/fileModel';
import { UploadFileParams } from '/#/axios';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { useUserStore } from '@/store/modules/user';
import { defHttp } from '@/utils/http/axios';
import { useGlobSetting } from '@/hooks/setting';

enum Api {
  materialFile = '/admin/kfMaterialFile',
  create = '/admin/kfMaterialFile/create',
  delete = '/admin/kfMaterialFile/delete',
  update = '/admin/kfMaterialFile/update',
  batchCreate = '/admin/kfMaterialFile/batchCreate',
  upload = '/file/upload',
  download = '/file/download/',
  batchDownload = '/file/download',
  preview = '/file/preview/',
}

export function getMaterialFile(data: MaterialFileForm, isTable = false) {
  return defHttp.post<MaterialFile[]>({ url: Api.materialFile, data }, { isTable });
}

export function getMaterialFileById(id: number) {
  return defHttp.post<MaterialFile>({ url: Api.materialFile + '/' + id });
}

export function batchCreateMaterialFile(data = {}) {
  return defHttp.post<MaterialFile[]>({ url: Api.batchCreate, data });
}
export const createMaterialFile = (data: MaterialFileUpdate) => {
  return defHttp.post<MaterialFile[]>({ url: Api.create, data });
};

export const updateMaterialFile = (data: MaterialFileUpdate & { id: number }) => {
  return defHttp.post({
    url: Api.update,
    data,
  });
};

export const deleteMaterialFile = (ids: number[]) => {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
};

export const { uploadUrl = '' } = useGlobSetting();
export const uploadFile = async (
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const data = await defHttp.uploadFile<UploadFileResult>(
    {
      url: uploadUrl,
      onUploadProgress,
      timeout: 0,
    },
    params,
  );
  return data;
};

export const transformPreview = (uuid: string) => {
  return defHttp.post<PreviewResultModel>({
    url: Api.preview + uuid,
  });
};

export function download(url: string) {
  return defHttp.get(
    {
      url,
      headers: {
        'Access-Control-Expose-Headers': TOKEN_KEY,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
}
export async function downloadStaffHead(url: string) {
  const res = await axios({
    method: 'post',
    url,
    responseType: 'blob',
    headers: {
      'Access-Control-Expose-Headers': TOKEN_KEY,
      [TOKEN_KEY]: useUserStore().getToken,
    },
    timeout: 0,
  });
  return res.data;
}

export const batchDownload = (uuids: Array<string>) => {
  return defHttp.post(
    {
      url: Api.batchDownload,
      timeout: 0,
      responseType: 'blob',
      data: { uuids },
      headers: {
        'Access-Control-Expose-Headers': TOKEN_KEY,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
};
