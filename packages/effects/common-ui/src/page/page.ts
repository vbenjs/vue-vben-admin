interface PageHeaderProps {
  title?: string;
}

interface Props extends PageHeaderProps {
  headerSticky?: boolean;
  showFooter?: boolean;
  showHeader?: boolean;
}

export type { PageHeaderProps, Props };
