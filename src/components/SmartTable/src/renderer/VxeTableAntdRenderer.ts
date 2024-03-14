import { h, resolveComponent, ComponentOptions } from 'vue';
import XEUtils, { isArray, isString } from 'xe-utils';
import './VxeTableAntRenderer.css';
import {
  VXETableCore,
  VxeTableDefines,
  VxeColumnPropTypes,
  VxeGlobalRendererHandles,
  VxeGlobalInterceptorHandles,
  FormItemRenderOptions,
  FormItemContentRenderParams,
} from 'vxe-table';

function isEmptyValue(cellValue: any) {
  return cellValue === null || cellValue === undefined || cellValue === '';
}

function getOnName(type: string) {
  return 'on' + type.substring(0, 1).toLocaleUpperCase() + type.substring(1);
}

function getModelProp(renderOpts: VxeGlobalRendererHandles.RenderOptions) {
  let prop = 'value';
  switch (renderOpts.name) {
    case 'ASwitch':
      prop = 'checked';
      break;
  }
  return prop;
}

function getModelEvent(renderOpts: VxeGlobalRendererHandles.RenderOptions) {
  let type = 'update:value';
  switch (renderOpts.name) {
    case 'ASwitch':
      type = 'update:checked';
      break;
  }
  return type;
}

function getChangeEvent(_: VxeGlobalRendererHandles.RenderOptions) {
  return 'change';
}

function getCellEditFilterProps(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  _: VxeGlobalRendererHandles.RenderEditParams | VxeGlobalRendererHandles.RenderFilterParams,
  value: any,
  defaultProps?: { [prop: string]: any },
  row?: any,
) {
  const props = XEUtils.isFunction(renderOpts.props) ? renderOpts.props(row) : renderOpts.props;
  return XEUtils.assign({}, defaultProps, props, { [getModelProp(renderOpts)]: value });
}

function getItemProps(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  _: FormItemContentRenderParams,
  value: any,
  defaultProps?: { [prop: string]: any },
) {
  return XEUtils.assign({}, defaultProps, renderOpts.props, { [getModelProp(renderOpts)]: value });
}

function formatText(cellValue: any) {
  return '' + (isEmptyValue(cellValue) ? '' : cellValue);
}

function getCellLabelVNs(
  renderOpts: VxeColumnPropTypes.EditRender,
  _: VxeGlobalRendererHandles.RenderCellParams,
  cellLabel: any,
) {
  const { placeholder } = renderOpts;
  return [
    h(
      'span',
      {
        class: 'vxe-cell--label',
      },
      placeholder && isEmptyValue(cellLabel)
        ? [
            h(
              'span',
              {
                class: 'vxe-cell--placeholder',
              },
              formatText(placeholder),
            ),
          ]
        : formatText(cellLabel),
    ),
  ];
}

function getOns(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderParams,
  inputFunc?: Function,
  changeFunc?: Function,
) {
  const { events } = renderOpts;
  const modelEvent = getModelEvent(renderOpts);
  const changeEvent = getChangeEvent(renderOpts);
  const isSameEvent = changeEvent === modelEvent;
  const ons: { [type: string]: Function } = {};
  XEUtils.objectEach(events, (func: Function, key: string) => {
    ons[getOnName(key)] = function (...args: any[]) {
      func(params, ...args);
    };
  });
  if (inputFunc) {
    ons[getOnName(modelEvent)] = function (targetEvnt: any) {
      inputFunc(targetEvnt);
      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt);
      }
      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt);
      }
    };
  }
  if (!isSameEvent && changeFunc) {
    ons[getOnName(changeEvent)] = function (...args: any[]) {
      changeFunc(...args);
      if (events && events[changeEvent]) {
        events[changeEvent](params, ...args);
      }
    };
  }
  return ons;
}

function getEditOns(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderEditParams,
) {
  const { $table, row, column } = params;
  return getOns(
    renderOpts,
    params,
    (value: any) => {
      // 处理 model 值双向绑定
      XEUtils.set(row, column.field, value);
    },
    () => {
      // 处理 change 事件相关逻辑
      $table.updateStatus(params);
    },
  );
}

function getFilterOns(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderFilterParams,
  option: VxeTableDefines.FilterOption,
  changeFunc: Function,
) {
  return getOns(
    renderOpts,
    params,
    (value: any) => {
      // 处理 model 值双向绑定
      option.data = value;
    },
    changeFunc,
  );
}

function getItemOns(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: FormItemContentRenderParams,
) {
  const { $form, data, field } = params;
  return getOns(
    renderOpts,
    params,
    (value: any) => {
      // 处理 model 值双向绑定
      XEUtils.set(data, field, value);
    },
    () => {
      // 处理 change 事件相关逻辑
      $form.updateStatus(params);
    },
  );
}

function matchCascaderData(index: number, list: any[], values: any[], labels: any[]) {
  const val = values[index];
  if (list && values.length > index) {
    XEUtils.each(list, (item) => {
      if (item.value === val) {
        labels.push(item.label);
        matchCascaderData(++index, item.children, values, labels);
      }
    });
  }
}

function formatDatePicker(defaultFormat: string) {
  return function (
    renderOpts: VxeColumnPropTypes.EditRender,
    params: VxeGlobalRendererHandles.RenderCellParams,
  ) {
    return getCellLabelVNs(
      renderOpts,
      params,
      getDatePickerCellValue(renderOpts, params, defaultFormat),
    );
  };
}

function getSelectCellValue(
  renderOpts: VxeColumnPropTypes.EditRender,
  params: VxeGlobalRendererHandles.RenderCellParams,
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
  const cellValue = XEUtils.get(row, column.field);
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

function getCascaderCellValue(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderCellParams | VxeGlobalRendererHandles.ExportMethodParams,
) {
  const { props = {} } = renderOpts;
  const { row, column } = params;
  const cellValue = XEUtils.get(row, column.field);
  const values = cellValue || [];
  const labels: Array<any> = [];
  matchCascaderData(0, props.options, values, labels);
  return (
    props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels
  ).join(` ${props.separator || '/'} `);
}

function getRangePickerCellValue(
  renderOpts: VxeColumnPropTypes.EditRender,
  params: VxeGlobalRendererHandles.RenderCellParams | VxeGlobalRendererHandles.RenderEditParams,
) {
  const { props = {} } = renderOpts;
  const { row, column } = params;
  let cellValue = XEUtils.get(row, column.field);
  if (cellValue) {
    cellValue = XEUtils.map(cellValue, (date: any) =>
      date.format(props.format || 'YYYY-MM-DD'),
    ).join(' ~ ');
  }
  return cellValue;
}

function getTreeSelectCellValue(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderCellParams | VxeGlobalRendererHandles.RenderEditParams,
) {
  const { props = {} } = renderOpts;
  const { treeData, treeCheckable } = props;
  const { row, column } = params;
  const cellValue = XEUtils.get(row, column.field);
  if (!isEmptyValue(cellValue)) {
    return XEUtils.map(treeCheckable ? cellValue : [cellValue], (value) => {
      const matchObj = XEUtils.findTree(treeData, (item: any) => item.value === value, {
        children: 'children',
      });
      return matchObj ? matchObj.item.title : value;
    }).join(', ');
  }
  return cellValue;
}

function getDatePickerCellValue(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderCellParams | VxeGlobalRendererHandles.ExportMethodParams,
  defaultFormat: string,
) {
  const { props = {} } = renderOpts;
  const { row, column } = params;
  let cellValue = XEUtils.get(row, column.field);
  if (isString(cellValue)) {
    return cellValue;
  }
  if (cellValue) {
    let format = defaultFormat;
    if (props.tableFormat) {
      format = props.tableFormat;
    } else if (props.format) {
      if (isArray(props.format) && props.format.length > 0) {
        format = props.format[0];
      } else {
        format = props.format as string;
      }
    }
    cellValue = cellValue.format(format);
  }
  return cellValue;
}

function createEditRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.EditRender & { name: string },
    params: VxeGlobalRendererHandles.RenderEditParams,
  ) {
    const { row, column } = params;
    const { name, attrs } = renderOpts;
    const cellValue = XEUtils.get(row, column.field);
    return [
      h(resolveComponent(name), {
        ...attrs,
        ...getCellEditFilterProps(renderOpts, params, cellValue, defaultProps, row),
        ...getEditOns(renderOpts, params),
      }),
    ];
  };
}

function defaultButtonEditRender(
  renderOpts: VxeColumnPropTypes.EditRender,
  params: VxeGlobalRendererHandles.RenderEditParams,
) {
  const { attrs } = renderOpts;
  return [
    h(
      resolveComponent('a-button'),
      {
        ...attrs,
        ...getCellEditFilterProps(renderOpts, params, null),
        ...getOns(renderOpts, params),
      },
      cellText(renderOpts.content),
    ),
  ];
}

function defaultButtonsEditRender(
  renderOpts: VxeColumnPropTypes.EditRender,
  params: VxeGlobalRendererHandles.RenderEditParams,
) {
  const { children } = renderOpts;
  if (children) {
    return children.map(
      (childRenderOpts: VxeColumnPropTypes.EditRender) =>
        defaultButtonEditRender(childRenderOpts, params)[0],
    );
  }
  return [];
}

function createFilterRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: VxeColumnPropTypes.FilterRender & { name: string },
    params: VxeGlobalRendererHandles.RenderFilterParams,
  ) {
    const { column } = params;
    const { name, attrs } = renderOpts;
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        column.filters.map((option, oIndex) => {
          const optionValue = option.data;
          return h(resolveComponent(name), {
            key: oIndex,
            ...attrs,
            ...getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
            ...getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, !!option.data, option);
            }),
          });
        }),
      ),
    ];
  };
}

function handleConfirmFilter(
  params: VxeGlobalRendererHandles.RenderFilterParams,
  checked: boolean,
  option: VxeTableDefines.FilterOption,
) {
  const { $panel } = params;
  $panel.changeOption(null, checked, option);
}

/**
 * 模糊匹配
 * @param params
 */
function defaultFuzzyFilterMethod(params: VxeGlobalRendererHandles.FilterMethodParams) {
  const { option, row, column } = params;
  const { data } = option;
  const cellValue = XEUtils.get(row, column.field);
  return XEUtils.toValueString(cellValue).indexOf(data) > -1;
}

/**
 * 精确匹配
 * @param params
 */
function defaultExactFilterMethod(params: VxeGlobalRendererHandles.FilterMethodParams) {
  const { option, row, column } = params;
  const { data } = option;
  const cellValue = XEUtils.get(row, column.field);
  /* eslint-disable eqeqeq */
  return cellValue === data;
}

function cellText(cellValue: any): string[] {
  return [formatText(cellValue)];
}

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

function createFormItemRender(defaultProps?: { [key: string]: any }) {
  return function (
    renderOpts: FormItemRenderOptions & { name: string },
    params: FormItemContentRenderParams,
  ) {
    const { data, field } = params;
    const { name } = renderOpts;
    const { attrs } = renderOpts;
    const itemValue = XEUtils.get(data, field);
    return [
      h(resolveComponent(name), {
        ...attrs,
        ...getItemProps(renderOpts, params, itemValue, defaultProps),
        ...getItemOns(renderOpts, params),
      }),
    ];
  };
}

function defaultButtonItemRender(
  renderOpts: FormItemRenderOptions,
  params: FormItemContentRenderParams,
) {
  const { attrs } = renderOpts;
  const props = getItemProps(renderOpts, params, null);
  return [
    h(
      resolveComponent('a-button') as ComponentOptions,
      {
        ...attrs,
        ...props,
        ...getItemOns(renderOpts, params),
      },
      {
        default: () => cellText(renderOpts.content || props.content),
      },
    ),
  ];
}

function defaultButtonsItemRender(
  renderOpts: FormItemRenderOptions,
  params: FormItemContentRenderParams,
) {
  const { children } = renderOpts;
  if (children) {
    return children.map(
      (childRenderOpts: FormItemRenderOptions) =>
        defaultButtonItemRender(childRenderOpts, params)[0],
    );
  }
  return [];
}

function createDatePickerExportMethod(defaultFormat: string) {
  return function (params: VxeGlobalRendererHandles.ExportMethodParams) {
    const { row, column, options } = params;
    return options && options.original
      ? XEUtils.get(row, column.field)
      : getDatePickerCellValue(column.editRender || column.cellRender, params, defaultFormat);
  };
}

function createExportMethod(getExportCellValue: Function) {
  return function (params: VxeGlobalRendererHandles.ExportMethodParams) {
    const { row, column, options } = params;
    return options && options.original
      ? XEUtils.get(row, column.field)
      : getExportCellValue(column.editRender || column.cellRender, params);
  };
}

function createFormItemRadioAndCheckboxRender() {
  return function (
    renderOpts: FormItemRenderOptions & { name: string },
    params: FormItemContentRenderParams,
  ) {
    const { name, options = [], optionProps = {} } = renderOpts;
    const { data, field } = params;
    const { attrs } = renderOpts;
    const labelProp = optionProps.label || 'label';
    const valueProp = optionProps.value || 'value';
    const itemValue = XEUtils.get(data, field);
    return [
      h(
        resolveComponent(`${name}Group`) as ComponentOptions,
        {
          ...attrs,
          ...getItemProps(renderOpts, params, itemValue),
          ...getItemOns(renderOpts, params),
        },
        {
          default: () => {
            return options.map((option, oIndex) => {
              return h(
                resolveComponent(name) as ComponentOptions,
                {
                  key: oIndex,
                  value: option[valueProp],
                  disabled: option.disabled,
                },
                {
                  default: () => cellText(option[labelProp]),
                },
              );
            });
          },
        },
      ),
    ];
  };
}

/**
 * 检查触发源是否属于目标节点
 */
function getEventTargetNode(evnt: any, container: HTMLElement, className: string) {
  let targetElem;
  let target = evnt.target;
  while (target && target.nodeType && target !== document) {
    if (
      className &&
      target.className &&
      target.className.split &&
      target.className.split(' ').indexOf(className) > -1
    ) {
      targetElem = target;
    } else if (target === container) {
      return { flag: className ? !!targetElem : true, container, targetElem: targetElem };
    }
    target = target.parentNode;
  }
  return { flag: false };
}

/**
 * 事件兼容性处理
 */
function handleClearEvent(
  params:
    | VxeGlobalInterceptorHandles.InterceptorClearFilterParams
    | VxeGlobalInterceptorHandles.InterceptorClearActivedParams
    | VxeGlobalInterceptorHandles.InterceptorClearAreasParams,
) {
  const { $event } = params;
  const bodyElem = document.body;
  if (
    // 下拉框
    getEventTargetNode($event, bodyElem, 'ant-select-dropdown').flag ||
    // 级联
    getEventTargetNode($event, bodyElem, 'ant-cascader-menus').flag ||
    // 日期
    getEventTargetNode($event, bodyElem, 'ant-picker-dropdown').flag ||
    getEventTargetNode($event, bodyElem, 'ant-calendar-picker-container').flag ||
    // 时间选择
    getEventTargetNode($event, bodyElem, 'ant-time-picker-panel').flag
  ) {
    return false;
  }
}

/**
 * 基于 vxe-table 的表格适配插件，用于兼容 ant-design-vue 组件库
 */
export const VXETablePluginAntd = {
  install(vxetable: VXETableCore) {
    // 检查版本
    if (!/^(4)\./.test(vxetable.version)) {
      console.error('[vxe-table-plugin-antd] Version vxe-table 4.x is required');
    }

    vxetable.renderer.mixin({
      AAutoComplete: {
        autofocus: 'input.ant-input',
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: createFilterRender(),
        defaultFilterMethod: defaultExactFilterMethod,
        renderItemContent: createFormItemRender(),
      },
      AInput: {
        autofocus: 'input.ant-input',
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: createFilterRender(),
        defaultFilterMethod: defaultFuzzyFilterMethod,
        renderItemContent: createFormItemRender(),
      },
      AInputNumber: {
        autofocus: 'input.ant-input-number-input',
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: createFilterRender(),
        defaultFilterMethod: defaultFuzzyFilterMethod,
        renderItemContent: createFormItemRender(),
      },
      ASelect: {
        renderEdit(renderOpts, params) {
          const {
            options = [],
            optionGroups,
            optionProps = {},
            optionGroupProps = {},
          } = renderOpts;
          const { row, column } = params;
          const { attrs } = renderOpts;
          const cellValue = XEUtils.get(row, column.field);
          const props = getCellEditFilterProps(renderOpts, params, cellValue, undefined, row);
          const ons = getEditOns(renderOpts, params);
          if (optionGroups) {
            const groupOptions = optionGroupProps.options || 'options';
            const groupLabel = optionGroupProps.label || 'label';
            return [
              h(
                resolveComponent('a-select') as ComponentOptions,
                {
                  ...props,
                  ...attrs,
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
        },
        renderCell(renderOpts, params) {
          return getCellLabelVNs(renderOpts, params, getSelectCellValue(renderOpts, params));
        },
        renderFilter(renderOpts, params) {
          const {
            options = [],
            optionGroups,
            optionProps = {},
            optionGroupProps = {},
          } = renderOpts;
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
                    const props = getCellEditFilterProps(renderOpts, params, optionValue);
                    return h(
                      resolveComponent('a-select') as ComponentOptions,
                      {
                        key: oIndex,
                        ...attrs,
                        ...props,
                        ...getFilterOns(renderOpts, params, option, () => {
                          // 处理 change 事件相关逻辑
                          handleConfirmFilter(
                            params,
                            props.mode === 'multiple'
                              ? option.data && option.data.length > 0
                              : !XEUtils.eqNull(option.data),
                            option,
                          );
                        }),
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
                    const props = getCellEditFilterProps(renderOpts, params, optionValue);
                    return h(
                      resolveComponent('a-select') as ComponentOptions,
                      {
                        key: oIndex,
                        ...attrs,
                        ...props,
                        ...getFilterOns(renderOpts, params, option, () => {
                          // 处理 change 事件相关逻辑
                          handleConfirmFilter(
                            params,
                            props.mode === 'multiple'
                              ? option.data && option.data.length > 0
                              : !XEUtils.eqNull(option.data),
                            option,
                          );
                        }),
                      },
                      {
                        default: () => renderOptions(options, optionProps),
                      },
                    );
                  }),
            ),
          ];
        },
        defaultFilterMethod(params) {
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
          /* eslint-disable eqeqeq */
          return cellValue == data;
        },
        renderItemContent(renderOpts, params) {
          const {
            options = [],
            optionGroups,
            optionProps = {},
            optionGroupProps = {},
          } = renderOpts;
          const { data, field } = params;
          const { attrs } = renderOpts;
          const itemValue = XEUtils.get(data, field);
          const props = getItemProps(renderOpts, params, itemValue);
          const ons = getItemOns(renderOpts, params);
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
                ...attrs,
                ...props,
                ...ons,
              },
              {
                default: () => renderOptions(options, optionProps),
              },
            ),
          ];
        },
        exportMethod: createExportMethod(getSelectCellValue),
      },
      ACascader: {
        renderEdit: createEditRender(),
        renderCell(renderOpts, params) {
          return getCellLabelVNs(renderOpts, params, getCascaderCellValue(renderOpts, params));
        },
        renderItemContent: createFormItemRender(),
        exportMethod: createExportMethod(getCascaderCellValue),
      },
      ADatePicker: {
        renderEdit: createEditRender(),
        renderCell: formatDatePicker('YYYY-MM-DD'),
        renderItemContent: createFormItemRender(),
        exportMethod: createDatePickerExportMethod('YYYY-MM-DD'),
      },
      AMonthPicker: {
        renderEdit: createEditRender(),
        renderCell: formatDatePicker('YYYY-MM'),
        renderItemContent: createFormItemRender(),
        exportMethod: createDatePickerExportMethod('YYYY-MM'),
      },
      ARangePicker: {
        renderEdit: createEditRender(),
        renderCell(renderOpts, params) {
          return getCellLabelVNs(renderOpts, params, getRangePickerCellValue(renderOpts, params));
        },
        renderItemContent: createFormItemRender(),
        exportMethod: createExportMethod(getRangePickerCellValue),
      },
      AWeekPicker: {
        renderEdit: createEditRender(),
        renderCell: formatDatePicker('YYYY-WW周'),
        renderItemContent: createFormItemRender(),
        exportMethod: createDatePickerExportMethod('YYYY-WW周'),
      },
      ATimePicker: {
        renderEdit: createEditRender(),
        renderCell: formatDatePicker('HH:mm:ss'),
        renderItemContent: createFormItemRender(),
        exportMethod: createDatePickerExportMethod('HH:mm:ss'),
      },
      ATreeSelect: {
        renderEdit: createEditRender(),
        renderCell(renderOpts, params) {
          return getCellLabelVNs(renderOpts, params, getTreeSelectCellValue(renderOpts, params));
        },
        renderItemContent: createFormItemRender(),
        exportMethod: createExportMethod(getTreeSelectCellValue),
      },
      ARate: {
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter: createFilterRender(),
        defaultFilterMethod: defaultExactFilterMethod,
        renderItemContent: createFormItemRender(),
      },
      ASwitch: {
        autofocus: 'button.ant-switch',
        renderDefault: createEditRender(),
        renderEdit: createEditRender(),
        renderFilter(renderOpts, params) {
          const { column } = params;
          const { name, attrs } = renderOpts;
          return [
            h(
              'div',
              {
                class: 'vxe-table--filter-antd-wrapper',
              },
              column.filters.map((option, oIndex) => {
                const optionValue = option.data;
                return h(name as string, {
                  key: oIndex,
                  ...attrs,
                  ...getCellEditFilterProps(renderOpts, params, optionValue),
                  ...getFilterOns(renderOpts, params, option, () => {
                    // 处理 change 事件相关逻辑
                    handleConfirmFilter(params, XEUtils.isBoolean(option.data), option);
                  }),
                });
              }),
            ),
          ];
        },
        defaultFilterMethod: defaultExactFilterMethod,
        renderItemContent: createFormItemRender(),
      },
      ARadio: {
        renderItemContent: createFormItemRadioAndCheckboxRender(),
      },
      ACheckbox: {
        renderItemContent: createFormItemRadioAndCheckboxRender(),
      },
      AButton: {
        renderEdit: defaultButtonEditRender,
        renderDefault: defaultButtonEditRender,
        renderItemContent: defaultButtonItemRender,
      },
      AButtons: {
        renderEdit: defaultButtonsEditRender,
        renderDefault: defaultButtonsEditRender,
        renderItemContent: defaultButtonsItemRender,
      },
    });

    vxetable.interceptor.add('event.clearFilter', handleClearEvent);
    vxetable.interceptor.add('event.clearActived', handleClearEvent);
    vxetable.interceptor.add('event.clearAreas', handleClearEvent);
  },
};

if (typeof window !== 'undefined' && window.VXETable && window.VXETable.use) {
  window.VXETable.use(VXETablePluginAntd);
}

export default VXETablePluginAntd;
