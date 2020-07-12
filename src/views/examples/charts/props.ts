import { PropOptions } from 'compatible-vue';

export interface BasicProps {
  width: string;
  height: string;
}
export const basicProps = {
  width: {
    type: String,
    default: '100%',
  } as PropOptions<string>,
  height: {
    type: String,
    default: '280px',
  } as PropOptions<string>,
};
