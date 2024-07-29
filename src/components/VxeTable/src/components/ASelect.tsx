import { ComponentOptions, h, resolveComponent } from 'vue';
import { VxeColumnPropTypes, VxeGlobalRendererHandles, VxeGlobalRendererOptions } from 'vxe-table';
import XEUtils from 'xe-utils';
import {
  cellText,
  createCellRender,
  createEvents,
  createProps,
  isEmptyValue,
  createExportMethod,
  createFormItemRender,
} from './common';

function renderOptions(options: any[], optionProps: VxeGlobalRendererHandles.RenderOptionProps) {
  const labelProp = optionProps.label || 'label';
  const valueProp = optionProps.value || 'value';
  return XEUtils.map(options, (item, oIndex) => {
    return h(
      resolveComponent('a-select-option') as ComponentOptions,
      {
        key: oIndex,
        value: item[valueProp],
        disabled: item.disabled,
      },
      {
        default: () => cellText(item[labelProp]),
      },
    );
  });
}

function createEditRender() {
  return function (
    renderOpts: VxeColumnPropTypes.EditRender,
    params: VxeGlobalRendererHandles.RenderTableEditParams,
  ) {
    const { options = [], optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts;
    const { row, column, $table } = params;
    const { attrs } = renderOpts;
    const cellValue = XEUtils.get(row, column.field as string);
    const props = createProps(renderOpts, cellValue);
    const ons = createEvents(
      renderOpts,
      params,
      (value: any) => {
        // 处理 model 值双向绑定
        XEUtils.set(row, column.field as string, value);
      },
      () => {
        // 处理 change 事件相关逻辑
        $table.updateStatus(params);
      },
    );
    if (optionGroups) {
      const groupOptions = optionGroupProps.options || 'options';
      const groupLabel = optionGroupProps.label || 'label';
      return [
        h(
          resolveComponent('a-select') as ComponentOptions,
          {
            ...attrs,
            ...props,
            ...ons,
          },
          {
            default: () => {
              return XEUtils.map(optionGroups, (group, gIndex) => {
                return h(
                  resolveComponent('a-select-opt-group') as ComponentOptions,
                  {
                    key: gIndex,
                  },
                  {
                    label: () => {
                      return h('span', {}, group[groupLabel]);
                    },
                    default: () => renderOptions(group[groupOptions], optionProps),
                  },
                );
              });
            },
          },
        ),
      ];
    }
    return [
      h(
        resolveComponent('a-select') as ComponentOptions,
        {
          ...props,
          ...attrs,
          ...ons,
        },
        {
          default: () => renderOptions(options, optionProps),
        },
      ),
    ];
  };
}

function getSelectCellValue(
  renderOpts: VxeGlobalRendererHandles.RenderTableCellOptions,
  params: VxeGlobalRendererHandles.RenderTableCellParams,
) {
  const {
    options = [],
    optionGroups,
    props = {},
    optionProps = {},
    optionGroupProps = {},
  } = renderOpts;
  const { row, column } = params;
  const labelProp = optionProps.label || 'label';
  const valueProp = optionProps.value || 'value';
  const groupOptions = optionGroupProps.options || 'options';
  const cellValue = XEUtils.get(row, column.field as string);
  if (!isEmptyValue(cellValue)) {
    return XEUtils.map(
      props.mode === 'multiple' ? cellValue : [cellValue],
      optionGroups
        ? (value) => {
            let selectItem;
            for (let index = 0; index < optionGroups.length; index++) {
              selectItem = XEUtils.find(
                optionGroups[index][groupOptions],
                (item) => item[valueProp] === value,
              );
              if (selectItem) {
                break;
              }
            }
            return selectItem ? selectItem[labelProp] : value;
          }
        : (value) => {
            const selectItem = XEUtils.find(options, (item) => item[valueProp] === value);
            return selectItem ? selectItem[labelProp] : value;
          },
    ).join(', ');
  }
  return '';
}

function createFilterRender() {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender,
    params: VxeGlobalRendererHandles.RenderTableFilterParams,
  ) {
    const { options = [], optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts;
    const groupOptions = optionGroupProps.options || 'options';
    const groupLabel = optionGroupProps.label || 'label';
    const { column } = params;
    const { attrs } = renderOpts;

    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        optionGroups
          ? column.filters.map((option, oIndex) => {
              const optionValue = option.data;
              const props = createProps(renderOpts, optionValue);

              return h(
                resolveComponent('a-select') as ComponentOptions,
                {
                  key: oIndex,
                  ...attrs,
                  ...props,
                  ...createEvents(
                    renderOpts,
                    params,
                    (value: any) => {
                      // 处理 model 值双向绑定
                      option.data = value;
                    },
                    () => {
                      // 处理 change 事件相关逻辑
                      const { $panel } = params;
                      $panel.changeOption(
                        null,
                        props.mode === 'multiple'
                          ? option.data && option.data.length > 0
                          : !XEUtils.eqNull(option.data),
                        option,
                      );
                    },
                  ),
                },
                {
                  default: () => {
                    return XEUtils.map(optionGroups, (group, gIndex) => {
                      return h(
                        resolveComponent('a-select-opt-group') as ComponentOptions,
                        {
                          key: gIndex,
                        },
                        {
                          label: () => {
                            return h('span', {}, group[groupLabel]);
                          },
                          default: () => renderOptions(group[groupOptions], optionProps),
                        },
                      );
                    });
                  },
                },
              );
            })
          : column.filters.map((option, oIndex) => {
              const optionValue = option.data;
              const props = createProps(renderOpts, optionValue);
              return h(
                resolveComponent('a-select') as ComponentOptions,
                {
                  key: oIndex,
                  ...attrs,
                  ...props,
                  ...createEvents(
                    renderOpts,
                    params,
                    (value: any) => {
                      // 处理 model 值双向绑定
                      option.data = value;
                    },
                    () => {
                      // 处理 change 事件相关逻辑
                      const { $panel } = params;
                      $panel.changeOption(
                        null,
                        props.mode === 'multiple'
                          ? option.data && option.data.length > 0
                          : !XEUtils.eqNull(option.data),
                        option,
                      );
                    },
                  ),
                },
                {
                  default: () => renderOptions(options, optionProps),
                },
              );
            }),
      ),
    ];
  };
}

export default {
  renderTableEdit: createEditRender(),
  renderTableCell: createCellRender(getSelectCellValue),
  renderTableFilter: createFilterRender(),
  tableFilterDefaultMethod(params) {
    const { option, row, column } = params;
    const { data } = option;
    const { field, filterRender: renderOpts } = column;
    const { props = {} } = renderOpts;
    const cellValue = XEUtils.get(row, field);
    if (props.mode === 'multiple') {
      if (XEUtils.isArray(cellValue)) {
        return XEUtils.includeArrays(cellValue, data);
      }
      return data.indexOf(cellValue) > -1;
    }
    return cellValue == data;
  },
  renderFormItemContent: createFormItemRender(),
  tableExportMethod: createExportMethod(getSelectCellValue),
} as VxeGlobalRendererOptions;
