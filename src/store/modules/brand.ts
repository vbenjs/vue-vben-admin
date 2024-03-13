import { defineStore } from 'pinia';
import { store } from '../index';
import { PmCompany } from '@/ApiModel/company/company';
import { getCompany } from '@/api/company/company';

export interface BrandOptionState {
  brandId?: number;
  brandName?: string;
  BrandList?: PmCompany[];
}

export const useBrandStore = defineStore({
  id: 'brand',
  state: (): BrandOptionState => ({
    brandId: undefined,
    brandName: undefined,
  }),
  getters: {
    getBrandId(): number {
      return this.brandId!;
    },
    getBrandName(): string {
      return this.brandName!;
    },
    getBrandList(): PmCompany[] {
      return this.BrandList!;
    },
  },
  actions: {
    setBrand(brandId: number, brandName: string) {
      this.brandId = brandId;
      this.brandName = brandName;
    },
    async setBrandList(id: number) {
      // const data = await getCompany({ companyType: 'BRAND', parentId: id });
      // this.BrandList = data;
      const data = [
        {
          id: 1,
          name: '品牌1',
          enabled: 'Y',
        },
        {
          id: 2,
          name: '品牌2',
        },
        {
          id: 3,
          name: '品牌3',
          enabled: 'Y',
        },
      ] as any;
      this.BrandList = data;
      this.setBrand(data[0].id, data[0].name);
    },
  },
});

// Need to be used outside the setup
export function useBrandStoreWithOut() {
  return useBrandStore(store);
}
