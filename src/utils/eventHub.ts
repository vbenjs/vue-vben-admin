class EventHub {
  private cache: { [key: string]: Array<(data: any) => void> } = {};
  on(eventName: string, fn: (data: any) => void) {
    this.cache[eventName] = this.cache[eventName] || [];
    this.cache[eventName].push(fn);
  }

  once(eventName: string, fn: (data: any) => void) {
    const decor = (...args: any[]) => {
      fn && fn.apply(this, args);
      this.off(eventName, decor);
    };
    this.on(eventName, decor);
    return this;
  }

  emit(eventName: string, data?: any) {
    if (this.cache[eventName] === undefined) return;
    this.cache[eventName].forEach((fn) => fn(data));
  }
  off(eventName: string, fn: (data: any) => void) {
    if (this.cache[eventName] === undefined || this.cache[eventName].length === 0) return;
    const i = this.cache[eventName].indexOf(fn);
    if (i === -1) return;
    this.cache[eventName].splice(i, 1);
  }

  clear() {
    this.cache = {};
  }
}

export default EventHub;
