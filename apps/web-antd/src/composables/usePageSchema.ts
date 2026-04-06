import type { MaybeRefOrGetter } from 'vue';

import { ref, toValue, watch } from 'vue';

import { useUserStore } from '@vben/stores';

import { sysPageSchemaApi } from '#/api/core/sys-manage';

type PageSchemaMode = 'draft' | 'published';
type PageSchemaRecord = Record<string, any>;
type SchemaKeyedItem = {
  key: string;
  order?: number;
  visible?: boolean;
} & PageSchemaRecord;

type UsePageSchemaOptions = {
  enabled?: MaybeRefOrGetter<boolean>;
  immediate?: boolean;
  includeUserPreference?: MaybeRefOrGetter<boolean>;
  mode?: MaybeRefOrGetter<PageSchemaMode>;
  tenantId?: MaybeRefOrGetter<number | string | undefined>;
  userId?: MaybeRefOrGetter<number | string | undefined>;
};

function normalizeOptionalValue(value: unknown) {
  if (value === undefined || value === null) {
    return undefined;
  }

  const normalized = `${value}`.trim();
  return normalized || undefined;
}

function isRecord(value: unknown): value is PageSchemaRecord {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function mergePageSchemaItems<T extends SchemaKeyedItem>(
  defaults: T[],
  schemaItems: unknown,
) {
  if (!Array.isArray(schemaItems) || schemaItems.length === 0) {
    return defaults.filter((item) => item.visible !== false);
  }

  const mergedItems = new Map(
    defaults.map((item) => [item.key, { ...item }] as const),
  );
  const orderedKeys = defaults.map((item) => item.key);

  schemaItems.forEach((item) => {
    if (!isRecord(item) || typeof item.key !== 'string' || !item.key.trim()) {
      return;
    }

    const normalizedKey = item.key.trim();
    const current =
      mergedItems.get(normalizedKey) || ({ key: normalizedKey } as T);
    mergedItems.set(normalizedKey, { ...current, ...item });

    if (!orderedKeys.includes(normalizedKey)) {
      orderedKeys.push(normalizedKey);
    }
  });

  return orderedKeys
    .map((key) => mergedItems.get(key))
    .filter((item): item is T => !!item && item.visible !== false)
    .sort((left, right) => {
      const leftOrder =
        typeof left.order === 'number' ? left.order : Number.MAX_SAFE_INTEGER;
      const rightOrder =
        typeof right.order === 'number' ? right.order : Number.MAX_SAFE_INTEGER;
      if (leftOrder === rightOrder) {
        return orderedKeys.indexOf(left.key) - orderedKeys.indexOf(right.key);
      }
      return leftOrder - rightOrder;
    });
}

export function resolvePageSchemaSection(
  schema: PageSchemaRecord | null | undefined,
  sectionKey: string,
) {
  const section = schema?.[sectionKey];
  return isRecord(section) ? section : {};
}

export function resolvePageSchemaValue<T>(
  schema: PageSchemaRecord | null | undefined,
  path: string[],
  fallback: T,
) {
  let current: unknown = schema;
  for (const key of path) {
    if (!isRecord(current)) {
      return fallback;
    }
    current = current[key];
  }

  return (current as T) ?? fallback;
}

export function resolveToolbarItem(
  toolbarItems: Array<SchemaKeyedItem>,
  key: string,
  fallbackLabel: string,
) {
  const matched = toolbarItems.find((item) => item.key === key);
  return {
    label:
      typeof matched?.label === 'string' && matched.label.trim()
        ? matched.label
        : fallbackLabel,
    visible: matched?.visible !== false,
  };
}

export function usePageSchema(
  pageCode: MaybeRefOrGetter<string>,
  options: UsePageSchemaOptions = {},
) {
  const userStore = useUserStore();
  const loading = ref(false);
  const runtime = ref<any>(null);
  const schema = ref<Record<string, any>>({});

  const refresh = async (extraParams?: Record<string, any>) => {
    const resolvedPageCode = normalizeOptionalValue(toValue(pageCode));
    if (!resolvedPageCode) {
      runtime.value = null;
      schema.value = {};
      return null;
    }

    loading.value = true;
    try {
      const includeUserPreference =
        options.includeUserPreference === undefined
          ? true
          : !!toValue(options.includeUserPreference);
      const resolvedTenantId =
        normalizeOptionalValue(toValue(options.tenantId)) ||
        normalizeOptionalValue(userStore.userInfo?.tenantId);
      const resolvedUserId = includeUserPreference
        ? normalizeOptionalValue(toValue(options.userId)) ||
          normalizeOptionalValue(userStore.userInfo?.userId)
        : undefined;

      const result = await sysPageSchemaApi.getRuntime(resolvedPageCode, {
        mode: toValue(options.mode || 'published'),
        tenantId: resolvedTenantId,
        userId: resolvedUserId,
        ...extraParams,
      });

      runtime.value = result;
      schema.value = result?.schema || {};
      return result;
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => [
      toValue(pageCode),
      toValue(options.enabled ?? true),
      toValue(options.includeUserPreference ?? true),
      toValue(options.mode || 'published'),
      toValue(options.tenantId),
      toValue(options.userId),
      userStore.userInfo?.tenantId,
      userStore.userInfo?.userId,
    ],
    async () => {
      const enabled = !!toValue(options.enabled ?? true);
      if (!enabled) {
        runtime.value = null;
        schema.value = {};
        return;
      }

      await refresh();
    },
    { immediate: options.immediate !== false },
  );

  return {
    loading,
    refresh,
    runtime,
    schema,
  };
}
