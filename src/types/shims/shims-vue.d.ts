declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module '*.md' {
  import Vue from 'vue';
  export default Vue;
}

// declare module '@/setup/vue/dist/component/component' {
//   export interface SetupContext {
//     readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] };
//   }
// }

declare type ImportComponentPromise = Promise<typeof import('*.vue')>;
// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> {
//     [propName: string]: any;

//     ref?: string;
//   }
// }
