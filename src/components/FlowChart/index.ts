import { App } from 'vue';
import dataDialog from './src/DataDialog.vue';
import flowChart from './src/index.vue';

export const FlowChart = Object.assign(flowChart, {
  install(app: App) {
    app.component(flowChart.name, flowChart);
  },
});

export const DataDialog = Object.assign(dataDialog, {
  install(app: App) {
    app.component(dataDialog.name, dataDialog);
  },
});
