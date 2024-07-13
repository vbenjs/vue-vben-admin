interface LockAndRegisterParams {
  lockScreenPassword: string;
}

interface RegisterEmits {
  submit: [LockAndRegisterParams];
}

export type { LockAndRegisterParams, RegisterEmits };
