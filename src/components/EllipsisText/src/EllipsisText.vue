<script lang="tsx">
  import { defineComponent } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { cutStrByFullLength, getStrFullLength } from '@/utils/strLength';

  const props = {
    text: { type: String, default: '', required: true },
    tooltip: { type: Boolean, default: () => false },
    length: { type: Number, default: 0, required: true },
    lines: { type: Number, default: 1 },
    fullWidthRecognition: { type: Boolean, default: false },
  };

  export default defineComponent({
    name: 'EllipsisText',
    props,
    setup(props) {
      function getStrDom(str, fullLength) {
        return (
          <span>
            {cutStrByFullLength(str, props.length) + (fullLength > props.length ? '...' : '')}
          </span>
        );
      }

      function getTooltip(fullStr, fullLength) {
        return <Tooltip title={fullStr}>{getStrDom(fullStr, fullLength)}</Tooltip>;
      }

      return () => {
        const { tooltip, length } = props;
        const fullLength = getStrFullLength(props.text);
        const strDom =
          tooltip && fullLength > length
            ? getTooltip(props.text, fullLength)
            : getStrDom(props.text, fullLength);
        return strDom;
      };
    },
  });
</script>
