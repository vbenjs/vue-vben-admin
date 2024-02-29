import axios from 'axios';
import { defHttp } from '@/utils/http/axios';

enum Api {
  update = '/app/update',
  updateStatus = '/app/updateStatus',
  check = '/admin/sysUpdate/check',
}

export async function updateSystem(data: string, host: string) {
  try {
    const res = await axios.post(host + Api.update, data);
    return res.data;
  } catch (error) {
    return null;
  }
}

export async function getSystemUpdateStatus(host: string) {
  try {
    const { data } = await axios.get(host + Api.updateStatus);
    return data;
  } catch (error) {
    return [];
  }
}

export function checkSystemUpdate() {
  return defHttp.post({
    url: Api.check,
  });
}
