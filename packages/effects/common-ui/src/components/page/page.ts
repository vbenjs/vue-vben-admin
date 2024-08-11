interface PageHeaderProps {
  title?: string;
  description?: string;
}

interface Props extends PageHeaderProps {
  contentClass?: string;
  showFooter?: boolean;
}

export type { PageHeaderProps, Props };
