<template>
  <div>
    <input
      ref="inputRef"
      type="file"
      v-show="false"
      accept=".xlsx, .xls"
      @change="handleInputClick"
    />
    <div @click="handleUpload">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import XLSX from 'xlsx';

  import type { ExcelData } from './typing';
  export default defineComponent({
    name: 'ImportExcel',
    emits: ['success', 'error'],
    setup(_, { emit }) {
      const inputRef = ref<HTMLInputElement | null>(null);
      const loadingRef = ref<Boolean>(false);

      /**
       * @description: 第一行作为头部
       */
      function getHeaderRow(sheet: XLSX.WorkSheet) {
        if (!sheet || !sheet['!ref']) return [];
        const headers: string[] = [];
        // A3:B7=>{s:{c:0, r:2}, e:{c:1, r:6}}
        const range = XLSX.utils.decode_range(sheet['!ref']);

        const R = range.s.r;
        /* start in the first row */
        for (let C = range.s.c; C <= range.e.c; ++C) {
          /* walk every column in the range */
          const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
          /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
          headers.push(hdr);
        }
        return headers;
      }

      /**
       * @description: 获得excel数据
       */
      function getExcelData(workbook: XLSX.WorkBook) {
        const excelData: ExcelData[] = [];
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const header: string[] = getHeaderRow(worksheet);
          const results = XLSX.utils.sheet_to_json(worksheet);
          excelData.push({
            header,
            results,
            meta: {
              sheetName,
            },
          });
        }
        return excelData;
      }

      /**
       * @description: 读取excel数据
       */
      function readerData(rawFile: File) {
        loadingRef.value = true;
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const data = e.target && e.target.result;
              const workbook = XLSX.read(data, { type: 'array' });
              // console.log(workbook);
              /* DO SOMETHING WITH workbook HERE */
              const excelData = getExcelData(workbook);
              emit('success', excelData);
              resolve('');
            } catch (error) {
              reject(error);
              emit('error');
            } finally {
              loadingRef.value = false;
            }
          };
          reader.readAsArrayBuffer(rawFile);
        });
      }

      async function upload(rawFile: File) {
        const inputRefDom = unref(inputRef);
        if (inputRefDom) {
          // fix can't select the same excel
          inputRefDom.value = '';
        }
        await readerData(rawFile);
      }

      /**
       * @description: 触发选择文件管理器
       */
      function handleInputClick(e: Event) {
        const files = e && (e.target as HTMLInputElement).files;
        const rawFile = files && files[0]; // only setting files[0]
        if (!rawFile) return;
        upload(rawFile);
      }

      /**
       * @description: 点击上传按钮
       */
      function handleUpload() {
        const inputRefDom = unref(inputRef);
        inputRefDom && inputRefDom.click();
      }

      return { handleUpload, handleInputClick, inputRef };
    },
  });
</script>
