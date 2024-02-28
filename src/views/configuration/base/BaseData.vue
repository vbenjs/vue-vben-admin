<template>
  <div>
    <CardList :api="api" :refresh="refresh" @dblclick="handleManager">
      <!-- <template #actions="{ item }">
        <div class="flex justify-center"> 管理 </div>
      </template> -->
      <template #more="{ item }">
        <MoreAction :dropMenuList="createDropMenuList(item)" />
      </template>
    </CardList>
  </div>
</template>
<script lang="tsx" setup>
  import { CardList, MoreAction } from '@/components/CardList';
  // import { schemas } from './data';
  import { ref } from 'vue';
  import { ActionItem } from '@/components/Table';
  import { BaseDataType } from '@/enums/baseDataType';
  import { useGo } from '@/hooks/web/usePage';

  defineOptions({ name: 'BaseData' });

  const go = useGo();

  const refresh = ref(false);
  interface Schema {
    key: BaseDataType;
    name: string;
    description: string;
  }

  const api = async () => {
    const list: Schema[] = [
      {
        key: 'PRODUCT',
        name: '产品信息',
        description: '管理系统中的产品信息',
      },
      {
        key: 'EFFICIENCY',
        name: '效率',
        description: '管理系统中的效率',
      },
      {
        key: 'CLAZZ',
        name: '班次',
        description: '管理系统中的班次',
      },
      {
        key: 'LINE',
        name: '线别',
        description: '管理系统中的线别',
      },
      {
        key: 'PIECE',
        name: '片源',
        description: '管理系统中的片源',
      },
      {
        key: 'CRYSTAL',
        name: '单多晶类型',
        description: '管理系统中的单多晶类型',
      },
      {
        key: 'LEVEL',
        name: '等级',
        description: '管理系统中的等级',
      },
      {
        key: 'COLOR',
        name: '颜色',
        description: '管理系统中的颜色',
      },
      {
        key: 'BE',
        name: 'BE',
        description: '管理系统中的BE',
      },
      {
        key: 'FE',
        name: 'FE',
        description: '管理系统中的FE',
      },
    ];

    return Promise.resolve({
      data: list,
      total: list.length,
    });
  };

  const handleManager = (item: any) => {
    go({ path: `/configuration/base_data/manager/${item.key}` });
  };

  function createDropMenuList(item: any): ActionItem[] {
    return [
      {
        icon: '',
        label: '管理',
        color: 'primary',
        onClick: () => handleManager(item),
      },
    ];
  }
</script>
