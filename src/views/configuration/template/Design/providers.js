/* eslint-disable */
import { hiprint } from 'vue-plugin-hiprint'

// 自定义设计元素1
export const aProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes("aProviderModule");
    context.addPrintElementTypes(
      "aProviderModule",
      [
        new hiprint.PrintElementTypeGroup("平台", [
          {
            tid: 'aProviderModule.header', title: '单据表头', data: '单据表头', type: 'text',
            options: {
              testData: '单据表头',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'aProviderModule.type', title: '单据类型', data: '单据类型', type: 'text',
            options: {
              testData: '单据类型',
              height: 16,
              fontSize: 15,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'aProviderModule.order', title: '订单编号', data: 'XS888888888', type: 'text',
            options: {
              field: 'orderId',
              testData: 'XS888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'aProviderModule.date', title: '业务日期', data: '2020-01-01', type: 'text',
            options: {
              field: 'date',
              testData: '2020-01-01',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'aProviderModule.barcode', title: '条形码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "barcode"
            }
          },
          {
            tid: 'aProviderModule.qrcode', title: '二维码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              width: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "qrcode"
            }
          },
          {
            tid: 'aProviderModule.platform', title: '平台名称', data: '平台名称', type: 'text',
            options: {
              testData: '平台名称',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'aProviderModule.logo', title: 'Logo', data: '', type: 'image', options: {
              "field": "pic",
              "src": 'https://aliyuncdn.antdv.com/vue.png',
              width: 32,
              height: 32,
            }
          },
        ]),
        new hiprint.PrintElementTypeGroup("库管", [
          {
            tid: 'aProviderModule.creater', title: '制单人', data: '李四', type: 'text',
            options: {
              field: 'creater',
              testData: '李四',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'aProviderModule.printDate', title: '打印时间', data: '2022-01-01 09:00', type: 'text',
            options: {
              field: 'printDate',
              testData: '2022-01-01 09:00',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'aProviderModule.signer', title: '库管签字', data: '', type: 'text',
            options: {
              title: '库管签字：',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
        ]),
        new hiprint.PrintElementTypeGroup("表格/其他", [
          {
            tid: 'aProviderModule.table', title: '订单数据',
            type: 'table',
            options: {
              field: 'table',
              tableHeaderRepeat: 'first',
              tableFooterRepeat: 'last',
              fields: [
                { text: '名称', field: 'NAME' },
                { text: '数量', field: 'SL' },
                { text: '规格', field: 'GG' },
                { text: '条码', field: 'TM' },
                { text: '单价', field: 'DJ' },
                { text: '金额', field: 'JE' },
              ],
            },
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            isEnableEditField: true, //编辑字段
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                { title: '名称', align: 'center', field: 'NAME', width: 150 },
                { title: '数量', align: 'center', field: 'SL', width: 80 },
                { title: '规格', align: 'center', field: 'GG', width: 80, checked: false },
                { title: '条码', align: 'center', field: 'TM', width: 100, checked: false },
                { title: '单价', align: 'center', field: 'DJ', width: 100 },
                { title: '金额', align: 'center', field: 'JE', width: 100, checked: false },
              ],
            ],
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data && data['totalCap']) {
                return `<td style="padding:0 10px" colspan="100">${'应收金额大写: ' + data['totalCap']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">应收金额大写: </td>'
            },
          },
          {
            tid: 'aProviderModule.customText', title: '文本', customText: '自定义文本', custom: true, type: 'text',
            options: {
            }
          },
          {
            tid: 'aProviderModule.longText', title: '长文本', type: 'longText', options: {
              field: 'test.longText',
              width: 200,
              testData: '长文本分页/不分页测试'
            },
          }
        ]),
        new hiprint.PrintElementTypeGroup("辅助", [
          {
            tid: 'aProviderModule.hline',
            title: '横线',
            type: 'hline'
          },
          {
            tid: 'aProviderModule.vline',
            title: '竖线',
            type: 'vline'
          },
          {
            tid: 'aProviderModule.rect',
            title: '矩形',
            type: 'rect'
          },
          {
            tid: 'aProviderModule.oval',
            title: '椭圆',
            type: 'oval'
          }
        ])
      ]
    );
  };
  return {
    addElementTypes: addElementTypes
  };
};

// 自定义设计元素2
export const bProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes("bProviderModule");
    context.addPrintElementTypes(
      "bProviderModule",
      [
        new hiprint.PrintElementTypeGroup("常规", [
          {
            tid: 'bProviderModule.header', title: '单据表头', data: '单据表头', type: 'text',
            options: {
              testData: '单据表头',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'bProviderModule.type', title: '单据类型', data: '单据类型', type: 'text',
            options: {
              testData: '单据类型',
              height: 16,
              fontSize: 15,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'bProviderModule.order', title: '订单编号', data: 'XS888888888', type: 'text',
            options: {
              field: 'orderId',
              testData: 'XS888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.date', title: '业务日期', data: '2020-01-01', type: 'text',
            options: {
              field: 'date',
              testData: '2020-01-01',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.barcode', title: '条形码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "barcode"
            }
          },
          {
            tid: 'bProviderModule.qrcode', title: '二维码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "qrcode"
            }
          },
          {
            tid: 'bProviderModule.platform', title: '平台名称', data: '平台名称', type: 'text',
            options: {
              testData: '平台名称',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          { tid: 'bProviderModule.image', title: 'Logo', data: '', type: 'image' },
        ]),
        new hiprint.PrintElementTypeGroup("客户", [
          {
            tid: 'bProviderModule.khname', title: '客户名称', data: '高级客户', type: 'text',
            options: {
              field: 'name',
              testData: '高级客户',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.tel', title: '客户电话', data: '18888888888', type: 'text',
            options: {
              field: 'tel',
              testData: '18888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
        ]),
        new hiprint.PrintElementTypeGroup("表格/其他", [
          {
            tid: 'bProviderModule.table', title: '订单数据',
            type: 'tableCustom',
            options: {
              field: 'table',
              fields: [
                { text: '名称', field: 'NAME' },
                { text: '数量', field: 'SL' },
                { text: '规格', field: 'GG' },
                { text: '条码', field: 'TM' },
                { text: '单价', field: 'DJ' },
                { text: '金额', field: 'JE' },
                { text: '备注', field: 'DETAIL' },
              ],
            },
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            columns: [
              [
                { title: '名称', align: 'center', field: 'NAME', width: 100 },
                { title: '数量', align: 'center', field: 'SL', width: 100 },
                { title: '条码', align: 'center', field: 'TM', width: 100 },
                { title: '规格', align: 'center', field: 'GG', width: 100 },
                { title: '单价', align: 'center', field: 'DJ', width: 100 },
                { title: '金额', align: 'center', field: 'JE', width: 100 },
                { title: '备注', align: 'center', field: 'DETAIL', width: 100 },
              ]
            ],
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data && data['totalCap']) {
                return `<td style="padding:0 10px" colspan="100">${'应收金额大写: ' + data['totalCap']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">应收金额大写: </td>'
            },
          },
          { tid: 'bProviderModule.customText', title: '文本', customText: '自定义文本', custom: true, type: 'text' },
          {
            tid: 'bProviderModule.longText', title: '长文本', type: 'longText', options: {
              field: 'test.longText',
              width: 200,
              testData: '长文本分页/不分页测试'
            },
          }
        ]),
        new hiprint.PrintElementTypeGroup("辅助", [
          {
            tid: 'bProviderModule.hline',
            title: '横线',
            type: 'hline'
          },
          {
            tid: 'bProviderModule.vline',
            title: '竖线',
            type: 'vline'
          },
          {
            tid: 'bProviderModule.rect',
            title: '矩形',
            type: 'rect'
          },
          {
            tid: 'bProviderModule.oval',
            title: '椭圆',
            type: 'oval'
          }
        ])
      ]
    );
  };
  return {
    addElementTypes: addElementTypes
  };
};

// type: 1供货商 2经销商
export default [{
  name: 'A设计',
  value: 'aProviderModule',
  type: 1,
  f: aProvider()
}, {
  name: 'B设计',
  value: 'bProviderModule',
  type: 2,
  f: bProvider()
}]
