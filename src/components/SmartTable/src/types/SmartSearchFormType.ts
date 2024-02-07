import type { FormActionType, FormProps, FormSchema } from '@/components/Form';

export type SearchSymbol =
  | '='
  | 'like'
  | '>'
  | '>='
  | '<>'
  | '<'
  | '<='
  | 'in'
  | 'notLike'
  | 'likeLeft'
  | 'likeRight'
  | 'notIn'
  | 'groupBy'
  | 'between';

export type SmartSearchFormSchema = {
  searchSymbol?: SearchSymbol;
  customSymbol?: ({
    schema,
    value,
    model,
  }: {
    schema: SmartSearchFormSchema;
    value: any;
    model: Recordable;
  }) => Recordable;
} & FormSchema;

export interface SmartSearchFormProps extends FormProps {
  schemas?: SmartSearchFormSchema[];

  searchWithSymbol?: boolean;
  defaultVisible?: boolean;
}

export interface SmartSearchFormParameter {
  searchSymbolForm?: Recordable;
  noSymbolForm?: Recordable;
  searchForm?: Recordable;
  searchWithSymbol?: boolean;
}

export interface SmartSearchFormActionType extends FormActionType {
  getSearchFormParameter: () => SmartSearchFormParameter;
  /**
   * 设置搜索表单的显示状态
   * @param visible
   */
  setSearchFormVisible: (visible?: boolean) => void;
}
