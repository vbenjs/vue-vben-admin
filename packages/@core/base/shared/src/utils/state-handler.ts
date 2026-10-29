export class StateHandler {
  private condition: boolean = false;
  private rejectConditions: ((reason?: Error) => void)[] = [];
  private resolveConditions: (() => void)[] = [];

  isConditionTrue(): boolean {
    return this.condition;
  }

  reset() {
    this.condition = false;
    // Callers that awaited the condition must not be left pending: after a
    // reset (e.g. unmount) the gate they wait for will not open for them.
    const pendingRejects = this.rejectConditions;
    this.clearPromises();
    for (const reject of pendingRejects) {
      reject(new Error('Condition was reset'));
    }
  }

  // 触发状态为 false 时，reject 所有等待中的 Promise
  setConditionFalse() {
    this.condition = false;
    const pendingRejects = this.rejectConditions;
    this.clearPromises();
    for (const reject of pendingRejects) {
      reject(new Error('Condition was set to false'));
    }
  }

  // 触发状态为 true 时，resolve 所有等待中的 Promise
  setConditionTrue() {
    this.condition = true;
    const pendingResolves = this.resolveConditions;
    this.clearPromises();
    for (const resolve of pendingResolves) {
      resolve();
    }
  }

  // 返回一个 Promise，等待 condition 变为 true；支持多个并发等待者
  waitForCondition(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.condition) {
        resolve(); // 如果 condition 已经为 true，立即 resolve
      } else {
        // condition 变为 true/false 前可能有多个调用方同时等待，
        // 需要把所有 resolve/reject 都收集起来，切换时一次性结算，
        // 否则后注册者会覆盖前一个句柄，导致先注册的等待方永远挂起。
        this.resolveConditions.push(resolve);
        this.rejectConditions.push(reject);
      }
    });
  }

  // 清理所有等待中的 resolve/reject 函数
  private clearPromises() {
    this.resolveConditions = [];
    this.rejectConditions = [];
  }
}
