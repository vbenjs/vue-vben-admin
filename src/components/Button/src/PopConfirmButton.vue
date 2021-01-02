<script lang="ts">
  import { defineComponent, h, unref } from 'vue';

  import { Popconfirm } from 'ant-design-vue';
  import BasicButton from './BasicButton.vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { extendSlots } from '/@/utils/helper/tsxHelper';
  import { omit } from 'lodash-es';
  const { t } = useI18n();

  export default defineComponent({
    name: 'PopButton',
    inheritAttrs: false,
    components: { Popconfirm, BasicButton },
    props: {
      enable: propTypes.bool.def(true),
      okText: propTypes.string.def(t('component.drawer.okText')),
      cancelText: propTypes.string.def(t('component.drawer.cancelText')),
    },
    setup(props, { slots, attrs }) {
      return () => {
        const popValues = { ...props, ...unref(attrs) };

        const Button = h(BasicButton, omit(unref(attrs), 'icon'), extendSlots(slots));
        if (!props.enable) {
          return Button;
        }

        return h(Popconfirm, omit(popValues, 'icon'), { default: () => Button });
      };
    },
  });
</script>
