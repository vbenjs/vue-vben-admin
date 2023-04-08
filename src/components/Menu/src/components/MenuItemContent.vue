<template>
  <span :class="`${prefixCls}- flex items-center `">
    <VbenIcon
      v-if="getIcon"
      :icon="getIcon"
      :size="18"
      :class="`${prefixCls}-wrapper__icon mr-2`"
    />
    {{ getI18nName }}
  </span>
</template>
<script lang="ts">
  import { VbenIcon } from '@vben/icons';
  import { computed, defineComponent } from 'vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useI18n } from '@/hooks/web/useI18n';

  import { contentProps } from '../props';

  const { t } = useI18n();

  export default defineComponent({
    name: 'MenuItemContent',
    components: {
      VbenIcon,
    },
    props: contentProps,
    setup(props) {
      const { prefixCls } = useDesign('basic-menu-item-content');
      const getI18nName = computed(() => t(props.item?.name));
      const getIcon = computed(() => props.item?.icon);

      return {
        prefixCls,
        getI18nName,
        getIcon,
      };
    },
  });
</script>
