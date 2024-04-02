import { type ComputedRef, inject, Ref } from 'vue';

import { SmartProviderConstants } from '@/components/SmartPageProvider/src/constants';

/**
 * 注入页面字典
 */
export const useInjectPageDict = () => {
  const pageDictRegister: (code: string) => void = inject(
    SmartProviderConstants.dictRegisterKey,
    () => {},
  );

  const pageDictLoadingRef: Ref<boolean> | undefined = inject(
    SmartProviderConstants.dictLoadingKey,
  );

  const pageDictData: Map<string, Recordable> | undefined = inject(SmartProviderConstants.dictData);

  const pageDictMap: ComputedRef<Recordable<Recordable>> | undefined = inject(
    SmartProviderConstants.dictMap,
  );

  const pageDictRegisterIdent: boolean = inject(SmartProviderConstants.dictRegisterIdent, false);
  return {
    pageDictRegister,
    pageDictLoadingRef,
    pageDictData,
    pageDictMap,
    pageDictRegisterIdent,
  };
};
