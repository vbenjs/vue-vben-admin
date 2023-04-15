// TODO: https://github.com/vuejs/pinia/issues/2098
declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  export function acceptHMRUpdate(
    initialUseStore: StoreDefinition | any,
    hot: any,
  ): (newModule: any) => any;
}

export {};
