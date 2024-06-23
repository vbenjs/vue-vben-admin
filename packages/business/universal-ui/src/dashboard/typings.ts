interface CardItem {
  title: string;
  extra: string;
  leftContent: string;
  rightContent: string;
  color?: string;
  leftFooter: string;
  rightFooter: string;
}

interface ChartItem {
  name: string;
  title: string;
  options: any;
}

export type { CardItem, ChartItem };
