/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type CopyProps<T> = { [P in keyof T]: any };

export interface IPropTypes {
  apiKey: string;
  cloudChannel: string;
  id: string;
  init: any;
  initialValue: string;
  outputFormat: 'html' | 'text';
  inline: boolean;
  modelEvents: string[] | string;
  plugins: string[] | string;
  tagName: string;
  toolbar: string[] | string;
  modelValue: string;
  disabled: boolean;
  tinymceScriptSrc: string;
}

export const editorProps: CopyProps<IPropTypes> = {
  apiKey: String,
  cloudChannel: String,
  id: String,
  init: Object,
  initialValue: String,
  inline: Boolean,
  modelEvents: [String, Array],
  plugins: [String, Array],
  tagName: String,
  toolbar: [String, Array],
  modelValue: String,
  disabled: Boolean,
  tinymceScriptSrc: String,
  outputFormat: {
    type: String,
    validator: (prop: string) => prop === 'html' || prop === 'text'
  },
};
