import { Form, Input, Space } from 'ant-design-vue';
import { FormSchema } from '@/components/Table';
import { Icon } from '@/components/Icon';

import Product from './components/Product';
import Efficiency from './components/Efficiency';
import Other from './components/Other';
import { getCustomer } from '@/api/configuration/customer';
import { getPrintRule } from '@/api/configuration/printRule';
import { getLastPackage } from '@/api/warehouse/product';
import Line from './components/Line';

export const modalTitle = '盒码';
export function getFormSchema(type: 'bind' | 'new' = 'new'): FormSchema[] {
  const newFormSchema: FormSchema[] = [
    {
      label: '盒码信息',
      field: 'heMaInfo',
      component: 'Input',
      colProps: { span: 24 },
      renderColContent() {
        return (
          <div class="mb-2">
            <Icon icon="box|svg" size={18} class="mr-1" />
            <span>盒码信息</span>
          </div>
        );
      },
    },
    {
      label: '打印规则',
      field: 'printRuleId',
      fields: ['templateId', 'printerId'],
      component: 'ApiSelect',
      componentProps: ({ formModel }) => {
        return {
          api: getPrintRule,
          params: { templateType: ['PACKAGE'] },
          placeholder: '打印规则',
          labelField: 'name',
          valueField: 'id',
          showSearch: true,
          searchField: 'name',
          onSelect: async (value, option) => {
            let data: any = {};
            try {
              data = await getLastPackage(value);
            } finally {
              Object.assign(formModel, data, {
                templateId: option.templateId,
                printerId: option.printerId,
                customerId: option.customerId,
                customer: option.customer.name,
                barcodeRuleId: option.barcodeRule.id,
                barcodeRule: option.barcodeRule.name,
                pieceCount: option.pieceCount,
                pieceModify: option.pieceModify,
                serialLen: option.serialLen,
                serialModify: option.serialModify,
                lineIds: data.lineId ? [data.lineId] : undefined,
              });
            }
          },
        };
      },
      rules: [{ required: true, message: '请选择打印选择' }],
      colProps: { xs: 12, xl: 6 },
    },
    {
      label: '生成规则',
      field: 'barcodeRuleId',
      fields: ['customerId'],
      component: 'Input',
      render: ({ model }) => {
        return (
          <Space.Compact class="w-full">
            <Form.ItemRest>
              <Input style="flex:3" value={model.customer} readonly />
            </Form.ItemRest>
            <Input style="flex:7" value={model.barcodeRule} readonly />
          </Space.Compact>
        );
      },
      colProps: { xs: 12, xl: 6 },
    },
    {
      label: '序列号长度',
      field: `serialLen`,
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: { width: '100%' },
      },
      required: true,
      dynamicReadonly({ model }) {
        return model.serialModify === 'N';
      },
      colProps: { xs: 12, xl: 6 },
    },
    {
      label: '序列号',
      field: `serialNum`,
      component: 'Input',
      colProps: { xs: 12, xl: 6 },
    },
  ];
  const bindFormSchema: FormSchema[] = [
    {
      label: '客户',
      field: 'customerId',
      component: 'ApiSelect',
      componentProps: () => ({
        api: getCustomer,
        placeholder: '客户',
        labelField: 'name',
        valueField: 'id',
        searchField: 'name',
        showSearch: true,
      }),
      rules: [{ required: true, message: '请选择客户' }],
      colProps: { span: 12 },
    },
    {
      label: '序列号长度',
      field: `serialLen`,
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        style: { width: '100%' },
      },
      required: true,
      defaultValue: 4,
      colProps: { span: 6 },
    },
    {
      label: '序列号',
      field: `serialNum`,
      component: 'Input',
      colProps: { span: 6 },
    },
  ];

  return [
    ...(type === 'new' ? newFormSchema : bindFormSchema),
    {
      label: '产品信息',
      field: 'productId',
      fields: ['pieceCount'],
      component: 'Input',
      colProps: type === 'new' ? { xs: 24, xl: 12 } : { span: 24 },
      renderColContent({ model, field }, { disabled }) {
        return <Product disabled={disabled} field={field} model={model} />;
      },
    },
    {
      label: '效率',
      field: 'efficiencyId',
      fields: ['timeCode', 'timeCodeAuto'],
      component: 'Input',
      colProps: type === 'new' ? { xs: 24, xl: 12 } : { span: 24 },
      renderColContent({ model, field }, { disabled }) {
        return <Efficiency disabled={disabled} field={field} field2="timeCode" model={model} />;
      },
    },
    {
      label: '其他',
      field: 'other',
      component: 'Input',
      colProps: { span: 24 },
      renderColContent() {
        return (
          <div class="mb-2">
            <Icon icon="other|svg" size={18} class="mr-1" />
            <span>其他</span>
          </div>
        );
      },
    },
    {
      label: '班次',
      field: 'classId',
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
      renderColContent({ model, field }, { disabled }) {
        return (
          <Other label="班次" field={field} model={model} disabled={disabled} dataType="CLAZZ" />
        );
      },
    },
    {
      label: '线别',
      field: 'lineIds',
      fields: ['lineId'],
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
      renderColContent({ model, field }, { disabled }) {
        return (
          <Line
            label="线别"
            field={field}
            model={model}
            disabled={disabled}
            dataType="LINE"
            selectOptions={{ mode: 'multiple', maxTagCount: 2 }}
          />
        );
      },
    },
    {
      label: '片源',
      field: 'pieceId',
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
      renderColContent({ model, field }, { disabled }) {
        return (
          <Other label="片源" field={field} model={model} disabled={disabled} dataType="PIECE" />
        );
      },
    },
    {
      label: '等级',
      field: 'levelId',
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
      renderColContent({ model, field }, { disabled }) {
        return (
          <Other label="等级" field={field} model={model} disabled={disabled} dataType="LEVEL" />
        );
      },
    },
    {
      label: '颜色',
      field: 'colorId',
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
      renderColContent({ model, field }, { disabled }) {
        return (
          <Other label="颜色" field={field} model={model} disabled={disabled} dataType="COLOR" />
        );
      },
    },
    {
      label: '单多晶',
      field: 'crystalId',
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
      renderColContent({ model, field }, { disabled }) {
        return (
          <Other
            label="单多晶"
            field={field}
            model={model}
            disabled={disabled}
            showDesc={false}
            dataType="CRYSTAL"
          />
        );
      },
    },
    {
      label: '包装日期',
      field: `packingDate`,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
        style: 'width:100%',
      },
      rules: [{ required: true, message: '请选择包装日期' }],
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
    },
    {
      label: 'Bin后缀',
      field: `binSuffix`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
    },
    {
      label: 'FE',
      field: `feId`,
      component: 'ApiSelect',
      render: ({ model }, { disabled }) => {
        return (
          <Other
            label="FE"
            field="feId"
            model={model}
            disabled={disabled}
            showDesc={false}
            showLabel={false}
            dataType="FE"
          />
        );
      },
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
    },
    {
      label: 'BE',
      field: `beId`,
      component: 'ApiSelect',
      render: ({ model }, { disabled }) => {
        return (
          <Other
            label="BE"
            field="beId"
            model={model}
            disabled={disabled}
            showDesc={false}
            showLabel={false}
            dataType="BE"
          />
        );
      },
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
    },
    {
      label: '工位',
      field: `siteCode`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
    },
    {
      label: 'impp',
      field: `impp`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
    },
    {
      label: '生产批次',
      field: `lotCode`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 8, xl: 4 } : { xs: 12, xl: 6 },
    },
    {
      label: '二维码',
      field: `qrcode`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 16, xl: 8 } : { xs: 12, xl: 6 },
    },
    {
      label: '备注1',
      field: `note1`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 24, xl: 12 } : { xs: 12, xl: 6 },
    },
    {
      label: '备注2',
      field: `note2`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 24, xl: 12 } : { xs: 12, xl: 6 },
    },
    {
      label: '备注3',
      field: `note3`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 24, xl: 12 } : { xs: 12, xl: 6 },
    },
    {
      label: '备注4',
      field: `note4`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 24, xl: 12 } : { xs: 12, xl: 6 },
    },
    {
      label: '备注5',
      field: `note5`,
      component: 'Input',
      colProps: type === 'new' ? { xs: 24, xl: 12 } : { xs: 12, xl: 6 },
    },
  ];
}
