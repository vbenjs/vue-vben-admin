<script lang="ts" setup>
// import { ref } from 'vue';

// import { echartsInstance as echarts } from '@vben/chart-ui';

defineOptions({ name: 'WelCome' });

// const cardList = ref([
//   {
//     color: 'green',
//     extra: '月',
//     leftContent: '2000',
//     leftFooter: '总访问数',
//     rightContent: 'flat-color-icons:conference-call',
//     rightFooter: '5000',
//     title: '访问数',
//   },
//   {
//     color: 'red',
//     extra: '日',
//     leftContent: '$1350',
//     leftFooter: '总销售额',
//     rightContent: 'flat-color-icons:sales-performance',
//     rightFooter: '$550000',
//     title: '销售额',
//   },
// ]);
// const chartTabs = ref([
//   {
//     name: '1',
//     option: {
//       color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],

//       grid: {
//         bottom: '3%',
//         containLabel: true,
//         left: '3%',
//         right: '4%',
//       },
//       legend: {
//         data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
//       },
//       series: [
//         {
//           areaStyle: {
//             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//               {
//                 color: 'rgb(128, 255, 165)',
//                 offset: 0,
//               },
//               {
//                 color: 'rgb(1, 191, 236)',
//                 offset: 1,
//               },
//             ]),
//             opacity: 0.8,
//           },
//           data: [140, 232, 101, 264, 90, 340, 250],
//           emphasis: {
//             focus: 'series',
//           },
//           lineStyle: {
//             width: 0,
//           },
//           name: 'Line 1',
//           showSymbol: false,
//           smooth: true,
//           stack: 'Total',
//           type: 'line',
//         },
//         {
//           areaStyle: {
//             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//               {
//                 color: 'rgb(0, 221, 255)',
//                 offset: 0,
//               },
//               {
//                 color: 'rgb(77, 119, 255)',
//                 offset: 1,
//               },
//             ]),
//             opacity: 0.8,
//           },
//           data: [120, 282, 111, 234, 220, 340, 310],
//           emphasis: {
//             focus: 'series',
//           },
//           lineStyle: {
//             width: 0,
//           },
//           name: 'Line 2',
//           showSymbol: false,
//           smooth: true,
//           stack: 'Total',
//           type: 'line',
//         },
//         {
//           areaStyle: {
//             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//               {
//                 color: 'rgb(55, 162, 255)',
//                 offset: 0,
//               },
//               {
//                 color: 'rgb(116, 21, 219)',
//                 offset: 1,
//               },
//             ]),
//             opacity: 0.8,
//           },
//           data: [320, 132, 201, 334, 190, 130, 220],
//           emphasis: {
//             focus: 'series',
//           },
//           lineStyle: {
//             width: 0,
//           },
//           name: 'Line 3',
//           showSymbol: false,
//           smooth: true,
//           stack: 'Total',
//           type: 'line',
//         },
//         {
//           areaStyle: {
//             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//               {
//                 color: 'rgb(255, 0, 135)',
//                 offset: 0,
//               },
//               {
//                 color: 'rgb(135, 0, 157)',
//                 offset: 1,
//               },
//             ]),
//             opacity: 0.8,
//           },
//           data: [220, 402, 231, 134, 190, 230, 120],
//           emphasis: {
//             focus: 'series',
//           },
//           lineStyle: {
//             width: 0,
//           },
//           name: 'Line 4',
//           showSymbol: false,
//           smooth: true,
//           stack: 'Total',
//           type: 'line',
//         },
//         {
//           areaStyle: {
//             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//               {
//                 color: 'rgb(255, 191, 0)',
//                 offset: 0,
//               },
//               {
//                 color: 'rgb(224, 62, 76)',
//                 offset: 1,
//               },
//             ]),
//             opacity: 0.8,
//           },
//           data: [220, 302, 181, 234, 210, 290, 150],
//           emphasis: {
//             focus: 'series',
//           },
//           label: {
//             position: 'top',
//             show: true,
//           },
//           lineStyle: {
//             width: 0,
//           },
//           name: 'Line 5',
//           showSymbol: false,
//           smooth: true,
//           stack: 'Total',
//           type: 'line',
//         },
//       ],
//       toolbox: {
//         feature: {
//           saveAsImage: {},
//         },
//       },
//       tooltip: {
//         axisPointer: {
//           type: 'cross',
//           // label: {
//           //   backgroundColor: '#6a7985',
//           // },
//         },
//         trigger: 'axis',
//       },
//       xAxis: [
//         {
//           boundaryGap: false,
//           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//           type: 'category',
//         },
//       ],
//       yAxis: [
//         {
//           type: 'value',
//         },
//       ],
//     },
//     title: '流量趋势',
//   },
//   {
//     name: '2',
//     option: {
//       series: [
//         {
//           data: [
//             120,
//             {
//               itemStyle: {
//                 color: '#a90000',
//               },
//               value: 200,
//             },
//             150,
//             80,
//             70,
//             110,
//             130,
//           ],
//           type: 'bar',
//         },
//       ],
//       xAxis: {
//         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//         type: 'category',
//       },
//       yAxis: {
//         type: 'value',
//       },
//     },
//     title: '访问量',
//   },
// ]);
</script>

<template>
  <div>dashboard</div>
  <!-- <Dashboard :card-list="cardList" :chart-tabs="chartTabs" /> -->
</template>
