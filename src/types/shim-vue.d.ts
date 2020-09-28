declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<defineComponent>;
  // import { ComponentOptions } from 'vue';
  // const component: ReturnType<ComponentOptions>;
  export default component;
}
// declare module '*.vue' {
//   import Vue from 'vue';
//   export default Vue;
// }
