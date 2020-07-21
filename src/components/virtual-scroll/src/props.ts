// Helpers

import { PropOptions } from 'compatible-vue';
// Types

export type NumberOrNumberString = PropOptions<string | number | undefined>;

export const props = {
  height: [Number, String] as NumberOrNumberString,
  maxHeight: [Number, String] as NumberOrNumberString,
  maxWidth: [Number, String] as NumberOrNumberString,
  minHeight: [Number, String] as NumberOrNumberString,
  minWidth: [Number, String] as NumberOrNumberString,
  width: [Number, String] as NumberOrNumberString,
  bench: {
    type: [Number, String],
    default: 0,
  } as NumberOrNumberString,
  itemHeight: {
    type: [Number, String],
    required: true,
  } as NumberOrNumberString,
  items: {
    type: Array,
    default: () => [],
  } as PropOptions<any[]>,
};
