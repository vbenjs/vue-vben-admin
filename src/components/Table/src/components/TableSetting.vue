<template>
  <div class="table-settings">
    <Divider type="vertical" />

    <Tooltip placement="top" v-if="getSetting.redo">
      <template #title>
        <span>刷新</span>
      </template>
      <RedoOutlined @click="redo" />
    </Tooltip>

    <Tooltip placement="top" v-if="getSetting.size">
      <template #title>
        <span>密度</span>
      </template>
      <Dropdown placement="bottomCenter" :trigger="['click']">
        <ColumnHeightOutlined />
        <template #overlay>
          <Menu @click="handleTitleClick" selectable v-model:selectedKeys="selectedKeysRef">
            <MenuItem key="default">
              <span>默认</span>
            </MenuItem>
            <MenuItem key="middle">
              <span>中等</span>
            </MenuItem>
            <MenuItem key="small">
              <span>紧凑</span>
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </Tooltip>

    <Tooltip placement="top" v-if="getSetting.setting">
      <template #title>
        <span>列设置</span>
      </template>
      <Popover
        placement="bottomLeft"
        trigger="click"
        overlayClassName="table-settings__cloumn-list"
      >
        <template #content>
          <CheckboxGroup v-model:value="checkedList" @change="onChange">
            <template v-for="item in plainOptions" :key="item.value">
              <div class="table-settings__check-item">
                <Checkbox :value="item.value">
                  {{ item.label }}
                </Checkbox>
              </div>
            </template>
          </CheckboxGroup>
        </template>
        <template #title>
          <div class="table-settings__popover-title">
            <Checkbox
              :indeterminate="indeterminate"
              v-model:checked="checkAll"
              @change="onCheckAllChange"
            >
              列展示
            </Checkbox>
            <a-button size="small" type="link" @click="reset">重置</a-button>
          </div>
        </template>
        <SettingOutlined />
      </Popover>
    </Tooltip>

    <Tooltip placement="top" v-if="getSetting.fullScreen">
      <template #title>
        <span>全屏</span>
      </template>
      <FullscreenOutlined @click="handleFullScreen" v-if="!isFullscreenRef" />
      <FullscreenExitOutlined @click="handleFullScreen" v-else />
    </Tooltip>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs, PropType, computed } from 'vue';
  import { injectTable } from '../hooks/useProvinceTable';
  import { Tooltip, Divider, Dropdown, Menu, Popover, Checkbox } from 'ant-design-vue';
  import {
    RedoOutlined,
    ColumnHeightOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    SettingOutlined,
  } from '@ant-design/icons-vue';
  import { useFullscreen } from '/@/hooks/web/useFullScreen';

  import type { SizeType, TableSetting } from '../types/table';

  interface Options {
    label: string;
    value: string;
  }
  interface State {
    indeterminate: boolean;
    checkAll: boolean;
    // defaultColumns: BasicColumn[];
    // columns: BasicColumn[];
    checkedList: string[];
    defaultCheckList: string[];
  }
  export default defineComponent({
    name: 'TableSetting',
    components: {
      RedoOutlined,
      ColumnHeightOutlined,
      FullscreenExitOutlined,
      FullscreenOutlined,
      SettingOutlined,
      Popover,
      Tooltip,
      Divider,
      Dropdown,
      Checkbox,
      CheckboxGroup: Checkbox.Group,
      Menu,
      MenuItem: Menu.Item,
    },
    props: {
      setting: {
        type: Object as PropType<TableSetting>,
        default: {},
      },
    },
    setup(props) {
      const table = injectTable();
      const { toggleFullscreen, isFullscreenRef } = useFullscreen(table.wrapRef);
      const selectedKeysRef = ref<SizeType[]>([table.getSize()]);

      let plainOptions: Options[] = [];
      const state = reactive<State>({
        indeterminate: false,
        checkAll: true,
        checkedList: [],
        defaultCheckList: [],
      });

      function init() {
        let ret: Options[] = [];
        table.getColumns({ ignoreIndex: true, ignoreAction: true }).forEach((item) => {
          ret.push({
            label: item.title as string,
            value: (item.dataIndex || item.title) as string,
          });
        });
        plainOptions = ret;
        const checkList = table
          .getColumns()
          .map((item) => item.dataIndex || item.title) as string[];
        state.checkedList = checkList;
        state.defaultCheckList = checkList;
      }

      function handleTitleClick({ key }: { key: SizeType }) {
        selectedKeysRef.value = [key];
        table.setProps({
          size: key,
        });
      }

      function handleFullScreen() {
        toggleFullscreen();
      }

      function onCheckAllChange(e: ChangeEvent) {
        state.indeterminate = false;
        const checkList = plainOptions.map((item) => item.value);
        if (e.target.checked) {
          state.checkedList = checkList;
          table.setColumns(checkList);
        } else {
          state.checkedList = [];
          table.setColumns([]);
        }
      }

      function onChange(checkedList: string[]) {
        state.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length;
        state.checkAll = checkedList.length === plainOptions.length;
        table.setColumns(checkedList);
      }

      function reset() {
        if (state.checkAll) return;
        state.checkedList = [...state.defaultCheckList];
        state.checkAll = true;
        state.indeterminate = false;
        table.setColumns(state.defaultCheckList);
      }

      const getSetting = computed(
        (): TableSetting => {
          return {
            redo: true,
            size: true,
            setting: true,
            fullScreen: true,
            ...props.setting,
          };
        }
      );

      init();
      return {
        redo: () => table.reload(),
        handleTitleClick,
        selectedKeysRef,
        handleFullScreen,
        isFullscreenRef,
        onCheckAllChange,
        onChange,
        plainOptions,
        reset,
        getSetting,
        ...toRefs(state),
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../../../design/index.less';

  .table-settings {
    & > * {
      margin-right: 12px;
    }

    svg {
      width: 1.2em;
      height: 1.2em;
    }

    &__popover-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__check-item {
      width: 100%;
      padding: 4px 16px 4px 16px;

      .ant-checkbox-wrapper {
        width: 100%;
      }

      &:hover {
        background: fade(@primary-color, 10%);
      }
    }

    &__cloumn-list {
      .ant-popover-inner-content {
        max-height: 360px;
        padding-right: 0;
        padding-left: 0;
        overflow: auto;
      }

      .ant-checkbox-group {
        width: 100%;
      }
    }
  }
</style>
