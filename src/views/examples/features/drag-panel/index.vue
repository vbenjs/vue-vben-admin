<script lang="tsx">
  import { defineComponent, ref, computed, unref } from 'compatible-vue';

  import { Row, Col } from 'ant-design-vue';

  import { useDesign } from '@/hooks/core/useDesign';

  import Draggable from 'vuedraggable';

  const messageList: string[] = [
    'vue.draggable',
    'draggable',
    'component',
    'for',
    'vue.js 2.0',
    'based',
    'on',
    'Sortablejs',
  ];
  interface ListItem {
    name: string;
    order: number;
    fixed: boolean;
  }
  const list: ListItem[] = messageList.map((name, index) => {
    return {
      name,
      order: index + 1,
      fixed: false,
    };
  });
  const list2 = list.splice(0, 1);
  export default defineComponent({
    setup() {
      const { prefixCls } = useDesign('drag-panel');
      const listRef = ref<ListItem[]>(list);
      const targetListRef = ref<ListItem[]>(list2);

      const getDragOptionsRef = computed(() => {
        return {
          animation: 0,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost',
        };
      });
      function onMove({ relatedContext, draggedContext }) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed;
      }
      return () => {
        const options = unref(getDragOptionsRef);
        return (
          <div class={[prefixCls, 'p-4']}>
            <Row class={`${prefixCls}__wrap`}>
              <Col span={6}>
                <Draggable
                  class="list-group col"
                  tag="ul"
                  value={unref(listRef)}
                  onInput={(v: ListItem[]) => {
                    listRef.value = v;
                  }}
                  move={onMove}
                  {...{ props: options, attrs: options }}
                >
                  <transition-group type="transition" name="flip-list">
                    {unref(listRef).map((element) => {
                      return (
                        <li class="list-group-item" key={element.order}>
                          {element.name}
                          <span class="badge">{element.order}</span>
                        </li>
                      );
                    })}
                  </transition-group>
                </Draggable>
              </Col>

              <Col class="target-col" span={6} offset={2}>
                <Draggable
                  element="span"
                  value={unref(targetListRef)}
                  onInput={(v: ListItem[]) => {
                    targetListRef.value = v;
                  }}
                  move={onMove}
                  {...{
                    props: options,
                    attrs: options,
                  }}
                >
                  <transition-group name="no" class="list-group" tag="ul">
                    {unref(targetListRef).map((element) => {
                      return (
                        <li class="list-group-item" key={element.order}>
                          {element.name}
                          <span class="badge">{element.order}</span>
                        </li>
                      );
                    })}
                  </transition-group>
                </Draggable>
              </Col>
            </Row>
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-drag-panel';

  .@{prefix-cls} {
    position: relative;

    &__wrap {
      min-height: 500px;
      padding: 20px 0;
      background: #fff;
    }

    .target-col,
    .col {
      min-height: 40px;
      margin-left: 40px;
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost {
    background: #c8ebfb;
    opacity: 0.5;
  }

  .list-group {
    min-height: 20px;
    padding-left: 0;
    margin-bottom: 20px;

    &-item {
      position: relative;
      display: block;
      padding: 10px 15px;
      margin-bottom: -1px;
      cursor: move;
      background-color: #fff;
      border: 1px solid #ddd;
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;

      i {
        cursor: pointer;
      }
    }

    .badge {
      display: inline-block;
      float: right;
      min-width: 10px;
      padding: 3px 7px;
      font-size: 12px;
      font-weight: bold;
      line-height: 1;
      color: #fff;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      background-color: #777;
      border-radius: 10px;
    }
  }
</style>
