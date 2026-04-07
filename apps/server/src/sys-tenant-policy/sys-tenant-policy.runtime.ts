import { BadRequestException } from '@nestjs/common';

type TenantPolicySection = Record<string, any>;

export type TenantPolicyRuntime = {
  actions: TenantPolicySection;
  attachments: TenantPolicySection;
  fields: TenantPolicySection;
  print: TenantPolicySection;
};

function isRecord(value: unknown): value is Record<string, any> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function normalizeTenantPolicy(raw: unknown): TenantPolicyRuntime {
  if (!isRecord(raw)) {
    return {
      actions: {},
      attachments: {},
      fields: {},
      print: {},
    };
  }

  return {
    actions: isRecord(raw.actions) ? raw.actions : {},
    attachments: isRecord(raw.attachments) ? raw.attachments : {},
    fields: isRecord(raw.fields) ? raw.fields : {},
    print: isRecord(raw.print) ? raw.print : {},
  };
}

export function stripDisallowedPreferencePatch(
  patch: Record<string, any>,
  policy: TenantPolicyRuntime,
) {
  const next = cloneJson(isRecord(patch) ? patch : {});

  for (const [key, rule] of Object.entries(policy.fields)) {
    if (!isRecord(next[key])) {
      continue;
    }

    if (rule?.visible === false && next[key].visible === true) {
      delete next[key].visible;
    }
    if (rule?.readonly === true && next[key].readonly === false) {
      delete next[key].readonly;
    }
  }

  for (const [key, rule] of Object.entries(policy.actions)) {
    if (!next[key]) {
      continue;
    }

    if (rule?.visible === false || rule?.enabled === false) {
      delete next[key];
    }
  }

  return next;
}

type FieldAccessor<T> = {
  get: (payload: T) => unknown;
  set?: (payload: T, value: unknown) => void;
};

function isEmptyValue(value: unknown) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  return false;
}

export function applyPolicyDefaults<T extends Record<string, any>>(
  payload: T,
  policy: TenantPolicyRuntime,
  fieldAccessors: Record<string, FieldAccessor<T>>,
) {
  const next = { ...payload };

  for (const [key, accessor] of Object.entries(fieldAccessors)) {
    const rule = policy.fields[key];
    if (rule?.defaultValue === undefined || !accessor.set) {
      continue;
    }

    const currentValue = accessor.get(next);
    if (isEmptyValue(currentValue)) {
      accessor.set(next, rule.defaultValue);
    }
  }

  return next;
}

export function assertPolicyPayload<T extends Record<string, any>>(
  payload: T,
  policy: TenantPolicyRuntime,
  fieldAccessors: Record<string, FieldAccessor<T>>,
) {
  for (const [key, accessor] of Object.entries(fieldAccessors)) {
    const rule = policy.fields[key];
    if (!rule?.required) {
      continue;
    }

    const value = accessor.get(payload);
    if (isEmptyValue(value)) {
      throw new BadRequestException(`${key} 为必填项`);
    }
  }
}
