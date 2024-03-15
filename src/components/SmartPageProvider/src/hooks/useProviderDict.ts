import { computed, onMounted, provide, reactive, ref, unref } from 'vue';
import { SmartProviderConstants } from '@/components/SmartPageProvider/src/constants';
import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

export const useProviderDict = () => {
  const dictCodeList = reactive<string[]>([]);
  // 字典加载状态
  const dictLoadingRef = ref(false);

  /**
   * 字典数据
   */
  const dictMapRef = ref<Recordable<any[]>>({});

  const computedDictMap = computed(() => {
    const result: Recordable<Recordable> = {};

    Object.keys(unref(dictMapRef)).forEach((key) => {
      const list = unref(dictMapRef)[key];
      const itemMap: Recordable = {};
      list.forEach((item) => {
        itemMap[item.dictItemCode] = item.dictItemName;
      });
      result[key] = itemMap;
    });

    return result;
  });

  onMounted(() => loadDictData());

  /**
   * 批量加载字典数据
   */
  const loadDictData = async () => {
    if (dictCodeList.length === 0) {
      return;
    }
    try {
      dictLoadingRef.value = true;
      const result =
        (await defHttp.post({
          service: ApiServiceEnum.SMART_SYSTEM,
          url: 'sys/dict/batchListItemByCode',
          data: dictCodeList,
        })) || {};
      const dictMap: Recordable<any[]> = {};
      for (const key in result) {
        dictMap[key] = result[key].map((item) => {
          return {
            ...item,
            label: `${item.dictItemCode}-${item.dictItemName}`,
            value: item.dictItemCode,
          };
        });
      }
      dictMapRef.value = dictMap;
    } finally {
      dictLoadingRef.value = false;
    }
  };

  /**
   * 注入注册函数
   */
  provide(SmartProviderConstants.dictRegisterKey, (code: string) => {
    dictCodeList.push(code);
  });

  /**
   * 注入字典加载状态
   */
  provide(SmartProviderConstants.dictLoadingKey, dictLoadingRef);

  provide(SmartProviderConstants.dictData, dictMapRef);

  provide(SmartProviderConstants.dictMap, computedDictMap);
};
