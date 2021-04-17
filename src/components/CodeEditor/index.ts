import type { App } from 'vue';
import codeEditor from './src/CodeEditor.vue';

export const CodeEditor = Object.assign(codeEditor, {
  install(app: App) {
    app.component(codeEditor.name, codeEditor);
  },
});
