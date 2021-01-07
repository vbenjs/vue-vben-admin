declare module 'globby!/@/router/routes/modules/**/*.@(ts)';

declare module 'globby!/@/router/menus/modules/**/*.@(ts)';

declare module 'globby?locale!/@/locales/lang/**/*.@(ts)';

declare const React: string;

declare module 'ant-design-vue/es/locale/*' {
  import { Locale } from 'ant-design-vue/types/locale-provider';
  const locale: Locale & ReadonlyRecordable;
  export default locale as Locale & ReadonlyRecordable;
}

declare module 'moment/locale/*' {
  import { LocaleSpecification } from 'moment';
  const locale: LocaleSpecification & ReadonlyRecordable;
  export default locale;
}
