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
      size: propTypes.oneOf(['large', 'default', 'small']).def(),
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
