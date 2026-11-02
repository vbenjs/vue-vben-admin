import type { Editor } from '@tiptap/vue-3';

import type { ShallowRef } from 'vue';

import type { ToolbarAction, ToolbarMenuItem } from './types';

import { cn } from '@vben-core/shared/utils';

interface UseTiptapToolbarOptions {
  editable: () => boolean;
  editor: Readonly<ShallowRef<Editor | undefined>>;
}

export function useTiptapToolbar(options: UseTiptapToolbarOptions) {
  const getEditor = () => options.editor.value;

  function getActionIndicatorColor(action: ToolbarAction) {
    const currentEditor = getEditor();

    if (!currentEditor || !action.indicatorColor) {
      return undefined;
    }

    return action.indicatorColor(currentEditor);
  }

  function getPaletteCurrentColor(action: ToolbarAction) {
    const currentEditor = getEditor();

    if (!currentEditor || !action.palette?.currentColor) {
      return undefined;
    }

    return action.palette.currentColor(currentEditor);
  }

  function canRunAction(action: ToolbarAction) {
    const currentEditor = getEditor();

    if (!currentEditor || !options.editable()) {
      return false;
    }

    return action.can ? action.can(currentEditor) : true;
  }

  function canRunMenuItem(item: ToolbarMenuItem) {
    const currentEditor = getEditor();

    if (!currentEditor || !options.editable()) {
      return false;
    }

    return item.can ? item.can(currentEditor) : true;
  }

  function isActionActive(action: ToolbarAction) {
    const currentEditor = getEditor();

    if (!currentEditor) {
      return false;
    }

    if (action.isActive) {
      return action.isActive(currentEditor);
    }

    if (!action.active) {
      return false;
    }

    return currentEditor.isActive(action.active.name, action.active.attrs);
  }

  function isMenuItemActive(item: ToolbarMenuItem, currentEditor?: Editor) {
    const targetEditor = currentEditor ?? getEditor();

    if (!targetEditor || !item.isActive) {
      return false;
    }

    return item.isActive(targetEditor);
  }

  function runAction(action: ToolbarAction) {
    const currentEditor = getEditor();

    if (!currentEditor || !options.editable()) {
      return;
    }

    if (action.menu || action.palette) {
      return;
    }

    action.action(currentEditor);
  }

  function runMenuItem(item: ToolbarMenuItem) {
    const currentEditor = getEditor();

    if (!currentEditor || !options.editable()) {
      return;
    }

    item.action(currentEditor);
  }

  function applyPaletteColor(action: ToolbarAction, color: string) {
    const currentEditor = getEditor();

    if (!currentEditor || !action.palette) {
      return;
    }

    action.palette.apply(currentEditor, color);
  }

  function clearPaletteColor(action: ToolbarAction) {
    const currentEditor = getEditor();

    if (!currentEditor || !action.palette?.clear) {
      return;
    }

    action.palette.clear(currentEditor);
  }

  function getToolbarButtonClass(action: ToolbarAction) {
    return cn(
      'relative rounded-[10px] border border-transparent bg-transparent text-muted-foreground shadow-none',
      'transition-[transform,color,background-color,border-color,box-shadow] duration-200 ease-out',
      'enabled:hover:-translate-y-px enabled:hover:border-border disabled:opacity-45',
      'enabled:hover:bg-accent enabled:hover:text-foreground',
      isActionActive(action) &&
        'border-primary/30 bg-accent text-primary shadow-primary',
    );
  }

  function getPaletteSwatchClass(action: ToolbarAction, color: string) {
    return cn(
      'inline-flex size-8 items-center justify-center rounded-full border border-border',
      'shadow-accent',
      'transition-[transform,box-shadow,border-color] duration-200 ease-out',
      'hover:-translate-y-px hover:scale-[1.04]',
      getPaletteCurrentColor(action) === color &&
        'border-primary shadow-primary',
    );
  }

  function getMenuItemClass(item: ToolbarMenuItem) {
    return cn(
      'flex items-center gap-2 rounded-lg p-2 text-left text-sm transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-45',
      isMenuItemActive(item)
        ? 'bg-accent text-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
    );
  }

  return {
    applyPaletteColor,
    canRunAction,
    canRunMenuItem,
    clearPaletteColor,
    getActionIndicatorColor,
    getMenuItemClass,
    getPaletteCurrentColor,
    getPaletteSwatchClass,
    getToolbarButtonClass,
    isActionActive,
    isMenuItemActive,
    runAction,
    runMenuItem,
  };
}
