import { defHttp } from '@/utils/http/axios';
enum Api {
  city = '/json/province_city.json',
}

export const getCity = async () => {
  const { data } = await defHttp.get({ url: Api.city }, { isReturnNativeResponse: true });
  return formatCity(data);
};

export function formatCity(arr: any[]) {
  return arr.map((item) => {
    return {
      value: item.name,
      label: item.name,
      children: item.cityList.map((city) => {
        return {
          value: city.name,
          label: city.name,
          children: [],
          isLeaf: true,
          // children: city.areaList.map((area) => {
          //   return {
          //     value: area.name,
          //     label: area.name,
          //   };
          // }),
        };
      }),
    };
  });
}
