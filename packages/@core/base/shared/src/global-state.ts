/**
 * 全局复用的变量、组件、配置，各个模块之间共享
 * 通过单例模式实现,单例必须注意不受请求影响，例如用户信息这些需要根据请求获取的。后续如果有ssr需求，也不会影响
 */
export interface IGlobalSharedState {
  components: Record<string, any>;
}

class GlobalShareState {
  #components: Record<string, any> = {};

  public getComponents(): IGlobalSharedState['components'] {
    return this.#components;
  }

  public setComponents(value: IGlobalSharedState['components']) {
    this.#components = value;
  }
}

export const globalShareState = new GlobalShareState();
