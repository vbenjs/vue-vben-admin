<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Icon } from '@/components/icon/index';
  import { BasicTree, ContextMenuItem } from '@/components/tree/index';

  import { treeData } from './data';

  export default defineComponent({
    name: 'TreeActionDemo',
    setup() {
      function handlePlus(node) {
        console.log(node);
      }

      function getRightMenuList(node): ContextMenuItem[] {
        return [
          {
            label: '新增',
            handler: () => {
              console.log('点击了新增', node);
            },
            icon: 'plus',
          },
          {
            label: '删除',
            handler: () => {
              console.log('点击了删除', node);
            },
            icon: 'delete',
          },
        ];
      }
      return () => {
        return (
          <div class="tree-demo">
            <div class="tree-demo-item">
              <div class="tree-demo-title">右侧操作按钮</div>
              <BasicTree
                treeData={treeData}
                actionList={[
                  {
                    render: (node) => {
                      return (
                        <Icon type="plus" class="ml-2" onClick={handlePlus.bind(null, node)} />
                      );
                    },
                  },
                  {
                    render: () => {
                      return <Icon type="delete" />;
                    },
                  },
                ]}
              />
            </div>

            <div class="tree-demo-item">
              <div class="tree-demo-title">右键菜单示例</div>
              <BasicTree treeData={treeData} beforeRightClick={getRightMenuList} />
            </div>
            {
              //   <div class="tree-demo-item">
              //   <div class="tree-demo-title">默认展开/勾选示例</div>
              //   <BasicTree
              //     treeData={treeData}
              //     checkable={true}
              //     expandedKeys={['0-0']}
              //     checkedKeys={['0-0']}
              //   />
              // </div>
            }
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  .tree-demo {
    position: relative;
    display: flex;
    padding: 20px;

    &-item {
      width: 30%;
      min-height: 500px;
      padding: 0 20px;
      margin-right: 2%;
      background: #fff;
      border-radius: 10px;
    }

    &-title {
      width: 100%;
      padding-top: 20px;
      font-size: 20px;
      text-align: center;
    }
  }
</style>
