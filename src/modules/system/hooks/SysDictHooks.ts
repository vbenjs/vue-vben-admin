import { computed, onMounted, ref, unref, watch } from 'vue';
import type { Ref } from 'vue';

import { errorMessage } from '@/utils/message/SystemNotice';
import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

export interface SysDictModel {
  dictItemCode: string;
  dictItemName: string;
}

/**
 * 加载字典项hook
 * @param dictCodeRef
 * @param immediate
 */
export const useLoadDictItem = (dictCodeRef: Ref<string> | string, immediate = true) => {
  const dictData = ref<Array<SysDictModel>>([]);

  const getDictItemMap = computed(() => {
    const result: { [index: string]: string } = {};
    unref(dictData).forEach((item) => {
      result[item.dictItemCode] = item.dictItemName;
    });
    return result;
  });

  /**
   * 加载数据函数
   */
  const loadDictData = async () => {
    const dictCode = unref(dictCodeRef);
    if (!dictCode || dictCode === '') {
      dictData.value = [];
    } else {
      try {
        dictData.value = await defHttp.post({
          service: ApiServiceEnum.SMART_SYSTEM,
          url: 'sys/dict/listItemByCode',
          data: dictCode,
        });
      } catch (e) {
        errorMessage(e);
      }
    }
  };

  watch(
    () => unref(dictCodeRef),
    () => {
      loadDictData();
    },
  );

  onMounted(() => {
    if (immediate) {
      loadDictData();
    }
  });

  return {
    dictData,
    loadDictData,
    getDictItemMap: getDictItemMap,
  };
};

/**
 * 批量加载字典数据
 * @param dictCodeList
 * @param immediate
 */
export const useBatchLoadDictItem = (dictCodeList: string[], immediate = true) => {
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

  const loadDictData = async () => {
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
  };

  if (immediate) {
    loadDictData();
  }

  return {
    computedDictMap,
    loadDictData,
    dictMapRef,
  };
};
