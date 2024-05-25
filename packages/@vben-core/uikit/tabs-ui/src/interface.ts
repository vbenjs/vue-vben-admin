import type { IContextMenuItem } from '@vben-core/shadcn-ui';
import type { TabItem } from '@vben-core/typings';

interface TabsProps {
  maxWidth?: number;
  menus?: (data: any) => IContextMenuItem[];
  minWidth?: number;
  showIcon?: boolean;
  tabs?: TabItem[];
}

export type { TabsProps };
