import { requestClient } from '#/api/request';
import { getCurrencySymbol } from '#/shared/utils';

interface IAuth {
  [key: string]: any;
  shop: any;
  settings: any;
  state: any;
}

export async function getUserInfoApi(): Promise<IAuth> {
  return requestClient.get<IAuth>('/auth/me').then((res: any) => {
    res.shop.currencySymbol = getCurrencySymbol(res.shop.currency);
    res.shop.currencyFromApp = res.shop.appCurrency ?? res.shop.currency;

    // Unset appCurrency
    delete res.shop.appCurrency;

    return res;
  });
}
