/* eslint-disable */
import { hiprint, disAutoConnect } from 'vue-plugin-hiprint';
import { logo } from './image';

disAutoConnect();
// 自定义设计元素
export const provider = function (key: string, label: string, options: any[]) {
  var addElementTypes = function (context: any) {
    context.removePrintElementTypes(key);

    const list = [
      new hiprint.PrintElementTypeGroup('基础', [
        {
          tid: 'defaultModule.text',
          title: '文本',
          data: '文本',
          type: 'text',
          custom: true,
        },
        {
          tid: 'defaultModule.longText',
          title: '长文本',
          type: 'longText',
        },
        {
          tid: 'defaultModule.image',
          title: '图片',
          type: 'image',
          options: {
            src: logo,
          },
        },
        {
          tid: 'defaultModule.html',
          title: 'html',
          type: 'html',
          options: {
            formatter:
              'function(t,e){return\'<div style="height:50pt;width:50pt;background:red;border-radius: 50%;"></div>\'}',
          },
        },
        {
          tid: 'defaultModule.table',
          title: '表格',
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
          columnDisplayEditable: true, //列显示是否能编辑
          columnDisplayIndexEditable: true, //列顺序显示是否能编辑
          columnTitleEditable: true, //列标题是否能编辑
          columnResizable: true, //列宽是否能调整
          columnAlignEditable: true, //列对齐是否调整
          isEnableEditField: true, //编辑字段
          isEnableContextMenu: true, //开启右键菜单 默认true
          isEnableInsertRow: true, //插入行
          isEnableDeleteRow: true, //删除行
          isEnableInsertColumn: true, //插入列
          isEnableDeleteColumn: true, //删除列
          isEnableMergeCell: true, //合并单元格
          columns: [
            [
              { title: '', align: 'center', field: '', width: 30 },
              { title: '', align: 'center', field: '', width: 30 },
              { title: '', align: 'center', field: '', width: 30 },
            ],
          ],
        },
      ]),
      new hiprint.PrintElementTypeGroup('辅助', [
        {
          tid: 'defaultModule.hline',
          title: '横线',
          type: 'hline',
        },
        {
          tid: 'defaultModule.vline',
          title: '竖线',
          type: 'vline',
        },
        {
          tid: 'defaultModule.rect',
          title: '矩形',
          type: 'rect',
        },
        {
          tid: 'defaultModule.oval',
          title: '椭圆',
          type: 'oval',
        },
        {
          tid: 'defaultModule.barcode',
          title: '条形码',
          type: 'barcode',
        },
        {
          tid: 'defaultModule.qrcode',
          title: '二维码',
          type: 'text',
          options: {
            width: 60,
            height: 60,
            textType: 'qrcode',
          },
        },
      ]),
    ];

    if (label && options) {
      list.push(new hiprint.PrintElementTypeGroup(label, options));
    }

    context.addPrintElementTypes(key, list);
  };
  return {
    addElementTypes: addElementTypes,
  };
};

// // type: 1供货商 2经销商
// export default {
//   name: '设计',
//   value: 'aProviderModule',
//   type: 1,
//   // f: provider(),
// };
