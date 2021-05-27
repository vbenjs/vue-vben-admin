import type { App } from 'vue';
import flowChart from './src/FlowChart.vue';

export const FlowChart = Object.assign(flowChart, {
  install(app: App) {
    app.component(flowChart.name, flowChart);
  },
});
