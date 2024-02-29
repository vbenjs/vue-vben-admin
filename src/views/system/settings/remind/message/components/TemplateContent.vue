<script lang="tsx">
import { Popover } from "ant-design-vue";
import { PropType, defineComponent } from "vue";

interface EnumList {
  enumValueList: string[];
  keywordCode: string;
}

const props = {
  content: {
    type: String,
    default: "",
  },
  enumList: {
    type: Array as PropType<EnumList[]>,
    default: () => [],
  },
};

export default defineComponent({
  props,
  setup(props) {
    const renderContent = (content: string, enumList: EnumList[]) => {
      return content.split("\n").map((text) => {
        const target = enumList.find((item) => {
          return text.includes(`{{${item.keywordCode}}}`);
        });
        if (!target) return <div>{text}</div>;

        const data = text.split(target.keywordCode);
        return (
          <div>
            <span>{data[0]}</span>
            <Popover title="可选值">
              {{
                default: () => (
                  <span class="cursor-pointer text-primary">
                    {target.keywordCode}
                  </span>
                ),
                content: () =>
                  target.enumValueList.map((key) => <div>{key}</div>),
              }}
            </Popover>
            <span>{data[1]}</span>
          </div>
        );
      });
    };
    return () => {
      return (
        <div
          onContextmenu={(e) => {
            e.preventDefault();
          }}
        >
          {renderContent(props.content, props.enumList)}
        </div>
      );
    };
  },
});
</script>
