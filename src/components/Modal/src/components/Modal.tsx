import { useAttrs } from '@vben/hooks';
import { Modal } from 'ant-design-vue';
import { defineComponent, toRefs, unref } from 'vue';

import { extendSlots } from '@/utils/helper/tsxHelper';

import { useModalDragMove } from '../hooks/useModalDrag';
import { basicProps } from '../props';

export default defineComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: basicProps as any,
  emits: ['cancel'],
  setup(props, { slots, emit }) {
    const { visible, draggable, destroyOnClose } = toRefs(props);
    const attrs = useAttrs();
    useModalDragMove({
      visible,
      destroyOnClose,
      draggable,
    });

    const onCancel = (e: Event) => {
      emit('cancel', e);
    };

    return () => {
      const propsData = { ...unref(attrs), ...props, onCancel } as Recordable;
      return <Modal {...propsData}>{extendSlots(slots)}</Modal>;
    };
  },
});
