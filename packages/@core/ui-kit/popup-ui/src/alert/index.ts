export * from './alert';

export { default as Alert } from './alert.vue';
export {
  vbenAlert as alert,
  clearAllAlerts,
  vbenConfirm as confirm,
  vbenPrompt as prompt,
} from './AlertBuilder';
