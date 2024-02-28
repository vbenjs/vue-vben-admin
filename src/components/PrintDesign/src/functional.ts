import type { JsonOptions, PrintPreviewOptions } from './typing';
import JsonPreview from './components/JsonPreview.vue';
import PrintPreview from './components/PrintPreview.vue';
import { isClient } from '@/utils/is';
import { createVNode, render } from 'vue';

let instance: ReturnType<typeof createVNode> | null = null;
export function showJson(options: JsonOptions) {
  if (!isClient) return;
  const propsData: Partial<JsonOptions> = {};
  const container = document.createElement('div');
  Object.assign(propsData, { show: true }, options);

  instance = createVNode(JsonPreview, propsData);
  render(instance, container);
  document.body.appendChild(container);
  return instance.component?.exposed;
}

export function showPrintPreview(options: PrintPreviewOptions) {
  if (!isClient) return;
  const propsData: Partial<PrintPreviewOptions> = {};
  const container = document.createElement('div');
  Object.assign(propsData, { show: true }, options);

  instance = createVNode(PrintPreview, propsData);
  render(instance, container);
  document.body.appendChild(container);
  return instance.component?.exposed;
}
