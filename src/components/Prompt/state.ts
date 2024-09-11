import { FormSchema } from '@/components/Form';

type InputType = 'InputTextArea' | 'InputNumber' | 'Input';
export interface PromptProps {
  title: string;
  label?: string;
  required?: boolean;
  onOK?: Fn;
  inputType?: InputType;
  labelWidth?: number;
  width?: string;
  layout?: 'horizontal' | 'vertical' | 'inline';
  defaultValue?: string | number;
}

interface genFormSchemasProps {
  label?: string;
  required?: boolean;
  inputType?: InputType;
  defaultValue?: string | number;
}

const inputTypeMap: {
  [key in InputType]: {
    colProps: { span: number; offset?: number };
    componentProps: FormSchema['componentProps'];
  };
} = {
  InputTextArea: {
    colProps: { span: 23 },
    componentProps: {
      placeholder: '请输入内容',
      autoSize: { minRows: 2, maxRows: 6 },
      maxlength: 255,
      showCount: true,
    },
  },
  InputNumber: {
    colProps: { span: 20, offset: 2 },
    componentProps: {
      placeholder: '请输入数字',
      min: 0,
    },
  },
  Input: {
    colProps: { span: 20, offset: 2 },
    componentProps: {
      placeholder: '请输入内容',
      min: 0,
    },
  },
};

export function genFormSchemas({
  label = '备注信息',
  required = true,
  inputType = 'InputTextArea',
  defaultValue = '',
}: genFormSchemasProps) {
  const formSchema: FormSchema = {
    field: 'txt',
    component: inputType,
    label,
    defaultValue,
    required: Boolean(required),
    ...inputTypeMap[inputType],
  };
  return [formSchema];
}
