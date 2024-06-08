import type { HTMLAttributes } from 'vue';

interface InputProps {
  class?: HTMLAttributes['class'];
  /**
   * 错误提示信息
   */
  errorTip?: string;
  /**
   * 输入框的 label
   */
  label?: string;
  /**
   * 输入框的 name
   */
  name?: string;
  /**
   * 是否显示密码强度
   */
  passwordStrength?: boolean;
  /**
   * 输入框的校验状态
   */
  status?: 'default' | 'error';
}

export type { InputProps };
