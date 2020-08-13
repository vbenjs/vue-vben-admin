<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import XLSX from 'xlsx';
  import { useDesign } from '@/hooks/core/useDesign';
  import { getSlot } from '@/utils/helper/tsxHelper';
  import { isFunction } from '@/utils/is/index';

  import { ImportProps } from './types';
  import { importProps } from './props';
  export default defineComponent({
    name: 'ImportFromExcel',
    props: importProps,
    setup(props: ImportProps, { slots, emit }) {
      const inputRef = ref<HTMLInputElement | null>(null);
      const loadingRef = ref<Boolean>(false);

      const { prefixCls } = useDesign('import-excel');
      function getHeaderRow(sheet: XLSX.WorkSheet) {
        if (!sheet || !sheet['!ref']) return [];
        const headers: string[] = [];
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

      // 读取excel数据
      function readerData(rawFile: File) {
        loadingRef.value = true;
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const data = e.target && e.target.result;
              const workbook = XLSX.read(data, { type: 'array' });
              console.log(workbook);
              /* DO SOMETHING WITH workbook HERE */
              // 只处理第一个sheet
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const header: string[] = getHeaderRow(worksheet);
              const results = XLSX.utils.sheet_to_json(worksheet);
              emit('success', {
                header,
                results,
                meta: { sheetName: firstSheetName },
              });
              resolve();
            } catch (error) {
              reject(error);
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
          inputRefDom.value = '';
        }
        if (isFunction(props.beforeUpload)) {
          await props.beforeUpload(rawFile);
        }
        readerData(rawFile);
      }
      // 触发选择文件管理器
      function handleInputClick(e: Event) {
        const files = e && (e.target as HTMLInputElement).files;
        const rawFile = files && files[0]; // only use files[0]
        if (!rawFile) return;
        upload(rawFile);
      }
      // 点击上传按钮
      function handleUpload() {
        const inputRefDom = unref(inputRef);
        inputRefDom && inputRefDom.click();
      }

      return () => {
        return (
          <div class={prefixCls}>
            <input
              ref={inputRef}
              class={`${prefixCls}__input`}
              type="file"
              accept=".xlsx, .xls"
              style="  z-index: -9999; display: none;"
              onChange={handleInputClick}
            />
            <div onClick={handleUpload}>{getSlot(slots)}</div>
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  // @import (reference) '~@design';
  // @prefix-cls: ~'@{namespace}-import-excel';

  // .@{prefix-cls} {
  //   position: relative;
  // }
</style>
