import type { BasicColumn } from '@/components/Table/src/types/table';

import { h, Ref, toRaw } from 'vue';

import EditableCell from './EditableCell.vue';
import { isArray } from '@/utils/is';

interface Params {
  text: string;
  record: Recordable;
  index: number;
}

export function renderEditCell(column: BasicColumn) {
  return ({ text: value, record, index }: Params) => {
    toRaw(record).onValid = async () => {
      if (isArray(record?.validCbs)) {
        const validFns = (record?.validCbs || []).map((fn) => fn());
        const res = await Promise.all(validFns);
        return res.every((item) => !!item);
      } else {
        return false;
      }
    };

    toRaw(record).onEdit = async (edit: boolean, submit = false) => {
      if (!submit) {
        record.editable = edit;
      }

      if (!edit && submit) {
        if (!(await record.onValid())) return false;
        const res = await record.onSubmitEdit?.();
        if (res) {
          record.editable = false;
          return true;
        }
        return false;
      }
      // cancel
      if (!edit && !submit) {
        record.onCancelEdit?.();
      }
      return true;
    };

    return h(EditableCell, {
      value,
      record,
      column,
      index,
    });
  };
}

export type EditRecordRow<T = Recordable> = Partial<
  {
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>;
    onValid: () => Promise<boolean>;
    editable: boolean;
    onCancel: Fn;
    onSubmit: Fn;
    submitCbs: Fn[];
    cancelCbs: Fn[];
    validCbs: Fn[];
    editValueRefs: Recordable<Ref>;
  } & T
>;
