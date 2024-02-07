import { defineStore } from 'pinia';

/**
 * 系统异常store
 */
export const useSystemExceptionStore = defineStore('systemExceptionStore', {
  state: () => {
    return {
      modalVisible: false,
      noList: [] as Array<number>,
    };
  },
  actions: {
    /**
     * 显示异常弹窗
     * @param exceptionNo
     */
    handleShowExceptionModal(exceptionNo: number) {
      if (this.modalVisible === false) {
        this.noList = [];
      }
      this.modalVisible = true;
      this.noList.push(exceptionNo);
    },
    /**
     * 隐藏弹窗
     */
    handleHideExceptionModal() {
      this.noList = [];
      this.modalVisible = false;
    },
  },
});
