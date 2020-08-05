<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { BasicTree } from '@/components/tree/index';

  import { treeData } from './data';

  export default defineComponent({
    name: 'TreeBaseDemo',
    setup() {
      return () => {
        return (
          <div class="tree-demo">
            <div class="tree-demo-item">
              <div class="tree-demo-title">基础示例</div>
              <BasicTree treeData={treeData} />
            </div>

            <div class="tree-demo-item">
              <div class="tree-demo-title">勾选示例</div>
              <BasicTree treeData={treeData} checkable={true} />
            </div>
            <div class="tree-demo-item">
              <div class="tree-demo-title">默认展开/勾选示例</div>
              <BasicTree
                treeData={treeData}
                checkable={true}
                expandedKeys={['0-0']}
                checkedKeys={['0-0']}
              />
            </div>
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
      padding-left: 20px;
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
