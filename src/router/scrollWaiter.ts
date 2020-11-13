// see https://github.com/vuejs/vue-router-next/blob/master/playground/scrollWaiter.ts
class ScrollQueue {
  private resolve: (() => void) | null = null;
  private promise: Promise<any> | null = null;

  add() {
    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  flush() {
    this.resolve && this.resolve();
    this.resolve = null;
    this.promise = null;
  }

  async wait() {
    await this.promise;
  }
}

export const scrollWaiter = new ScrollQueue();
