<template>
  <div>
    <BasicTable title="基础表格" :columns="columns" :dataSource="data">
      <template #toolbar>
        <a-button @click="openModal">JSON格式导出：默认头部</a-button>
        <a-button @click="customHeader">JSON格式导出：自定义头部</a-button>
        <a-button @click="aoaToExcel">二维数组格式导出</a-button>
      </template>
    </BasicTable>
    <ExportExcelModel @register="register" @success="defaultHeader" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import {
    jsonToSheetXlsx,
    aoaToSheetXlsx,
    ExportExcelModel,
    ExportModalResult,
  } from '/@/components/Excel';
  import { columns, data, arrHeader, arrData } from './data';
  import { useModal } from '/@/components/Modal';

  export default defineComponent({
    components: { BasicTable, ExportExcelModel },
    setup() {
      function defaultHeader({ filename, bookType }: ExportModalResult) {
        // 默认Object.keys(data[0])作为header
        jsonToSheetXlsx({
          data,
          filename,
          write2excelOpts: {
            bookType,
          },
        });
      }
      function customHeader() {
        jsonToSheetXlsx({
          data,
          header: {
            id: 'ID',
            name: '姓名',
            age: '年龄',
            no: '编号',
            address: '地址',
            beginTime: '开始时间',
            endTime: '结束时间',
          },
          filename: '文件名头部修改.xlsx',
          json2sheetOpts: {
            // 指定顺序
            header: ['name', 'id'],
          },
        });
      }
      function aoaToExcel() {
        // 保证data顺序与header一致
        aoaToSheetXlsx({
          data: arrData,
          header: arrHeader,
          filename: '数组方式导出excel.xlsx',
        });
      }
      const [register, { openModal }] = useModal();

      return {
        defaultHeader,
        customHeader,
        aoaToExcel,
        columns,
        data,
        register,
        openModal,
      };
    },
  });
</script>
