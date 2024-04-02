import { computed, onMounted, provide, reactive, ref, watch } from 'vue';
import { SmartProviderConstants } from '@/components/SmartPageProvider/src/constants';
import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

export const useProviderDict = () => {
  let hasInitLoad = false;
  const dictCodeList = reactive<Set<string>>(new Set<string>());
  const dictDataMap = reactive(new Map<string, Recordable>());

  // 字典加载状态
  const dictLoadingRef = ref(false);

  const computedDictMap = computed(() => {
    const result: Recordable<Recordable> = {};

    dictDataMap.forEach((list, key) => {
      const itemMap: Recordable = {};
      list.forEach((item) => {
        itemMap[item.dictItemCode] = item.dictItemName;
      });
      result[key] = itemMap;
    });

    return result;
  });

  onMounted(async () => {
    await loadDictData();
    hasInitLoad = true;
  });

  /**
   * 批量加载字典数据
   */
  const loadDictData = async () => {
    if (dictCodeList.size === 0) {
      return;
    }
    const noLoadDictCodeList: string[] = [];
    dictCodeList.forEach((item) => {
      if (!dictDataMap.has(item)) {
        noLoadDictCodeList.push(item);
      }
    });
    if (noLoadDictCodeList.length === 0) {
      return;
    }
    try {
      dictLoadingRef.value = true;
      const result =
        (await defHttp.post({
          service: ApiServiceEnum.SMART_SYSTEM,
          url: 'sys/dict/batchListItemByCode',
          data: noLoadDictCodeList,
        })) || {};
      for (const key in result) {
        dictDataMap.set(
          key,
          result[key].map((item) => {
            return {
              ...item,
              label: item.dictItemName,
              value: item.dictItemCode,
            };
          }),
        );
      }
    } finally {
      dictLoadingRef.value = false;
    }
  };

  watch(dictCodeList, () => {
    if (hasInitLoad) {
      loadDictData();
    }
  });

  /**
   * 注入注册函数
   */
  provide(SmartProviderConstants.dictRegisterKey, (code: string) => {
    dictCodeList.add(code);
  });

  /**
   * 注入字典加载状态
   */
  provide(SmartProviderConstants.dictLoadingKey, dictLoadingRef);

  provide(SmartProviderConstants.dictData, dictDataMap);

  provide(SmartProviderConstants.dictMap, computedDictMap);

  provide(SmartProviderConstants.dictRegisterIdent, true);
};
