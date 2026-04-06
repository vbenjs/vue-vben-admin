export const DEFAULT_LEGACY_DEPT_NAME =
  '中共深圳市龙华区委统一战线工作部（本级）';

export const LEGACY_ORG_TREE_DATA = [
  {
    key: 'platform-root',
    title: '会计核算中心综合管理平台',
    selectable: false,
    children: [
      {
        key: 'org-005001',
        title: `[005001]${DEFAULT_LEGACY_DEPT_NAME}`,
        deptName: DEFAULT_LEGACY_DEPT_NAME,
      },
    ],
  },
];

export const LEGACY_TABLE_LOCALE = {
  emptyText: '暂无数据',
};

export const LEGACY_ATTACHMENT_COLUMNS = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 72 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 90 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName' },
  { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 160 },
  { title: '附件类型', dataIndex: 'fileType', key: 'fileType', width: 150 },
  {
    title: '操作人',
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 120,
  },
];

export const LEGACY_ATTACHMENT_TIP =
  '上传格式为pdf、doc、docx、xls、xlsx、jpg、jpeg、png、txt、zip、rar、ofd的文件，单个文件不可超过10M。可上传10个文件。';

export function filterLegacyOrgTree(keyword: string) {
  const normalized = keyword.trim();
  if (!normalized) {
    return LEGACY_ORG_TREE_DATA;
  }

  return LEGACY_ORG_TREE_DATA.map((node) => ({
    ...node,
    children: (node.children || []).filter((child) =>
      String(child.title || '').includes(normalized),
    ),
  })).filter((node) => (node.children || []).length > 0);
}

export function formatLegacyAmount(value: number | string | undefined) {
  return Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function scrollLegacySection(sectionId: string) {
  if (typeof document === 'undefined') {
    return;
  }

  document
    .querySelector<HTMLElement>(`#${sectionId}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
