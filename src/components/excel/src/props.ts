import { PropOptions } from 'compatible-vue';

export const importProps = {
  beforeUpload: {
    type: Function,
  } as PropOptions<(file: File) => boolean>,
};
