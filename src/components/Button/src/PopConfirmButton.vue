<script lang="ts">
  import { defineComponent, h, unref, computed } from 'vue';

  import { Popconfirm } from 'ant-design-vue';

  import BasicButton from './BasicButton.vue';

  import { propTypes } from '/@/utils/propTypes';
  import { extendSlots } from '/@/utils/helper/tsxHelper';
  import { omit } from 'lodash-es';

  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'PopButton',
    components: { Popconfirm, BasicButton },
    inheritAttrs: false,
    props: {
      size: propTypes.oneOf(['large', 'default', 'small']).def(),
      enable: propTypes.bool.def(true),
      okText: propTypes.string,
      cancelText: propTypes.string,
    },
    setup(props, { slots }) {
      const { t } = useI18n();
      const attrs = useAttrs();

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
        const values = omit(unref(getBindValues), 'icon');
        const Button = h(BasicButton, values, extendSlots(slots));

        if (!props.enable) {
          return Button;
        }

        return h(Popconfirm, values, { default: () => Button });
      };
    },
  });
</script>
