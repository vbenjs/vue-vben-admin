<template>
  <div class="p-5">
    <table ref="dataTable" id="example" class="display">
      <thead>
        <tr>
          <th>Nr</th>
          <th>Unique return code</th>
          <th>open P Yes / No</th>
          <th>destroy p Yes / No</th>
          <th>sort</th>
          <th>Created</th>
        </tr>
      </thead>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-editor/css/editor.dataTables.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import '../../assets/buttons.dataTables.css';

import 'datatables.net';
import 'datatables.net-editor';
import 'datatables.net-select';
import 'datatables.net-datetime';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'jszip';
import 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import Papa from 'papaparse';

const dataTable = ref<HTMLTableElement | null>(null);

onMounted(() => {
  if (!$.fn.DataTable || !$.fn.dataTable.Editor) {
    console.error('============== DataTable or Editor is not loaded correctly. ===============');
    return;
  }
if (dataTable.value) {
  // Initialize the Editor first
  const editor = new $.fn.dataTable.Editor({
    ajax: {
        url: '/return-api/index.php?controller=return',
        contentType: 'application/json',
        data: function (d) {
            return JSON.stringify(d);
        }
    },
    table: '#example',
    idSrc: 'id',
    fields: [
      {label: 'Unique return code', name: 'rid'},
      {
          label: 'open P',
          name: 'openOrder',
          type: 'radio',
          options: [
              {label: 'No', value: 0},
              {label: 'Yes', value: 1}
          ]
      },
      {
          label: 'destroy P',
          name: 'destroyOrder',
          type: 'radio',
          options: [
              {label: 'No', value: 0},
              {label: 'Yes', value: 1}
          ]
      },
      {label: 'sort', name: 'sort'},
    ]
  });
  // Initialize the DataTable with buttons that use the editor instance
  const apiUrl = import.meta.env.VITE_GLOB_API_URL;
  $(dataTable.value).DataTable({
    ajax: {
      url: `${apiUrl}/data_table/list`,
      dataSrc: "data"
    },
    select: true,
    dom: 'Bfrtip',
    pageLength: 25,
    buttons: [
        {extend: 'copyHtml5', className: 'ant-btn', text: '<i class="bi bi-clipboard"></i>', titleAttr: 'Copy'},
        {extend: 'excelHtml5', text: '<i class="bi bi-filetype-xlsx">', titleAttr: 'Excel'},
        {extend: 'csvHtml5', text: '<i class="bi bi-filetype-csv"></i>', titleAttr: 'CSV'},
        {extend: 'pdfHtml5', text: '<i class="bi bi-filetype-pdf"></i>', titleAttr: 'PDF'},
        {
            extend: 'create', editor: editor, formTitle: 'Create R',
            text: '<i class="bi bi-plus-square"></i>'
        },
        {
            extend: 'edit', editor: editor, formTitle: 'Edit R',
            text: '<i class="bi bi-pen"></i>'
        },
        {
            extend: "remove", editor: editor, formTitle: 'Remove R',
            formMessage: "Remove R ?", text: '<i class="bi bi-trash"></i>'
        },
        {
            text: 'Import CSV',
            action: function () {
                uploadEditor.create({
                    title: 'CSV file import'
                });
            }
        }
    ],
    columns: [
        {
            data: 'id', title: 'Nr.',
        },
        {
            data: 'rid', title: 'Unique return code',
        },
        {
            data: 'openOrder', title: 'open P Yes / No', render: function (data) {
                return (data === '1') ? 'Yes' : 'No';
            }
        },
        {
            data: 'destroyOrder', title: 'destroy p Yes / No', render: function (data) {
                return (data === '1') ? 'Yes' : 'No';
            }
        },
        {
            data: 'sort', title: 'sort',
        },
        {
            data: 'time', title: 'Created', render: function (data) {
                const myDate = new Date(data * 1000);
                return (myDate.toLocaleString('de-DE'));
            }
        }
    ]
  });

  // Function to handle CSV column mapping
  function selectColumns(editor, csv, header) {
    let selectEditor = new $.fn.dataTable.Editor();
    let fields = editor.order();

    for (let i = 0; i < fields.length; i++) {
      let field = editor.field(fields[i]);
      selectEditor.add({
        label: field.label(),
        name: field.name(),
        type: 'select',
        options: header,
        def: header[i]
      });
    }

    selectEditor.create({
      title: 'Map CSV fields',
      buttons: 'Import ' + csv.length + ' records',
      message: 'Select the CSV column you want to use the data from for each field.',
      onComplete: 'none'
    });

    selectEditor.on('submitComplete', function (e, json, data, action) {
      editor.create(csv.length, {
        title: 'Confirm import',
        buttons: 'Submit',
        message:
          'Click the <i>Submit</i> button to confirm the import of ' +
          csv.length +
          ' rows of data. Optionally, override the value for a field to set a common value by clicking on the field below.'
      });

      for (let i = 0; i < fields.length; i++) {
        let field = editor.field(fields[i]);
        let mapped = $.fn.dataTable.util.get(field.name())(data);

        for (let j = 0; j < csv.length; j++) {
          field.multiSet(j, csv[j][mapped]);
        }
      }
    });
  }

  // Upload Editor - triggered from the import button. Used only for uploading a file to the browser
  const uploadEditor = new $.fn.dataTable.Editor({
    fields: [
      {
        label: 'CSV file:',
        name: 'csv',
        type: 'upload',
        ajax: function (files, done) {
          Papa.parse(files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
              if (results.errors.length) {
                console.log(results);
                uploadEditor
                  .field('csv')
                  .error('CSV parsing error: ' + results.errors[0].message);
              } else {
                selectColumns(editor, results.data, results.meta.fields);
              }
              done([0]);
            }
          });
        }
      }
    ]
  });
}
});

onBeforeUnmount(() => {
  if (dataTable.value && $.fn.DataTable.isDataTable(dataTable.value)) {
    $(dataTable.value).DataTable().destroy();
  }
});

</script>

<style scoped>
/* Add any custom styling you need here */
@import 'datatables.net-dt';
button.btn-space {
  margin-left: 1em;
}
</style>
