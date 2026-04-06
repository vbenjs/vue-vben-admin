type PresetSchema = Record<string, any>;

const search = (
  key: string,
  label: string,
  order: number,
  placeholder?: string,
  size?: 'normal' | 'wide' | 'xwide',
) => ({
  key,
  label,
  order,
  placeholder,
  size,
  visible: true,
});

const column = (
  key: string,
  dataIndex: string,
  label: string,
  order: number,
  width: number,
) => ({
  dataIndex,
  key,
  label,
  order,
  visible: true,
  width,
});

const toolbar = (key: string, label: string, order: number) => ({
  key,
  label,
  order,
  visible: true,
});

const section = (key: string, id: string, label: string, order: number) => ({
  id,
  key,
  label,
  order,
  visible: true,
});

export type TemplatePreset = {
  pageCode: string;
  pageName: string;
  routePath: string;
  schema: PresetSchema;
};

export const templateRouteMap: Record<string, string> = {
  'finance.income-settlement': '/finance/income-settlement',
  'finance.invoice-folder': '/finance/invoice-folder',
  'finance.reimbursement.query': '/finance/reimbursement',
};

export const pilotTemplatePresets: TemplatePreset[] = [
  {
    pageCode: 'finance.reimbursement.query',
    pageName: '报销单查询',
    routePath: '/finance/reimbursement',
    schema: {
      layout: { dialogMode: 'none', type: 'legacy-list' },
      search: [
        search('search.category', '报账类型', 10, '请选择报账类型', 'wide'),
        search('search.dateRange', '业务日期', 20, undefined, 'wide'),
        search('search.billNo', '报账单号', 30, '请输入报账单号', 'wide'),
        search('search.applicant', '申请人', 40, '请输入申请人'),
        search('search.keyword', '事项内容', 50, '请输入事项内容', 'wide'),
        search('search.status', '状态', 60, '请选择状态'),
      ],
      table: {
        columns: [
          column('table.status', 'status', '状态', 10, 90),
          column('table.billNo', 'billNo', '单据号', 20, 180),
          column('table.claimType', 'claimType', '单据类型', 30, 190),
          column('table.projectSummary', 'projectSummary', '预算项目+子项目', 40, 210),
          column('table.usage', 'usage', '资金用途', 50, 220),
          column('table.applicant', 'applicant', '申请人', 60, 120),
          column('table.billTime', 'billTime', '填报时间', 70, 160),
          column('table.amount', 'amount', '申请金额(元)', 80, 130),
          column('table.flowNode', 'flowNode', '流程节点', 90, 130),
          column('table.isSupplement', 'isSupplement', '是否补录', 100, 100),
          column('table.createTime', 'createTime', '创建时间', 110, 180),
          column('table.progress', 'progress', '进度', 120, 90),
        ],
      },
      toolbar: [
        toolbar('toolbar.detail', '详情', 10),
        toolbar('toolbar.history', '审核历史', 20),
        toolbar('toolbar.refresh', '刷新', 30),
      ],
    },
  },
  {
    pageCode: 'finance.income-settlement',
    pageName: '收入结算单',
    routePath: '/finance/income-settlement',
    schema: {
      form: {
        sections: [
          section('form.basic', 'income-basic-section', '基本信息', 10),
          section('form.payee', 'income-payee-section', '收款人', 20),
          section('form.related', 'income-related-section', '关联报销单', 30),
          section('form.attachment', 'income-attachment-section', '附件', 40),
          section('form.invoice', 'income-invoice-section', '电子发票', 50),
        ],
      },
      layout: { dialogMode: 'fullscreen', type: 'legacy-crud' },
      search: [
        search('search.keyword', '关键字', 10, '结算单号/收款人/发票号', 'xwide'),
        search('search.deptName', '部门', 20, '部门', 'wide'),
        search('search.receiptMethod', '收款方式', 30, '收款方式'),
        search('search.status', '状态', 40, '状态'),
      ],
      table: {
        columns: [
          column('table.status', 'status', '状态', 10, 90),
          column('table.billNo', 'billNo', '结算单号', 20, 170),
          column('table.payeeName', 'payeeName', '收款人', 30, 140),
          column('table.deptName', 'deptName', '部门', 40, 170),
          column('table.content', 'content', '收款内容', 50, 240),
          column('table.receiptMethod', 'receiptMethod', '收款方式', 60, 130),
          column('table.amount', 'amount', '收款金额', 70, 130),
          column('table.invoiceNo', 'invoiceNo', '发票号码', 80, 170),
          column('table.fillDate', 'fillDate', '填报日期', 90, 130),
          column('table.createTime', 'createTime', '创建时间', 100, 180),
        ],
      },
      toolbar: [
        toolbar('toolbar.add', '新增收入结算单', 10),
        toolbar('toolbar.edit', '修改', 20),
        toolbar('toolbar.detail', '详情', 30),
        toolbar('toolbar.delete', '删除', 40),
        toolbar('toolbar.invoiceFolder', '发票夹', 50),
      ],
    },
  },
  {
    pageCode: 'finance.invoice-folder',
    pageName: '发票夹',
    routePath: '/finance/invoice-folder',
    schema: {
      layout: { dialogMode: 'popup', type: 'legacy-master-detail' },
      search: [
        search('search.folderName', '发票夹', 10, '全部'),
        search('search.keyword', '关键字', 20, '请输入搜索内容', 'wide'),
      ],
      table: {
        columns: [
          column('table.sourceType', 'sourceType', '来源', 10, 100),
          column('table.useStatus', 'useStatus', '票据状态', 20, 110),
          column('table.invoiceType', 'invoiceType', '票据类型', 30, 170),
          column('table.code', 'code', '票据代码', 40, 150),
          column('table.invoiceNo', 'invoiceNo', '发票号码', 50, 190),
          column('table.amount', 'amount', '金额', 60, 120),
          column('table.userName', 'userName', '提交人', 70, 110),
          column('table.verifierStatus', 'verifierStatus', '识别状态', 80, 110),
          column('table.property', 'property', '属性', 90, 100),
          column('table.createTime', 'createTime', '上传时间', 100, 180),
        ],
      },
      toolbar: [
        toolbar('toolbar.add', '新增发票', 10),
        toolbar('toolbar.delete', '删除发票', 20),
        toolbar('toolbar.preview', '查看文件', 30),
        toolbar('toolbar.restore', '发票还原', 40),
        toolbar('toolbar.reRecognize', '重新识别发票', 50),
        toolbar('toolbar.fixRecognize', '修改无法识别发票', 60),
        toolbar('toolbar.auth', '授权/取消授权', 70),
        toolbar('toolbar.authHistory', '授权记录', 80),
      ],
    },
  },
];
