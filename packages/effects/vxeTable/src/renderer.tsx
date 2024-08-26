import { h, warn } from 'vue';

export const registerRenderer = (VxeUI: any) => {
  VxeUI.renderer.add('activeColumn', {
    // 默认显示模板
    renderTableDefault(renderOpts: any, params: any) {
      const { components, options } = renderOpts;
      if (!options) {
        warn('activeColumn组件未配置options');
        return '';
      }
      const { row } = params;
      const buttons = options
        .map((v: any) => {
          const {
            buttonProps,
            component,
            onClick = () => {},
            onSubmit = () => {},
            show = true,
            type,
            children = { default: () => v.label },
          } = v;
          if (!show) return null;
          if (!component) {
            warn('activeColumn组件未配置component');
            return null;
          }

          return h(
            component,
            {
              buttonProps,
              onClick: () => onClick(row),
              onSubmit: () => onSubmit(row),
              type,
            },
            children,
          );
        })
        .filter(Boolean);
      return <components.Space>{buttons}</components.Space>;
    },
  });
};
