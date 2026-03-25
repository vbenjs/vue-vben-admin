import type { Component } from 'vue';

export interface VbenPluginsFormOptions {
  useVbenForm: (...args: any[]) => any;
}

export interface VbenPluginsModalOptions {
  useVbenModal?: () => any;
}

export interface VbenPluginsMessageOptions {
  useMessage?: () => any;
}

export interface VbenPluginsComponentsOptions {
  [key: string]: Component;
}

export interface VbenPluginsOptions {
  form?: VbenPluginsFormOptions;
  modal?: VbenPluginsModalOptions;
  message?: VbenPluginsMessageOptions;
  components?: VbenPluginsComponentsOptions;
}
