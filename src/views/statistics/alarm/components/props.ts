import { NameValueResult } from '@/api/model/homeModel';

export interface BasicProps {
  width: string;
  height: string;
}
export const basicProps = {
  width: {
    type: String as PropType<string>,
    default: '100%',
  },
  height: {
    type: String as PropType<string>,
    default: '280px',
  },
  data: {
    type: Array as PropType<NameValueResult[]>,
    default: () => [],
  },
  year: {
    type: [String, Number] as PropType<string | number>,
  },
};
