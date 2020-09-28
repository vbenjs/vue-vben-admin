import type { Menu as MenuType } from '/@/router/types';

/**
 * @description: Whether the menu has child nodes
 */
export function menuHasChildren(menuTreeItem: MenuType): boolean {
  return (
    Reflect.has(menuTreeItem, 'children') &&
    !!menuTreeItem.children &&
    menuTreeItem.children.length > 0
  );
}
