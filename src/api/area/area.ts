import { Axios } from 'axios';

enum Api {
  Area = 'http://xzqh.ifuboy.com',
}

/**
 * @description: 获取全国行政区划数据
 */
export function getAreas(params) {
  const axios = new Axios({
    baseURL: Api.Area,
  });

  return axios
    .get('/query', {
      params,
    })
    .then((res) => {
      return JSON.parse(res.data);
    });
}
