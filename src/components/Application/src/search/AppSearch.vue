<script lang="tsx">
  import { defineComponent, ref, unref } from 'vue';

  import { Tooltip } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import AppSearchModal from './AppSearchModal.vue';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'AppSearch',
    components: { AppSearchModal, Tooltip },
    setup() {
      const showModal = ref(false);

      const { getShowSearch } = useHeaderSetting();
      const { t } = useI18n();

      function changeModal(show: boolean) {
        showModal.value = show;
      }

      return () => {
        if (!unref(getShowSearch)) {
          return null;
        }
        return (
          <div class="p-1" onClick={changeModal.bind(null, true)}>
            <Tooltip>
              {{
                title: () => t('common.searchText'),
                default: () => <SearchOutlined />,
              }}
            </Tooltip>
            <AppSearchModal onClose={changeModal.bind(null, false)} visible={unref(showModal)} />
          </div>
        );
      };
    },
  });
</script>
