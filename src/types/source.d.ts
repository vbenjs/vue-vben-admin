declare module 'ant-design-vue/es/locale/zh_CN';
declare const React: string;
declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.json' {
  /** 得到json表达的对象/数组【混入到代码中】
   */
  const content: any | any[];
  export default content;
}

declare module '*.svg' {
  /** 文件路径
   */
  const content: string;
  export = content;
}
declare module '*.scss' {
  /** scss 导出 (:export{})
   */
  const content: {
    [className: string]: string;
  };
  export default content;
}
declare module '*.less' {
  const content: {
    [className: string]: string;
  };
  export default content;
}
declare module '*.styl' {
  const content: {
    [className: string]: string;
  };
  export default content;
}
declare module '*.css' {
  /** 一个空对象
   */
  const content: any;
  export default content;
}

declare module '*.module.scss' {
  /** css 模块
   */
  const content: {
    [localClassName: string]: string;
  };
  export default content;
}
