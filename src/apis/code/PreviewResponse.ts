import type Code from './Code';

export default interface PreviewResponse {
  [table: string]: Code[];
}
