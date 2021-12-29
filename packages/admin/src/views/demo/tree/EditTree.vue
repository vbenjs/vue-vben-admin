<template>
  <PageWrapper title="Tree函数操作示例">
    <Row :gutter="[16, 16]">
      <Col :span="8">
        <BasicTree
          title="右侧操作按钮/自定义图标"
          helpMessage="帮助信息"
          :treeData="treeData"
          :actionList="actionList"
          :renderIcon="createIcon"
        />
      </Col>
      <Col :span="8">
        <BasicTree title="右键菜单" :treeData="treeData" :beforeRightClick="getRightMenuList" />
      </Col>
      <Col :span="8">
        <BasicTree
          title="工具栏使用"
          toolbar
          checkable
          search
          :treeData="treeData"
          :beforeRightClick="getRightMenuList"
        />
      </Col>
      <Col :span="8">
        <BasicTree title="没有fieldNames，插槽有效" helpMessage="正确的示例" :treeData="treeData3">
          <template #title="item"> 插槽：{{ item.name }} </template>
        </BasicTree>
      </Col>
      <Col :span="8">
        <BasicTree
          title="有fieldNames后，插槽失效"
          helpMessage="错误的示例, 应该显示插槽的内容才对"
          :fieldNames="{ key: 'id', title: 'name' }"
          :treeData="treeData2"
        >
          <template #title="item"> 插槽：{{ item.title }} </template>
        </BasicTree>
      </Col>
      <Col :span="8">
        <BasicTree
          title="有fieldNames后，actionList失效"
          helpMessage="错误的示例，应该在鼠标移上去时，显示新增和删除按钮才对"
          :treeData="treeData3"
          :actionList="actionList"
          :fieldNames="{ key: 'key', title: 'name' }"
        />
      </Col>
    </Row>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { BasicTree, TreeActionItem, ContextMenuItem } from '/@/components/Tree/index';
  import { treeData, treeData2, treeData3 } from './data';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { BasicTree, PageWrapper, Row, Col },
    setup() {
      function handlePlus(node: any) {
        console.log(node);
      }

      function getRightMenuList(node: any): ContextMenuItem[] {
        return [
          {
            label: '新增',
            handler: () => {
              console.log('点击了新增', node);
            },
            icon: 'bi:plus',
          },
          {
            label: '删除',
            handler: () => {
              console.log('点击了删除', node);
            },
            icon: 'bx:bxs-folder-open',
          },
        ];
      }
      const actionList: TreeActionItem[] = [
        {
          // show:()=>boolean;
          render: (node) => {
            return h(PlusOutlined, {
              class: 'ml-2',
              onClick: () => {
                handlePlus(node);
              },
            });
          },
        },
        {
          render: () => {
            return h(DeleteOutlined);
          },
        },
      ];

      function createIcon({ level }) {
        if (level === 1) {
          return 'ion:git-compare-outline';
        }
        if (level === 2) {
          return 'ion:home';
        }
        if (level === 3) {
          return 'ion:airplane';
        }
        return '';
      }
      return { treeData, treeData2, treeData3, actionList, getRightMenuList, createIcon };
    },
  });
</script>
