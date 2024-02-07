import type { VxeTablePropTypes } from 'vxe-table';

const FormSizeMap: Record<string, 'default' | 'small' | 'large'> = {
  midum: 'default',
  small: 'small',
  mini: 'small',
  tiny: 'small',
};

/**
 * 获取form尺寸
 * @param size
 */
export const getFormSize = (
  size: VxeTablePropTypes.Size | undefined,
): 'default' | 'small' | 'large' | undefined => {
  if (size) {
    return FormSizeMap[size];
  }
  return undefined;
};
