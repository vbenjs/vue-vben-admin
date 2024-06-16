interface LoginAndRegisterParams {
  password: string;
  username: string;
}

interface LoginCodeParams {
  code: string;
  phoneNumber: string;
}

interface LoginEmits {
  submit: [LoginAndRegisterParams];
}

interface LoginCodeEmits {
  submit: [LoginCodeParams];
}

interface RegisterEmits {
  submit: [LoginAndRegisterParams];
}

export type {
  LoginAndRegisterParams,
  LoginCodeEmits,
  LoginCodeParams,
  LoginEmits,
  RegisterEmits,
};
