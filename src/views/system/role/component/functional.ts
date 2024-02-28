import { uniq } from 'lodash-es';
import { computed, Ref, unref } from 'vue';
import { TreeData } from './type';
import { YN } from '@/enums/YN';

export const formatOptions = (data: TreeData) => {
  if (!data?.actionList) return [];
  const { actionList } = data;
  return actionList.map((item) => {
    const disabled = item.defaultCheck === YN.Y;
    return {
      label: item.actionName,
      value: item.id,
      disabled,
    };
  });
};
const getChildrenCheckAll: (data?: TreeData[] | null) => [number, boolean] = (data) => {
  if (!data) return [0, false];
  let childrenCheckAllNum = 0;
  let flag = false;
  data.forEach((item) => {
    const { children, actionList, checkedList } = item;
    const actionListLength = actionList?.length ?? 0;
    const checkedListLength = uniq(checkedList)?.length ?? 0;
    const [childrenCheckAll, childrenIndeterminate] = getChildrenCheckAll(children);
    const childrenLength = children?.length ?? 0;
    const total = childrenLength + actionListLength;
    if (childrenCheckAll + checkedListLength === total) childrenCheckAllNum++;
    flag = checkedListLength > 0 || childrenCheckAll > 0 || childrenIndeterminate || flag;
  });
  return [childrenCheckAllNum, flag];
};
export const getSelectAll = (data: TreeData | Ref<TreeData>) => {
  const { children, actionList, checkedList } = unref(data);
  const [childrenCheckAllNum, childrenIndeterminate] = getChildrenCheckAll(children);
  const childrenLength = children?.length ?? 0;
  const actionListLength = actionList?.length ?? 0;
  const checkedListLength = checkedList?.length ?? 0;
  const total = childrenLength + actionListLength;
  const indeterminate = computed(() => {
    if (childrenCheckAllNum + checkedListLength === total) return false;
    return childrenCheckAllNum > 0 || checkedListLength > 0 || childrenIndeterminate;
  });
  const checkAll = computed(() => childrenCheckAllNum + checkedListLength === total);

  if (indeterminate.value) {
    // 有数据被选中的同时勾选默认
    const defaultCheck =
      actionList?.filter((item) => item.defaultCheck === 'Y')?.map((item) => item.id) ?? [];
    if (!checkedList) {
      unref(data).checkedList = defaultCheck;
    } else {
      defaultCheck.forEach((id) => {
        !checkedList.includes(id) && checkedList.push(id);
      });
      unref(data).checkedList = checkedList;
    }
  }
  return {
    indeterminate,
    checkAll,
  };
};

// export const onChange = (data: TreeData) => {
//   const checkedList = uniq(toRaw(data.checkedList));
//   const actionList = toRaw(data.actionList);
//   if (checkedList?.length) {
//     const defaultCheck = actionList?.filter((item) => item.defaultCheck === 'Y');
//     if (!defaultCheck) return;
//     defaultCheck.forEach((checked) => {
//       !checkedList.includes(checked.id) && checkedList.push(checked.id);
//     });
//     data.checkedList = checkedList;
//   }
// };

export const handleHide = (id: number, treeData: TreeData[]) => {
  treeData.map((item) => {
    if (item.id === id) item.hide = !item.hide;
  });
};
export const checkParent = (data: TreeData, checked: boolean) => {
  selectOptions(data, checked);
  if (data.children) {
    data.children.forEach((item) => {
      checkParent(item, checked);
    });
  }
};
const selectOptions = (data: TreeData, checked: boolean) => {
  data.checkedList = checked ? data.actionList?.map((obj) => obj.id) : [];
};
