import type { HTMLAttributes } from 'vue';

interface PinInputProps {
  /**
   * 发送验证码按钮loading
   */
  btnLoading?: boolean;
  /**
   * 发送验证码按钮文本
   */
  btnText?: string;
  class?: HTMLAttributes['class'];
  /**
   * 验证码长度
   */
  codeLength?: number;
  /**
   * 错误提示信息
   */
  errorTip?: string;
  /**
   * 自定义验证码发送逻辑
   * @returns
   */
  handleSendCode?: () => Promise<void>;
  /**
   * 输入框的 label
   */
  label: string;
  /**
   * 输入框的 name
   */
  name: string;
  /**
   * 输入框的校验状态
   */
  status?: 'default' | 'error';
}

export type { PinInputProps };
