import { Modal } from 'ant-design-vue';
import { defineComponent, toRefs } from 'vue';
import { basicProps } from './props';
import { useModalDragMove } from './useModalDrag';
import { extendSlots } from '/@/utils/helper/tsxHelper';

export default defineComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: basicProps,
  setup(props, { attrs, slots }) {
    const { visible, draggable, destroyOnClose } = toRefs(props);

    useModalDragMove({
      visible,
      destroyOnClose,
      draggable,
    });

    return () => {
      const propsData = { ...attrs, ...props } as any;
      return <Modal {...propsData}>{extendSlots(slots)}</Modal>;
    };
  },
});
