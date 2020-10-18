import { ComponentPublicInstance } from 'vue';

const validEvents = [
  'onActivate',
  'onAddUndo',
  'onBeforeAddUndo',
  'onBeforeExecCommand',
  'onBeforeGetContent',
  'onBeforeRenderUI',
  'onBeforeSetContent',
  'onBeforePaste',
  'onBlur',
  'onChange',
  'onClearUndos',
  'onClick',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDblclick',
  'onDeactivate',
  'onDirty',
  'onDrag',
  'onDragDrop',
  'onDragEnd',
  'onDragGesture',
  'onDragOver',
  'onDrop',
  'onExecCommand',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onGetContent',
  'onHide',
  'onInit',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoadContent',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onNodeChange',
  'onObjectResizeStart',
  'onObjectResized',
  'onObjectSelected',
  'onPaste',
  'onPostProcess',
  'onPostRender',
  'onPreProcess',
  'onProgressState',
  'onRedo',
  'onRemove',
  'onReset',
  'onSaveContent',
  'onSelectionChange',
  'onSetAttrib',
  'onSetContent',
  'onShow',
  'onSubmit',
  'onUndo',
  'onVisualAid'
];

const isValidKey = (key: string) => validEvents.indexOf(key) !== -1;

const bindHandlers = (initEvent: Event, listeners: any, editor: any): void => {
  Object.keys(listeners)
    .filter(isValidKey)
    .forEach((key: string) => {
      const handler = listeners[key];
      if (typeof handler === 'function') {
        if (key === 'onInit') {
          handler(initEvent, editor);
        } else {
          editor.on(key.substring(2), (e: any) => handler(e, editor));
        }
      }
    });
};

const bindModelHandlers = (ctx: ComponentPublicInstance, editor: any) => {
  const modelEvents = ctx.$props.modelEvents ? ctx.$props.modelEvents : null;
  const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;
  // @ts-ignore
  ctx.$watch('modelValue', (val: string, prevVal: string) => {
    if (editor && typeof val === 'string' && val !== prevVal && val !== editor.getContent({ format: ctx.$props.outputFormat })) {
      editor.setContent(val);
    }
  });

  editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
    ctx.$emit('update:modelValue', editor.getContent({ format: ctx.$props.outputFormat }));
  });
};

const initEditor = (initEvent: Event, ctx: ComponentPublicInstance, editor: any) => {
  const value = ctx.$props.modelValue ? ctx.$props.modelValue : '';
  const initialValue = ctx.$props.initialValue ? ctx.$props.initialValue : '';

  editor.setContent(value || initialValue);

  // checks if the v-model shorthand is used (which sets an v-on:input listener) and then binds either
  // specified the events or defaults to "change keyup" event and emits the editor content on that event
  if (ctx.$attrs['onUpdate:modelValue']) {
    bindModelHandlers(ctx, editor);
  }

  bindHandlers(initEvent, ctx.$attrs, editor);
};

let unique = 0;

const uuid = (prefix: string): string => {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);

  unique++;

  return prefix + '_' + random + unique + String(time);
};

const isTextarea = (element: Element | null): element is HTMLTextAreaElement => {
  return element !== null && element.tagName.toLowerCase() === 'textarea';
};

const normalizePluginArray = (plugins?: string | string[]): string[] => {
  if (typeof plugins === 'undefined' || plugins === '') {
    return [];
  }

  return Array.isArray(plugins) ? plugins : plugins.split(' ');
};

const mergePlugins = (initPlugins: string | string[], inputPlugins?: string | string[]) =>
  normalizePluginArray(initPlugins).concat(normalizePluginArray(inputPlugins));

const isNullOrUndefined = (value: any): value is null | undefined => value === null || value === undefined;

export {
  bindHandlers,
  bindModelHandlers,
  initEditor,
  uuid,
  isTextarea,
  mergePlugins,
  isNullOrUndefined
};