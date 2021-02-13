<script lang="tsx">
  import { defineComponent, ref, unref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import AppSearchModal from './AppSearchModal.vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'AppSearch',
    components: { AppSearchModal, Tooltip },
    setup() {
      const showModal = ref(false);
      const { prefixCls } = useDesign('app-search');
      const { getShowSearch } = useHeaderSetting();
      const { t } = useI18n();

      function handleSearch() {
        showModal.value = true;
      }

      function handleClose() {
        showModal.value = false;
      }

      return () => {
        if (!getShowSearch.value) {
          return null;
        }
        return (
          <div class={prefixCls} onClick={handleSearch}>
            <Tooltip>
              {{
                title: () => t('common.searchText'),
                default: () => <SearchOutlined />,
              }}
            </Tooltip>
            <AppSearchModal onClose={handleClose} visible={unref(showModal)} />
          </div>
        );
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
