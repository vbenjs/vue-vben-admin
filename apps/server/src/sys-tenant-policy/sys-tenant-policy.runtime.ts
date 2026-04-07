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

type AttachmentAccessor<T> = {
  count: (payload: T) => number;
};

type PolicyAssertionOptions<T> = {
  attachmentAccessors?: Record<string, AttachmentAccessor<T>>;
  originalPayload?: null | T;
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

function normalizeComparableValue(value: unknown) {
  if (value === undefined) {
    return '__undefined__';
  }

  if (value === null) {
    return '__null__';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return `${value}`;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return `${value}`;
  }
}

export function applyPolicyDefaults<T extends Record<string, any>>(
  payload: T,
  policy: TenantPolicyRuntime,
  fieldAccessors: Record<string, FieldAccessor<T>>,
) {
  const normalizedPolicy = normalizeTenantPolicy(policy);
  const next = { ...payload };

  for (const [key, accessor] of Object.entries(fieldAccessors)) {
    const rule = normalizedPolicy.fields[key];
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
  options: PolicyAssertionOptions<T> = {},
) {
  const normalizedPolicy = normalizeTenantPolicy(policy);

  for (const [key, accessor] of Object.entries(fieldAccessors)) {
    const rule = normalizedPolicy.fields[key];
    const value = accessor.get(payload);

    if (rule?.required && isEmptyValue(value)) {
      throw new BadRequestException(`${key} 为必填项`);
    }

    if (rule?.readonly === true) {
      const originalValue =
        options.originalPayload !== undefined && options.originalPayload !== null
          ? accessor.get(options.originalPayload)
          : undefined;
      const referenceValue =
        !isEmptyValue(originalValue) || options.originalPayload
          ? originalValue
          : rule?.defaultValue;

      if (!isEmptyValue(referenceValue)) {
        if (
          normalizeComparableValue(value) !==
          normalizeComparableValue(referenceValue)
        ) {
          throw new BadRequestException(`${key} 为只读字段`);
        }
        continue;
      }

      if (!isEmptyValue(value)) {
        throw new BadRequestException(`${key} 为只读字段`);
      }
    }
  }

  for (const [key, rule] of Object.entries(normalizedPolicy.attachments)) {
    const accessor = options.attachmentAccessors?.[key];
    if (!accessor) {
      continue;
    }

    const count = Math.max(0, Number(accessor.count(payload) || 0));
    if (rule?.required && count <= 0) {
      throw new BadRequestException(`${key} 至少上传 1 个附件`);
    }

    if (typeof rule?.maxCount === 'number' && count > rule.maxCount) {
      throw new BadRequestException(`${key} 最多上传 ${rule.maxCount} 个附件`);
    }
  }
}
