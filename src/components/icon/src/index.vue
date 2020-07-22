<script lang="tsx">
  // comp
  import { Icon } from 'ant-design-vue';
  import { SvgIcon } from '@/components/icon/index';

  import { defineComponent, computed, unref, PropOptions } from 'compatible-vue';

  export default defineComponent({
    name: 'Icon',
    props: {
      // 图标类型
      type: {
        type: String,
        required: true,
      } as PropOptions<string>,

      // 是否是自定义的svg图标
      isSvg: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
    },
    setup(props, { emit, attrs }) {
      // 是否未自定义的svg图标
      const isSvgIconType = computed(() => {
        // 判断type 是否以 |svg结尾
        const { type = '', isSvg } = props;
        return /\|svg$/.test(type) || isSvg;
      });

      // 如果是svg,获取真实的type

      const getRealType = computed(() => {
        // 判断type 是否以 |svg结尾
        const { type = '' } = props;
        const [realType] = type.split('|');
        return unref(isSvgIconType) ? realType : type;
      });

      function emitClick(e: ChangeEvent) {
        emit('click', e);
      }
      return () => {
        return unref(isSvgIconType) ? (
          <SvgIcon type={unref(getRealType)} onClick={emitClick} />
        ) : (
          <Icon {...{ props: attrs }} type={unref(getRealType)} onClick={emitClick} />
        );
      };
    },
  });
</script>
