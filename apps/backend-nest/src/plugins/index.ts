const glob_result = import.meta.glob<any>('./*.plugin.ts', {
  import: 'default',
  eager: true,
});

export default Object.values(glob_result);

export { Cookies } from './cookies.plugin';
