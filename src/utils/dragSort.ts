import { ref, toRaw } from "vue";

const sourceObj = ref();
const temp = ref();
export const dragSort = (
  record,
  array: Recordable<any>[],
  cb: (value: any[]) => void = () => {},
  success: Function | undefined,
  sortField = "sortNum",
  desc = true
) => {
  return {
    style: {
      cursor: "pointer",
    },
    onMouseenter: (event) => {
      const ev = event || window.event;
      ev.target.draggable = true;
    },
    onDragstart: (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到源目标数据
      sourceObj.value = record;
    },
    // 拖动元素经过的元素
    onDragover: (event) => {
      if (temp.value === record) return;
      temp.value = record;
      // 兼容 IE
      const ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
      const sortNum = sourceObj.value[sortField];
      const obj = record;
      sourceObj.value[sortField] = obj[sortField];
      obj[sortField] = sortNum;
      array.sort(function (a, b) {
        if (desc) return b[sortField] - a[sortField];
        return a[sortField] - b[sortField];
      });
      cb([...toRaw(array)]);
    },
    // 鼠标松开
    onDragend: (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      if (success) {
        const sortNum = sourceObj.value[sortField];
        const obj = record;
        sourceObj.value[sortField] = obj[sortField];
        obj[sortField] = sortNum;
        array.sort(function (a, b) {
          if (desc) return b[sortField] - a[sortField];
          return a[sortField] - b[sortField];
        });
        success([...toRaw(array)]);
      }

      // 清空
      sourceObj.value = {};
    },
  };
};
