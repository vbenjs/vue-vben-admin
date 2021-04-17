import type { App } from 'vue';
import codeEditor from './src/CodeEditor.vue';
import jsonPreview from './src/json-preview/JsonPreview.vue';

export const CodeEditor = Object.assign(codeEditor, {
  install(app: App) {
    app.component(codeEditor.name, codeEditor);
  },
});

export const JsonPreview = Object.assign(jsonPreview, {
  install(app: App) {
    app.component(jsonPreview.name, jsonPreview);
  },
});
