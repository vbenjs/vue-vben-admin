import { PropOptions } from 'compatible-vue';
export const basicProps = {
  getContainer: {
    type: [Object],
  } as PropOptions<any>,
  alt: {
    type: String,
    default: '',
  } as PropOptions<string>,
  height: {
    type: [String, Number],
    default: 500,
  } as PropOptions<string | number>,
  src: {
    type: String,
    default: '',
  } as PropOptions<string>,
  srcset: {
    type: String,
    default: '',
  } as PropOptions<string>,
};
