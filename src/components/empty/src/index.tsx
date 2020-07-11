import { defineComponent, PropOptions } from 'compatible-vue';
import { Empty } from 'ant-design-vue';

import emptySrc from '@/assets/images/page_null.png';

interface Props {
  description?: string;
  image?: string;
}
export default defineComponent({
  extends: Empty,
  props: {
    description: {
      type: [String],
      default: '暂无内容',
    } as PropOptions<string>,
    image: {
      type: String,
      default: emptySrc,
      required: false,
    } as PropOptions<string>,
  },
  setup(props: Props) {
    return () => (
      <Empty
        {...{
          props,
        }}
      />
    );
  },
});
