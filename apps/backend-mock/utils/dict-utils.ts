import { faker } from '@faker-js/faker';

export interface MockDictType {
  code: string;
  createTime: string;
  id: string;
  name: string;
  remark?: string;
  status: 0 | 1;
}

export interface MockDictData {
  color?: string;
  createTime: string;
  dictCode: string;
  id: string;
  label: string;
  remark?: string;
  sort: number;
  status: 0 | 1;
  value: number | string;
}

const formatterCN = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

function now() {
  return formatterCN.format(new Date());
}

function createId() {
  return faker.string.uuid();
}

let dictVersion = 1;

const dictTypes: MockDictType[] = [
  {
    id: createId(),
    name: '用户性别',
    code: 'user_gender',
    status: 1,
    remark: '用户性别字典',
    createTime: now(),
  },
  {
    id: createId(),
    name: '通用状态',
    code: 'common_status',
    status: 1,
    remark: '启用/禁用',
    createTime: now(),
  },
  {
    id: createId(),
    name: '是否',
    code: 'yes_no',
    status: 1,
    remark: '是否选项',
    createTime: now(),
  },
];

const dictDataList: MockDictData[] = [
  {
    id: createId(),
    dictCode: 'user_gender',
    label: '男',
    value: 1,
    sort: 1,
    status: 1,
    createTime: now(),
  },
  {
    id: createId(),
    dictCode: 'user_gender',
    label: '女',
    value: 0,
    sort: 2,
    status: 1,
    createTime: now(),
  },
  {
    id: createId(),
    dictCode: 'user_gender',
    label: '未知',
    value: 2,
    sort: 3,
    status: 1,
    createTime: now(),
  },
  {
    id: createId(),
    dictCode: 'common_status',
    label: '启用',
    value: 1,
    color: 'success',
    sort: 1,
    status: 1,
    createTime: now(),
  },
  {
    id: createId(),
    dictCode: 'common_status',
    label: '禁用',
    value: 0,
    color: 'error',
    sort: 2,
    status: 1,
    createTime: now(),
  },
  {
    id: createId(),
    dictCode: 'yes_no',
    label: '是',
    value: 1,
    sort: 1,
    status: 1,
    createTime: now(),
  },
  {
    id: createId(),
    dictCode: 'yes_no',
    label: '否',
    value: 0,
    sort: 2,
    status: 1,
    createTime: now(),
  },
];

function bumpVersion() {
  dictVersion += 1;
}

export function getDictVersion() {
  return dictVersion;
}

export function getDictTypes() {
  return dictTypes;
}

export function getDictDataList() {
  return dictDataList;
}

export function getEnabledDictData(code: string) {
  return [...dictDataList]
    .filter((item) => item.dictCode === code && item.status === 1)
    .toSorted((a, b) => a.sort - b.sort)
    .map(({ color, label, value }) => ({
      ...(color ? { color } : {}),
      label,
      value,
    }));
}

export function getAllEnabledDicts() {
  const result: Record<
    string,
    { color?: string; label: string; value: number | string }[]
  > = {};
  for (const type of dictTypes) {
    if (type.status === 1) {
      result[type.code] = getEnabledDictData(type.code);
    }
  }
  return result;
}

export function findDictTypeById(id: string) {
  return dictTypes.find((item) => item.id === id);
}

export function findDictTypeByCode(code: string) {
  return dictTypes.find((item) => item.code === code);
}

export function isDictCodeExists(code: string, id?: string) {
  return dictTypes.some((item) => item.code === code && item.id !== id);
}

export function createDictType(
  data: Omit<MockDictType, 'createTime' | 'id'>,
): MockDictType {
  const item: MockDictType = {
    ...data,
    id: createId(),
    createTime: now(),
  };
  dictTypes.unshift(item);
  bumpVersion();
  return item;
}

export function updateDictType(
  id: string,
  data: Partial<Omit<MockDictType, 'createTime' | 'id'>>,
) {
  const index = dictTypes.findIndex((item) => item.id === id);
  const current = index === -1 ? undefined : dictTypes[index];
  if (!current) {
    return null;
  }
  const oldCode = current.code;
  const next = { ...current, ...data };
  dictTypes[index] = next;
  if (data.code && data.code !== oldCode) {
    for (const item of dictDataList) {
      if (item.dictCode === oldCode) {
        item.dictCode = data.code;
      }
    }
  }
  bumpVersion();
  return next;
}

export function deleteDictType(id: string) {
  const index = dictTypes.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }
  const [removed] = dictTypes.splice(index, 1);
  if (removed) {
    for (let i = dictDataList.length - 1; i >= 0; i -= 1) {
      if (dictDataList[i]?.dictCode === removed.code) {
        dictDataList.splice(i, 1);
      }
    }
  }
  bumpVersion();
  return true;
}

export function findDictDataById(id: string) {
  return dictDataList.find((item) => item.id === id);
}

export function createDictData(
  data: Omit<MockDictData, 'createTime' | 'id'>,
): MockDictData {
  const item: MockDictData = {
    ...data,
    id: createId(),
    createTime: now(),
  };
  dictDataList.unshift(item);
  bumpVersion();
  return item;
}

export function updateDictData(
  id: string,
  data: Partial<Omit<MockDictData, 'createTime' | 'id'>>,
) {
  const index = dictDataList.findIndex((item) => item.id === id);
  const current = index === -1 ? undefined : dictDataList[index];
  if (!current) {
    return null;
  }
  const next = { ...current, ...data };
  dictDataList[index] = next;
  bumpVersion();
  return next;
}

export function deleteDictData(id: string) {
  const index = dictDataList.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }
  dictDataList.splice(index, 1);
  bumpVersion();
  return true;
}
