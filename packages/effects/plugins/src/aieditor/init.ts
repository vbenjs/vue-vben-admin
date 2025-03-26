import type { AiEditorOptions } from 'aieditor';

let defaultOptions: Omit<AiEditorOptions, 'element'> = {
  placeholder: '请输入内容...',
  contentIsMarkdown: false,
  contentRetention: false,
  contentRetentionKey: 'ai-editor-content',
  toolbarSize: 'small', // 默认 small，可选 'small' | 'medium' | 'large'
  toolbarExcludeKeys: ['ai'], // 工具栏排除 ai 按钮
};

export function setupAIEditor(options: Omit<AiEditorOptions, 'element'>) {
  defaultOptions = { ...defaultOptions, ...options };
}

export function mergeAIEditorOptions(
  options?: Omit<AiEditorOptions, 'element'>,
) {
  return { ...defaultOptions, ...options };
}
