<template>
  <div :class="prefixCls" v-if="getShowSearch" @click.stop="handleSearch">
    <Tooltip>
      <template #title>
        {{ t('common.searchText') }}
      </template>
      <SearchOutlined />
    </Tooltip>

    <AppSearchModal @close="handleClose" :visible="showModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import AppSearchModal from './AppSearchModal.vue';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'AppSearch',
    components: { AppSearchModal, Tooltip, SearchOutlined },
    setup() {
      const showModal = ref(false);
      const { prefixCls } = useDesign('app-search');
      const { getShowSearch } = useHeaderSetting();
      const { t } = useI18n();

      function handleSearch() {
        showModal.value = true;
      }
      return {
        t,
        prefixCls,
        showModal,
        getShowSearch,
        handleClose: () => {
          showModal.value = false;
        },
        handleSearch,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-search';

  .@{prefix-cls} {
    padding: 2px;
  }
</style>
