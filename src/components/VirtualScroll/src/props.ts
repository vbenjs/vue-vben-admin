// Helpers

import type { PropType } from 'vue';
// Types

export type NumberOrNumberString = PropType<string | number | undefined>;

export const props = {
  height: [Number, String] as NumberOrNumberString,
  maxHeight: [Number, String] as NumberOrNumberString,
  maxWidth: [Number, String] as NumberOrNumberString,
  minHeight: [Number, String] as NumberOrNumberString,
  minWidth: [Number, String] as NumberOrNumberString,
  width: [Number, String] as NumberOrNumberString,
  bench: {
    type: [Number, String] as NumberOrNumberString,
    default: 0,
  },
  itemHeight: {
    type: [Number, String] as NumberOrNumberString,
    required: true,
  },
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
};
