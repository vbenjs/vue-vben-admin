export type ClaimTypeValue =
  | '会议费报销单'
  | '公务接待报销单'
  | '公务用车运行维护费报销单'
  | '培训费报销单'
  | '差旅费报销单'
  | '收入结报单'
  | '费用报销单（一般性费用）'
  | '费用报销单（批量支付）'
  | '费用报销单（支付令）';

export type FormFieldOption = {
  label: string;
  value: number | string;
};

export type FinanceFormField = {
  component:
    | 'date'
    | 'date-range'
    | 'input'
    | 'number'
    | 'picker'
    | 'radio'
    | 'select'
    | 'textarea';
  key: string;
  label: string;
  options?: FormFieldOption[];
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  span?: 1 | 2 | 3;
};

export type FinanceNavSection = {
  icon: 'attachment' | 'basic' | 'eInvoice' | 'grid' | 'link' | 'table';
  id: string;
  key: string;
  label: string;
};

export type ClaimConfig = {
  attachmentHint: string;
  basicFields: FinanceFormField[];
  eInvoiceHint: string;
  indicatorColumns: Array<Record<string, any>>;
  navSections: FinanceNavSection[];
  payeeLabel: string;
  showMeeting: boolean;
  showRelatedBills: boolean;
  showTraining: boolean;
  showTravel: boolean;
  title: string;
};

export const CLAIM_TYPES = {
  BATCH: '费用报销单（批量支付）',
  GENERAL: '费用报销单（一般性费用）',
  MEETING: '会议费报销单',
  PAYMENT: '费用报销单（支付令）',
  RECEPTION: '公务接待报销单',
  SETTLEMENT: '收入结报单',
  TRAINING: '培训费报销单',
  TRAVEL: '差旅费报销单',
  VEHICLE: '公务用车运行维护费报销单',
} as const satisfies Record<string, ClaimTypeValue>;

export const financeTableLocale = {
  emptyText: '暂无数据',
};

export const listTabs = [
  { key: 'todo', label: '待办' },
  { key: 'done', label: '已办' },
  { key: 'finished', label: '办结' },
  { key: 'draft', label: '草稿' },
] as const;

export const searchClaimTypeOptions = Object.values(CLAIM_TYPES);

export const dropdownClaimTypeOptions = [
  CLAIM_TYPES.BATCH,
  CLAIM_TYPES.RECEPTION,
  CLAIM_TYPES.TRAINING,
  CLAIM_TYPES.MEETING,
  CLAIM_TYPES.TRAVEL,
  CLAIM_TYPES.VEHICLE,
  CLAIM_TYPES.GENERAL,
  CLAIM_TYPES.PAYMENT,
  CLAIM_TYPES.SETTLEMENT,
];

export const radioYesNoOptions: FormFieldOption[] = [
  { label: '是', value: '1' },
  { label: '否', value: '0' },
];

export const paymentMethodOptions: FormFieldOption[] = [
  { label: '公务卡', value: '公务卡' },
  { label: '银行转账', value: '银行转账' },
  { label: '现金', value: '现金' },
];

export const settlementMethodOptions: FormFieldOption[] = [
  { label: '直接支付', value: '直接支付' },
  { label: '授权支付', value: '授权支付' },
  { label: '财政支付', value: '财政支付' },
];

export const standardTypeOptions: FormFieldOption[] = [
  { label: '财政标准', value: '财政标准' },
  { label: '单位标准', value: '单位标准' },
  { label: '会议标准', value: '会议标准' },
];

export const accountTypeOptions: FormFieldOption[] = [
  { label: '对公账户', value: '对公账户' },
  { label: '个人账户', value: '个人账户' },
];

export const titleOptions = [
  { label: '正高级', value: '正高级' },
  { label: '副高级', value: '副高级' },
  { label: '中级', value: '中级' },
  { label: '其他', value: '其他' },
];

export const emptyIndicatorRow = () => ({
  applyAmount: 0,
  econCategory: '',
  funcCategory: '',
  govEconCategory: '',
  indicatorProject: '',
  indicatorSubProject: '',
  remainAmount: 0,
  status: '0',
  subtotal: 0,
  usage: '',
});

export const emptyPayeeRow = () => ({
  accountType: '',
  bankAccount: '',
  bankName: '',
  cardAmount: 0,
  cardDate: '',
  deductIndicator: '',
  payAmount: 0,
  payeeName: '',
  relationUnitName: '',
  remark: '',
});

export const emptyRelatedBillRow = () => ({
  amount: 0,
  billNo: '',
  billType: '',
  fundUsage: '',
});

export const emptyTrainingRow = () => ({
  accommodation: 0,
  endDate: '',
  mealExpense: 0,
  otherExpense: 0,
  persons: 1,
  siteExpense: 0,
  startDate: '',
  teacherExpense: 0,
  title: '',
  trainingDays: 0,
});

export const emptyMeetingRow = () => ({
  accommodation: 0,
  attendees: 1,
  comprehensiveLimit: 0,
  endDate: '',
  mealExpense: 0,
  otherExpense: 0,
  staffCount: 0,
  startDate: '',
  title: '',
  meetingDays: 0,
});

export const emptyTravelRow = () => ({
  accommodation: 0,
  allowance: 0,
  cityTransport: 0,
  days: 0,
  endDate: '',
  fromPlace: '',
  localTransport: 0,
  persons: 1,
  startDate: '',
  title: '',
  toPlace: '',
});

export const emptyAttachmentRow = () => ({
  attachmentType: '',
  fileName: '',
  operatorName: '',
  uploadTime: '',
});

export const emptyEInvoiceRow = () => ({
  amount: 0,
  fileName: '',
  invoiceCode: '',
  invoiceNo: '',
  invoiceType: '',
  operatorName: '',
  uploadTime: '',
});

export const listColumns = [
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '单据号', dataIndex: 'claimNo', key: 'claimNo', width: 150 },
  { title: '单据类型', dataIndex: 'claimType', key: 'claimType', width: 190 },
  { title: '预算项目+子项目', dataIndex: 'indicatorInfo', key: 'indicatorInfo', width: 220 },
  { title: '申请金额(元)', dataIndex: 'claimAmount', key: 'claimAmount', width: 130 },
  { title: '资金用途', dataIndex: 'fundUsage', key: 'fundUsage', width: 220 },
  { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 110 },
  { title: '填报部门', dataIndex: 'deptName', key: 'deptName', width: 190 },
  { title: '填报日期', dataIndex: 'fillDate', key: 'fillDate', width: 130 },
  { title: '流程节点', dataIndex: 'flowNode', key: 'flowNode', width: 120 },
  { title: '进度', key: 'progress', width: 90 },
];

export const commonPrimaryFields = (
  operatorLabel: string,
  applicantLabel: string,
  amountLabel = '报销金额',
): FinanceFormField[] => [
  {
    key: 'claimNo',
    label: '单号',
    component: 'input',
    readonly: true,
    placeholder: '保存后自动生成',
  },
  {
    key: 'fillDate',
    label: '填报日期',
    component: 'date',
    required: true,
    placeholder: '请选择填报日期',
  },
  {
    key: 'operatorName',
    label: operatorLabel,
    component: 'picker',
    readonly: true,
    placeholder: `请选择${operatorLabel}`,
  },
  {
    key: 'deptName',
    label: '单位(部门)',
    component: 'picker',
    readonly: true,
    placeholder: '请选择单位(部门)',
  },
  {
    key: 'applicant',
    label: applicantLabel,
    component: 'picker',
    readonly: true,
    placeholder: `请选择${applicantLabel}`,
  },
  {
    key: 'isSupplement',
    label: '是否补录',
    component: 'radio',
    options: radioYesNoOptions,
  },
  {
    key: 'occurDate',
    label: '发生日期',
    component: 'date',
    required: true,
    placeholder: '请选择发生日期',
  },
  {
    key: 'attachPages',
    label: '单据(张)',
    component: 'number',
    required: true,
    placeholder: '请输入单据(张)',
  },
  {
    key: 'settlementMethod',
    label: '结算方式',
    component: 'select',
    options: settlementMethodOptions,
    placeholder: '请选择结算方式',
  },
  {
    key: 'paymentMethod',
    label: '支付方式',
    component: 'select',
    options: paymentMethodOptions,
    placeholder: '请选择支付方式',
  },
  {
    key: 'claimAmount',
    label: amountLabel,
    component: 'number',
    placeholder: `请输入${amountLabel}`,
  },
];

const genericIndicatorColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '*用途', dataIndex: 'usage', key: 'usage', width: 160 },
  { title: '*申请金额(元)', dataIndex: 'applyAmount', key: 'applyAmount', width: 140 },
  { title: '*经济分类', dataIndex: 'econCategory', key: 'econCategory', width: 150 },
  { title: '*政府经济分类', dataIndex: 'govEconCategory', key: 'govEconCategory', width: 160 },
  { title: '*功能分类', dataIndex: 'funcCategory', key: 'funcCategory', width: 150 },
  { title: '*预算项目', dataIndex: 'indicatorProject', key: 'indicatorProject', width: 150 },
  { title: '可用金额(元)', dataIndex: 'remainAmount', key: 'remainAmount', width: 140 },
  { title: '操作', key: 'action', width: 90 },
];

const standardIndicatorColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '*用途', dataIndex: 'usage', key: 'usage', width: 150 },
  { title: '*申请金额(元)', dataIndex: 'applyAmount', key: 'applyAmount', width: 140 },
  { title: '*经济分类', dataIndex: 'econCategory', key: 'econCategory', width: 150 },
  { title: '*政府经济分类', dataIndex: 'govEconCategory', key: 'govEconCategory', width: 160 },
  { title: '指标项目', dataIndex: 'indicatorProject', key: 'indicatorProject', width: 150 },
  { title: '*功能分类', dataIndex: 'funcCategory', key: 'funcCategory', width: 150 },
  { title: '可用金额(元)', dataIndex: 'remainAmount', key: 'remainAmount', width: 140 },
  { title: '操作', key: 'action', width: 90 },
];

const generalIndicatorColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '*用途', dataIndex: 'usage', key: 'usage', width: 150 },
  { title: '*申请金额(元)', dataIndex: 'applyAmount', key: 'applyAmount', width: 140 },
  { title: '*经济分类', dataIndex: 'econCategory', key: 'econCategory', width: 150 },
  { title: '*政府经济分类', dataIndex: 'govEconCategory', key: 'govEconCategory', width: 160 },
  { title: '功能分类', dataIndex: 'funcCategory', key: 'funcCategory', width: 140 },
  { title: '*预算项目', dataIndex: 'indicatorProject', key: 'indicatorProject', width: 140 },
  { title: '二级子项名称', dataIndex: 'indicatorSubProject', key: 'indicatorSubProject', width: 160 },
  { title: '可用金额(元)', dataIndex: 'remainAmount', key: 'remainAmount', width: 140 },
  { title: '操作', key: 'action', width: 90 },
];

export const payeeColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '*收款金额(元)', dataIndex: 'payAmount', key: 'payAmount', width: 130 },
  { title: '刷卡日期', dataIndex: 'cardDate', key: 'cardDate', width: 130 },
  { title: '刷卡金额', dataIndex: 'cardAmount', key: 'cardAmount', width: 120 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 120 },
  { title: '*收款人户名', dataIndex: 'payeeName', key: 'payeeName', width: 150 },
  { title: '银行账户', dataIndex: 'bankAccount', key: 'bankAccount', width: 150 },
  { title: '开户行', dataIndex: 'bankName', key: 'bankName', width: 140 },
  { title: '账户类型', dataIndex: 'accountType', key: 'accountType', width: 120 },
  { title: '扣减指标', dataIndex: 'deductIndicator', key: 'deductIndicator', width: 120 },
  { title: '来往单位名称', dataIndex: 'relationUnitName', key: 'relationUnitName', width: 150 },
  { title: '操作', key: 'action', width: 90 },
];

export const relatedBillColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '单号', dataIndex: 'billNo', key: 'billNo', width: 160 },
  { title: '单据类型', dataIndex: 'billType', key: 'billType', width: 160 },
  { title: '申请金额', dataIndex: 'amount', key: 'amount', width: 130 },
  { title: '资金用途', dataIndex: 'fundUsage', key: 'fundUsage', width: 180 },
  { title: '操作', key: 'action', width: 90 },
];

export const trainingColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '*起', dataIndex: 'startDate', key: 'startDate', width: 120 },
  { title: '*止', dataIndex: 'endDate', key: 'endDate', width: 120 },
  { title: '*天数', dataIndex: 'trainingDays', key: 'trainingDays', width: 100 },
  { title: '*人数', dataIndex: 'persons', key: 'persons', width: 100 },
  { title: '*职别', dataIndex: 'title', key: 'title', width: 120 },
  { title: '*师资费', dataIndex: 'teacherExpense', key: 'teacherExpense', width: 120 },
  { title: '*场地资料交通费', dataIndex: 'siteExpense', key: 'siteExpense', width: 160 },
  { title: '*住宿费', dataIndex: 'accommodation', key: 'accommodation', width: 120 },
  { title: '*伙食费', dataIndex: 'mealExpense', key: 'mealExpense', width: 120 },
  { title: '*其他', dataIndex: 'otherExpense', key: 'otherExpense', width: 120 },
  { title: '操作', key: 'action', width: 90 },
];

export const meetingColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '*起', dataIndex: 'startDate', key: 'startDate', width: 120 },
  { title: '*止', dataIndex: 'endDate', key: 'endDate', width: 120 },
  { title: '*天数', dataIndex: 'meetingDays', key: 'meetingDays', width: 100 },
  { title: '*参会人数', dataIndex: 'attendees', key: 'attendees', width: 120 },
  { title: '*工作人员', dataIndex: 'staffCount', key: 'staffCount', width: 120 },
  { title: '*职别', dataIndex: 'title', key: 'title', width: 120 },
  { title: '*住宿费', dataIndex: 'accommodation', key: 'accommodation', width: 120 },
  { title: '*伙食费', dataIndex: 'mealExpense', key: 'mealExpense', width: 120 },
  { title: '其他', dataIndex: 'otherExpense', key: 'otherExpense', width: 120 },
  { title: '综合定额上限', dataIndex: 'comprehensiveLimit', key: 'comprehensiveLimit', width: 140 },
  { title: '操作', key: 'action', width: 90 },
];

export const travelColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '*起', dataIndex: 'startDate', key: 'startDate', width: 120 },
  { title: '*止', dataIndex: 'endDate', key: 'endDate', width: 120 },
  { title: '*起', dataIndex: 'fromPlace', key: 'fromPlace', width: 130 },
  { title: '*止', dataIndex: 'toPlace', key: 'toPlace', width: 130 },
  { title: '*天数', dataIndex: 'days', key: 'days', width: 100 },
  { title: '*人数', dataIndex: 'persons', key: 'persons', width: 100 },
  { title: '*职别', dataIndex: 'title', key: 'title', width: 120 },
  { title: '*城市间运费', dataIndex: 'cityTransport', key: 'cityTransport', width: 140 },
  { title: '*住宿费', dataIndex: 'accommodation', key: 'accommodation', width: 120 },
  { title: '*市内交通费补助', dataIndex: 'localTransport', key: 'localTransport', width: 160 },
  { title: '*伙食费补助', dataIndex: 'allowance', key: 'allowance', width: 140 },
  { title: '操作', key: 'action', width: 90 },
];

export const attachmentColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '操作', dataIndex: 'actionLabel', key: 'actionLabel', width: 90 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName' },
  { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 180 },
  { title: '附件类型', dataIndex: 'attachmentType', key: 'attachmentType', width: 150 },
  { title: '操作人', dataIndex: 'operatorName', key: 'operatorName', width: 120 },
];

export const eInvoiceColumns = [
  { title: '序号', key: 'seq', width: 72 },
  { title: '操作', dataIndex: 'actionLabel', key: 'actionLabel', width: 90 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName', width: 180 },
  { title: '发票代码', dataIndex: 'invoiceCode', key: 'invoiceCode', width: 150 },
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 150 },
  { title: '发票金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '发票类型', dataIndex: 'invoiceType', key: 'invoiceType', width: 140 },
  { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 180 },
  { title: '操作人', dataIndex: 'operatorName', key: 'operatorName', width: 120 },
];

export const templateColumns = [
  { title: '模板名称', dataIndex: 'templateName', key: 'templateName' },
  { title: '创建人', dataIndex: 'creatorName', key: 'creatorName', width: 160 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 200 },
];

export const historyColumns = [
  { title: '动作', dataIndex: 'approvalAction', key: 'approvalAction', width: 100 },
  { title: '审批人', dataIndex: 'approverName', key: 'approverName', width: 120 },
  { title: '审批部门', dataIndex: 'approverDeptName', key: 'approverDeptName', width: 160 },
  { title: '意见', dataIndex: 'approvalOpinion', key: 'approvalOpinion' },
  { title: '时间', dataIndex: 'approvalTime', key: 'approvalTime', width: 180 },
];

export const invoiceColumns = [
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 180 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName', width: 220 },
  { title: '发票类型', dataIndex: 'invoiceType', key: 'invoiceType', width: 180 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '操作', key: 'action', width: 90 },
];

export const claimConfigs: Record<ClaimTypeValue, ClaimConfig> = {
  [CLAIM_TYPES.BATCH]: {
    attachmentHint: '上传格式为pdf、jpg、jpeg、png、ofd的文件，单个文件不可超过100M。可上传50个文件。',
    basicFields: [
      ...commonPrimaryFields('经办人', '申请人'),
      { key: 'payableAmount', label: '应付金额', component: 'number', placeholder: '请输入应付金额' },
      { key: 'remark', label: '备注', component: 'textarea', span: 3, placeholder: '请输入备注' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传50个文件。',
    indicatorColumns: genericIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人信息', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报账单', id: 'finance-related-section', icon: 'link' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
    ],
    payeeLabel: '收款人信息',
    showMeeting: false,
    showRelatedBills: true,
    showTraining: false,
    showTravel: false,
    title: CLAIM_TYPES.BATCH,
  },
  [CLAIM_TYPES.RECEPTION]: {
    attachmentHint: '上传格式为jpg、jpeg、png、ofd、pdf的文件，单个文件不可超过50M。可上传50个文件。',
    basicFields: [
      ...commonPrimaryFields('填报人', '报销人'),
      { key: 'receptionTarget', label: '接待对象', component: 'input', placeholder: '请输入接待对象' },
      { key: 'receptionCount', label: '接待人数', component: 'number', placeholder: '请输入接待人数' },
      { key: 'companionCount', label: '陪餐人数', component: 'number', placeholder: '请输入陪餐人数' },
      { key: 'receptionDateRange', label: '接待日期', component: 'date-range' },
      { key: 'receptionDays', label: '接待天数', component: 'number', placeholder: '请输入接待天数' },
      { key: 'standardType', label: '标准类型', component: 'select', options: standardTypeOptions, placeholder: '请选择标准类型' },
      { key: 'receptionStandard', label: '接待标准(元/人/天)', component: 'number', placeholder: '请输入接待标准' },
      { key: 'standardLimit', label: '标准上限', component: 'number', placeholder: '请输入标准上限' },
      { key: 'titleAmount', label: '大写金额', component: 'input', placeholder: '请输入大写金额' },
      { key: 'remark', label: '备注', component: 'textarea', span: 3, placeholder: '请输入备注' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传50个文件。',
    indicatorColumns: standardIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人信息', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报销单', id: 'finance-related-section', icon: 'link' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
    ],
    payeeLabel: '收款人信息',
    showMeeting: false,
    showRelatedBills: true,
    showTraining: false,
    showTravel: false,
    title: CLAIM_TYPES.RECEPTION,
  },
  [CLAIM_TYPES.TRAINING]: {
    attachmentHint: '上传格式为jpg、jpeg、png、ofd、pdf的文件，单个文件不可超过50M。可上传50个文件。',
    basicFields: [
      ...commonPrimaryFields('填报人', '申请人', '申请金额'),
      { key: 'projectName', label: '项目名称', component: 'input', placeholder: '请输入项目名称' },
      { key: 'trainingDateRange', label: '培训日期', component: 'date-range' },
      { key: 'trainingDays', label: '培训天数', component: 'number', placeholder: '请输入培训天数' },
      { key: 'trainingPlace', label: '培训地点', component: 'input', placeholder: '请输入培训地点' },
      { key: 'traineeCount', label: '参训人数', component: 'number', placeholder: '请输入参训人数' },
      { key: 'workerCount', label: '工作人员人数', component: 'number', placeholder: '请输入工作人员人数' },
      { key: 'standardType', label: '标准类型', component: 'select', options: standardTypeOptions, placeholder: '请选择标准类型' },
      { key: 'titleAmount', label: '大写金额', component: 'input', placeholder: '请输入大写金额' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传50个文件。',
    indicatorColumns: standardIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'training', label: '培训信息', id: 'finance-training-section', icon: 'table' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人信息', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报销单', id: 'finance-related-section', icon: 'link' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
    ],
    payeeLabel: '收款人信息',
    showMeeting: false,
    showRelatedBills: true,
    showTraining: true,
    showTravel: false,
    title: CLAIM_TYPES.TRAINING,
  },
  [CLAIM_TYPES.MEETING]: {
    attachmentHint: '上传格式为pdf、jpg、jpeg、png、ofd的文件，单个文件不可超过10M。可上传50个文件。',
    basicFields: [
      ...commonPrimaryFields('填报人', '申请人'),
      { key: 'meetingName', label: '会议名称', component: 'input', placeholder: '请输入会议名称' },
      { key: 'meetingStandard', label: '会议标准', component: 'input', placeholder: '请选择会议标准' },
      { key: 'meetingDateRange', label: '会议日期', component: 'date-range' },
      { key: 'meetingPlace', label: '会议地点', component: 'input', placeholder: '请输入会议地点' },
      { key: 'meetingDays', label: '会议天数', component: 'number', placeholder: '请输入会议天数' },
      { key: 'receptionCount', label: '参会人员数', component: 'number', placeholder: '请输入参会人员数' },
      { key: 'workerCount', label: '工作人员数', component: 'number', placeholder: '请输入工作人员数' },
      { key: 'titleAmount', label: '大写金额', component: 'input', placeholder: '请输入大写金额' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传50个文件。',
    indicatorColumns: standardIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'meeting', label: '会议明细', id: 'finance-meeting-section', icon: 'table' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人信息', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报销单', id: 'finance-related-section', icon: 'link' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
    ],
    payeeLabel: '收款人信息',
    showMeeting: true,
    showRelatedBills: true,
    showTraining: false,
    showTravel: false,
    title: CLAIM_TYPES.MEETING,
  },
  [CLAIM_TYPES.TRAVEL]: {
    attachmentHint: '上传格式为jpg、jpeg、png、pdf、ofd的文件，单个文件不可超过50M。可上传10个文件。',
    basicFields: [
      ...commonPrimaryFields('填报人', '报销人'),
      { key: 'titleAmount', label: '大写金额', component: 'input', placeholder: '请输入大写金额' },
      { key: 'travelReason', label: '出差事由', component: 'textarea', span: 3, placeholder: '请输入出差事由' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传15个文件。',
    indicatorColumns: standardIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'travel', label: '差旅信息', id: 'finance-travel-section', icon: 'table' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报账单', id: 'finance-related-section', icon: 'link' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
    ],
    payeeLabel: '收款人',
    showMeeting: false,
    showRelatedBills: true,
    showTraining: false,
    showTravel: true,
    title: CLAIM_TYPES.TRAVEL,
  },
  [CLAIM_TYPES.GENERAL]: {
    attachmentHint: '上传格式为jpg、jpeg、png、pdf、ofd的文件，单个文件不可超过50M。可上传10个文件。',
    basicFields: [
      ...commonPrimaryFields('经办人', '申请人'),
      { key: 'payableAmount', label: '应付金额', component: 'number', placeholder: '请输入应付金额' },
      { key: 'remark', label: '备注', component: 'textarea', span: 3, placeholder: '请输入备注' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传15个文件。',
    indicatorColumns: generalIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人信息', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报销单', id: 'finance-related-section', icon: 'link' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
    ],
    payeeLabel: '收款人信息',
    showMeeting: false,
    showRelatedBills: true,
    showTraining: false,
    showTravel: false,
    title: CLAIM_TYPES.GENERAL,
  },
  [CLAIM_TYPES.PAYMENT]: {
    attachmentHint: '上传格式为jpg、jpeg、png、pdf、ofd的文件，单个文件不可超过50M。可上传10个文件。',
    basicFields: [
      ...commonPrimaryFields('经办人', '申请人'),
      { key: 'payableAmount', label: '应付金额', component: 'number', placeholder: '请输入应付金额' },
      { key: 'remark', label: '备注', component: 'textarea', span: 3, placeholder: '请输入备注' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传15个文件。',
    indicatorColumns: generalIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人信息', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报销单', id: 'finance-related-section', icon: 'link' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
    ],
    payeeLabel: '收款人信息',
    showMeeting: false,
    showRelatedBills: true,
    showTraining: false,
    showTravel: false,
    title: CLAIM_TYPES.PAYMENT,
  },
  [CLAIM_TYPES.VEHICLE]: {
    attachmentHint: '上传格式为jpg、jpeg、png、pdf、ofd的文件，单个文件不可超过50M。可上传10个文件。',
    basicFields: [
      ...commonPrimaryFields('经办人', '申请人'),
      { key: 'payableAmount', label: '应付金额', component: 'number', placeholder: '请输入应付金额' },
      { key: 'remark', label: '备注', component: 'textarea', span: 3, placeholder: '请输入备注' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传15个文件。',
    indicatorColumns: generalIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人信息', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报销单', id: 'finance-related-section', icon: 'link' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
    ],
    payeeLabel: '收款人信息',
    showMeeting: false,
    showRelatedBills: true,
    showTraining: false,
    showTravel: false,
    title: CLAIM_TYPES.VEHICLE,
  },
  [CLAIM_TYPES.SETTLEMENT]: {
    attachmentHint: '上传格式为jpg、jpeg、png、pdf、ofd的文件，单个文件不可超过50M。可上传10个文件。',
    basicFields: [
      ...commonPrimaryFields('经办人', '申请人', '收款金额'),
      { key: 'payableAmount', label: '应收金额', component: 'number', placeholder: '请输入应收金额' },
      { key: 'remark', label: '备注', component: 'textarea', span: 3, placeholder: '请输入备注' },
    ],
    eInvoiceHint: '上传格式为pdf、ofd、jpg、jpeg、png的文件，单个文件不可超过10M。可上传15个文件。',
    indicatorColumns: generalIndicatorColumns,
    navSections: [
      { key: 'basic', label: '基本信息', id: 'finance-basic-section', icon: 'basic' },
      { key: 'indicator', label: '经费指标', id: 'finance-indicator-section', icon: 'grid' },
      { key: 'payee', label: '收款人信息', id: 'finance-payee-section', icon: 'table' },
      { key: 'related', label: '关联报销单', id: 'finance-related-section', icon: 'link' },
      { key: 'invoice', label: '电子发票', id: 'finance-invoice-section', icon: 'eInvoice' },
      { key: 'attachment', label: '附件', id: 'finance-attachment-section', icon: 'attachment' },
    ],
    payeeLabel: '收款人信息',
    showMeeting: false,
    showRelatedBills: true,
    showTraining: false,
    showTravel: false,
    title: CLAIM_TYPES.SETTLEMENT,
  },
};
