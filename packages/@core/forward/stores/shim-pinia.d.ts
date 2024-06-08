// TODO: https://github.com/vuejs/pinia/issues/2098
declare module 'pinia' {
  export function acceptHMRUpdate(
    initialUseStore: StoreDefinition | any,
    hot: any,
  ): (newModule: any) => any;
}

export {};
