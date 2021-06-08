import { install } from '/@/utils/install';
import codeEditor from './src/CodeEditor.vue';
import jsonPreview from './src/json-preview/JsonPreview.vue';

export const CodeEditor = install(codeEditor);
export const JsonPreview = install(jsonPreview);
