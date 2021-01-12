<script lang="ts">
  import { defineComponent, h, unref, computed } from 'vue';

  import { Popconfirm } from 'ant-design-vue';
  import BasicButton from './BasicButton.vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { extendSlots } from '/@/utils/helper/tsxHelper';
  import { omit } from 'lodash-es';

  export default defineComponent({
    name: 'PopButton',
    inheritAttrs: false,
    components: { Popconfirm, BasicButton },
    props: {
      enable: propTypes.bool.def(true),
      okText: propTypes.string,
      cancelText: propTypes.string,
    },
    setup(props, { slots, attrs }) {
      const { t } = useI18n();

      const getBindValues = computed(() => {
        const popValues = Object.assign(
          {
            okText: t('common.okText'),
            cancelText: t('common.cancelText'),
          },
          { ...props, ...unref(attrs) }
        );
        return popValues;
      });
      return () => {
        const Button = h(BasicButton, omit(unref(attrs), 'icon'), extendSlots(slots));
        if (!props.enable) {
          return Button;
        }

        return h(Popconfirm, omit(unref(getBindValues), 'icon'), { default: () => Button });
      };
    },
  });
</script>
