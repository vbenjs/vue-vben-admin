<template>
  <Input
    :style="{ width }"
    :placeholder="t('component.icon.placeholder')"
    :class="prefixCls"
    v-model:value="currentSelect"
    @click="triggerPopover"
    :allowClear="props.allowClear"
    :readonly="props.readonly"
  >
    <template #addonAfter>
      <Popover
        placement="bottomLeft"
        trigger="click"
        v-model="visible"
        :overlayClassName="`${prefixCls}-popover`"
      >
        <template #title>
          <div class="flex justify-between">
            <Input
              :placeholder="t('component.icon.search')"
              @change="debounceHandleSearchChange"
              allowClear
            />
          </div>
        </template>

        <template #content>
          <div v-if="getPaginationList.length">
            <ScrollContainer class="border border-solid border-t-0">
              <ul class="flex flex-wrap px-2">
                <li
                  v-for="icon in getPaginationList"
                  :key="icon"
                  :class="currentSelect === icon ? 'border border-primary' : ''"
                  class="p-2 w-1/8 cursor-pointer mr-1 mt-1 flex justify-center items-center border border-solid hover:border-primary"
                  @click="handleClick(icon)"
                  :title="icon"
                >
                  <SvgIcon v-if="isSvgMode" :name="icon" />
                  <Icon :icon="icon" v-else />
                </li>
              </ul>
            </ScrollContainer>
            <div class="flex py-2 items-center justify-center" v-if="getTotal >= pageSize">
              <Pagination
                showLessItems
                size="small"
                :pageSize="pageSize"
                :total="getTotal"
                @change="handlePageChange"
              />
            </div>
          </div>
          <template v-else>
            <div class="p-5"><Empty /> </div>
          </template>
        </template>

        <div ref="trigger">
          <span
            class="cursor-pointer px-2 py-1 flex items-center"
            v-if="isSvgMode && currentSelect"
          >
            <SvgIcon :name="currentSelect" />
          </span>
          <Icon
            :icon="currentSelect || 'ion:apps-outline'"
            class="cursor-pointer px-2 py-1"
            v-else
          />
        </div>
      </Popover>
    </template>
  </Input>
</template>
<script lang="ts" setup>
  import { ref, watchEffect, watch } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { ScrollContainer } from '@/components/Container';
  import { Input, Popover, Pagination, Empty } from 'ant-design-vue';
  import Icon from '../Icon.vue';
  import SvgIcon from './SvgIcon.vue';

  import iconsData from '../data/icons.data';
  import { usePagination } from '@/hooks/web/usePagination';
  import { useDebounceFn } from '@vueuse/core';
  import { useI18n } from '@/hooks/web/useI18n';
  import svgIcons from 'virtual:svg-icons-names';
  import { copyText } from '@/utils/copyTextToClipboard';

  function getIcons() {
    const prefix = iconsData.prefix;
    return iconsData.icons.map((icon) => `${prefix}:${icon}`);
  }

  function getSvgIcons() {
    return svgIcons.map((icon: string) => icon.replace('icon-', ''));
  }

  export interface Props {
    value?: string;
    width?: string;
    pageSize?: number;
    copy?: boolean;
    mode?: 'svg' | 'iconify';
    allowClear?: boolean;
    readonly?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    width: '100%',
    pageSize: 140,
    copy: false,
    mode: 'iconify',
    allowClear: true,
    readonly: false,
  });

  // Don't inherit FormItem disabled、placeholder...
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits(['change', 'update:value']);

  const isSvgMode = props.mode === 'svg';
  const icons = isSvgMode ? getSvgIcons() : getIcons();

  const currentSelect = ref('');
  const visible = ref(false);
  const currentList = ref(icons);
  const trigger = ref<HTMLDivElement>();

  const triggerPopover = () => {
    if (trigger.value) {
      trigger.value.click();
    }
  };

  const { t } = useI18n();
  const { prefixCls } = useDesign('icon-picker');

  const debounceHandleSearchChange = useDebounceFn(handleSearchChange, 100);

  const { getPaginationList, getTotal, setCurrentPage } = usePagination(
    currentList,
    props.pageSize,
  );

  watchEffect(() => {
    currentSelect.value = props.value;
  });

  watch(
    () => currentSelect.value,
    (v) => {
      emit('update:value', v);
      emit('change', v);
    },
  );
  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleClick(icon: string) {
    currentSelect.value = icon;
    if (props.copy) {
      copyText(icon, t('component.icon.copy'));
    }
  }

  function handleSearchChange(e: Event) {
    const value = (e.target as HTMLInputElement).value;

    if (!value) {
      setCurrentPage(1);
      currentList.value = icons;
      return;
    }
    currentList.value = icons.filter((item) => item.includes(value));
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-icon-picker';

  .@{prefix-cls} {
    .ant-input-group-addon {
      padding: 0;
    }

    .ant-input {
      cursor: pointer;
    }

    &-popover {
      width: 300px;

      .ant-popover-inner-content {
        padding: 0;
      }

      .scrollbar {
        height: 220px;
      }
    }
  }
</style>
