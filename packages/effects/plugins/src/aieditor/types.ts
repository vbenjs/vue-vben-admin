import type { AiEditorOptions } from 'aieditor';

export interface VbenAIEditorProps
  extends Omit<AiEditorOptions, 'element' | 'lang' | 'theme'> {
  isDark?: boolean;
  width?: string;
  height?: string;
}
