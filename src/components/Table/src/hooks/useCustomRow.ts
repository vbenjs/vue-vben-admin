import type { ComputedRef } from 'vue';
import type { BasicTableProps } from '../types/table';
import { unref } from 'vue';
import type { Key } from 'ant-design-vue/lib/table/interface';

import { parseRowKeyValue } from '../helper';

interface Options {
  setSelectedRowKeys: (keyValues: Key[]) => void;
  getSelectRowKeys: () => Key[];
  clearSelectedRowKeys: () => void;
  emit: EmitType;
  getAutoCreateKey: ComputedRef<boolean | undefined>;
}

export function useCustomRow(
  propsRef: ComputedRef<BasicTableProps>,
  { setSelectedRowKeys, getSelectRowKeys, getAutoCreateKey, clearSelectedRowKeys, emit }: Options,
) {
  const customRow = (record: Recordable, index: number) => {
    return {
      onClick: (e: Event) => {
        e?.stopPropagation();
        function handleClick() {
          const { rowSelection, rowKey, clickToRowSelect } = unref(propsRef);
          if (!rowSelection || !clickToRowSelect) return;
          const keyValues = getSelectRowKeys() || [];
          const keyValue = parseRowKeyValue(rowKey, record, unref(getAutoCreateKey));
          if (!keyValue) return;

          const isCheckbox = rowSelection.type === 'checkbox';
          if (isCheckbox) {
            // 找到tr
            const tr = (e as MouseEvent)
              .composedPath?.()
              .find((dom) => (dom as HTMLElement).tagName === 'TR') as HTMLElement;
            if (!tr) return;
            // 找到Checkbox，检查是否为disabled
            const checkBox = tr.querySelector('input[type=checkbox]');
            if (!checkBox || checkBox.hasAttribute('disabled')) return;
            if (!keyValues.includes(keyValue)) {
              keyValues.push(keyValue);
              setSelectedRowKeys(keyValues);
              return;
            }
            const keyIndex = keyValues.findIndex((item) => item === keyValue);
            keyValues.splice(keyIndex, 1);
            setSelectedRowKeys(keyValues);
            return;
          }

          const isRadio = rowSelection.type === 'radio';
          if (isRadio) {
            if (!keyValues.includes(keyValue)) {
              if (keyValues.length) {
                clearSelectedRowKeys();
              }
              setSelectedRowKeys([keyValue]);
              return;
            }
            clearSelectedRowKeys();
          }
        }
        handleClick();
        emit('row-click', record, index, e);
      },
      onDblclick: (event: Event) => {
        emit('row-dbClick', record, index, event);
      },
      onContextmenu: (event: Event) => {
        emit('row-contextmenu', record, index, event);
      },
      onMouseenter: (event: Event) => {
        emit('row-mouseenter', record, index, event);
      },
      onMouseleave: (event: Event) => {
        emit('row-mouseleave', record, index, event);
      },
    };
  };

  return {
    customRow,
  };
}
