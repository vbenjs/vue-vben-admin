<template>
  <div class="p-4">
    <a-button
type="primary" @click="handlePrint" style="margin: 10px"> 打印 </a-button>
    <a-button
type="primary" @click="handlePrintJson" style="margin: 10px"> 打印JSON </a-button>
    <table
id="table"
border="1" style="border-width: 1px">
      <thead>
        <tr>
          <th>标题1</th>
          <th>标题2</th>
          <th>标题3</th>
          <th>标题4</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>内容1</td>
          <td>内容2</td>
          <td>内容3</td>
          <td>内容4</td>
        </tr>
        <tr>
          <td>内容1</td>
          <td>内容2</td>
          <td>内容3</td>
          <td>内容4</td>
        </tr>
        <tr>
          <td>内容1</td>
          <td>内容2</td>
          <td>内容3</td>
          <td>内容4</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import printJs from 'print-js';
  const jsonData: any[] = [
    {
      name: 'John Doe',
      email: 'john@doe.com',
      phone: '111-111-1111',
    },
    {
      name: 'Barry Allen',
      email: 'barry@flash.com',
      phone: '222-222-2222',
    },
    {
      name: 'Cool Dude',
      email: 'cool@dude.com',
      phone: '333-333-3333',
    },
  ];
  export default defineComponent({
    setup() {
      function handlePrint() {
        printJs({ printable: 'table', type: 'html' });
      }
      function handlePrintJson() {
        printJs({ printable: jsonData, properties: ['name', 'email', 'phone'], type: 'json' });
      }
      return {
        handlePrint,
        handlePrintJson,
      };
    },
  });
</script>
