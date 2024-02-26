<template>
  <div>
    <div v-if="showSearch" class="search-container">
      <a-input-search
        v-model:value="searchValue"
        :placeholder="$t('system.views.dept.search.deptName')"
      />
    </div>
    <Spin :spinning="loading">
      <a-tree
        v-bind="getAttrs"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        @expand="onExpand"
        :field-names="fieldNames"
        :tree-data="computedTreeData"
      >
        <template #title="{ deptName }">
          <span v-if="!showSearch">
            {{ deptName }}
          </span>
          <span v-else-if="deptName.indexOf(searchValue) > -1">
            {{ deptName.substr(0, deptName.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ deptName.substr(deptName.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ deptName }}</span>
        </template>
      </a-tree>
    </Spin>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, ref, toRefs, unref, watch } from 'vue';

  import { Spin } from 'ant-design-vue';
  import { errorMessage } from '@/utils/message/SystemNotice';
  import TreeUtils from '@/utils/TreeUtils';
  import { propTypes } from '@/utils/propTypes';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

  const getParentKey = (key: number, treeData: Array<any>): number => {
    let parentKey;
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      if (node.children) {
        if (node.children.some((item: any) => item.deptId === key)) {
          parentKey = node.deptId;
        } else {
          const secondParentKey = getParentKey(key, node.children);
          if (secondParentKey) {
            parentKey = secondParentKey;
          }
        }
      }
    }
    return parentKey;
  };

  export default defineComponent({
    name: 'SysDeptTree',
    components: { Spin },
    props: {
      // 是否支持搜索
      showSearch: propTypes.bool.def(true),
      // 是否异步加载
      async: propTypes.bool,
    },
    setup(props, { attrs }) {
      const { async: asyncRef } = toRefs(props);
      const searchValue = ref<string>('');

      const dataList = ref<Array<any>>([]);
      const autoExpandParent = ref(false);
      const expandedKeys = ref<Array<number>>([]);
      const loading = ref(false);

      const getAttrs = computed(() => {
        const result: any = {
          ...attrs,
        };
        if (unref(asyncRef)) {
          result.loadData = handleAsyncLoadData;
        }
        return result;
      });

      /**
       * 树形数据计算属性
       */
      const computedTreeData = computed(() => {
        const async = unref(asyncRef);
        if (async) {
          return unref(dataList);
        }
        return (
          TreeUtils.convertList2Tree(
            dataList.value,
            (item) => item.deptId,
            (item) => item.parentId,
            0,
          ) || []
        );
      });

      const onExpand = (keys: Array<number>) => {
        expandedKeys.value = keys;
        autoExpandParent.value = false;
      };

      /**
       * 所有数据
       */
      const getAllDataList = computed(() => {
        const result: any[] = [];
        if (unref(asyncRef)) {
          recursionAddChildren(unref(dataList), result);
        } else {
          result.push(...unref(dataList));
        }
        return result;
      });

      const recursionAddChildren = (list: any[], allData: any[]) => {
        list.forEach((item) => {
          allData.push(item);
          if (item.children && item.children.length > 0) {
            recursionAddChildren(item.children, allData);
          }
        });
      };

      watch(searchValue, (value) => {
        const allData = unref(getAllDataList);
        expandedKeys.value = allData
          .map(({ deptName, deptId }: any) => {
            if (deptName.indexOf(value) > -1) {
              return getParentKey(deptId, computedTreeData.value);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i) as Array<number>;
        autoExpandParent.value = true;
      });

      const handleAsyncLoadData = async (treeNode) => {
        const dataRef = treeNode.dataRef;
        dataRef.children = await loadData(dataRef.deptId);
        dataList.value = [...unref(dataList)];
      };

      const reload = () => loadData();

      /**
       * 加载数据函数
       */
      const loadData = async (parentId?: number | null) => {
        const parameter: Recordable = {
          sortName: 'seq',
          sortOrder: 'asc',
        };
        if (parentId !== undefined && parentId !== null) {
          parameter.parameter = {
            'parentId@=': parentId,
          };
        }
        try {
          loading.value = true;
          const result = (await defHttp.post({
            service: ApiServiceEnum.SMART_SYSTEM,
            url: 'sys/dept/list',
            data: parameter,
          })) as any[];

          result.forEach((item) => {
            if (item.hasChild !== true) {
              item.isLeaf = true;
            }
          });
          if (unref(asyncRef)) {
            if (parentId === 0) {
              dataList.value = result;
            } else {
              return result;
            }
          } else {
            dataList.value = result;
          }
        } catch (e) {
          errorMessage(e);
        } finally {
          loading.value = false;
        }
      };

      /**
       * 加载数据
       */
      onMounted(() => {
        let parentId: number | undefined = undefined;
        if (unref(asyncRef)) {
          parentId = 0;
        }
        loadData(parentId);
      });

      return {
        computedTreeData,
        autoExpandParent,
        onExpand,
        loadData,
        loading,
        expandedKeys,
        fieldNames: reactive({
          children: 'children',
          title: 'deptName',
          key: 'deptId',
        }),
        getAttrs,
        handleAsyncLoadData,
        searchValue,
        reload,
      };
    },
  });
</script>

<style scoped lang="less">
  .search-container {
    margin-bottom: 10px;
  }
</style>
