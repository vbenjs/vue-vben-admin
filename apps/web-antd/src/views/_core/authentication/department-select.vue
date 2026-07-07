<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { $t } from '#/locales';

defineOptions({ name: 'DepartmentSelect' });

const router = useRouter();
const userStore = useUserStore();

const departments = computed(() => [
  {
    description: $t('page.auth.departmentSelect.aDescription'),
    icon: 'lucide:building-2',
    key: 'a',
    title: $t('page.auth.departmentSelect.aTitle'),
    // url: 'https://a.domain1',
  },
  {
    description: $t('page.auth.departmentSelect.bDescription'),
    icon: 'lucide:briefcase-business',
    key: 'b',
    title: $t('page.auth.departmentSelect.bTitle'),
    // url: 'https://b.domain1',
  },
]);

async function handleEnterDepartment() {
  await router.push(
    userStore.userInfo?.homePath || preferences.app.defaultHomePath,
  );
}
</script>

<template>
  <div>
    <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mb-3 text-3xl/9 font-bold tracking-tight text-foreground lg:text-4xl"
      >
        {{ $t('page.auth.departmentSelect.title') }}
      </h2>
      <p class="lg:text-md text-sm text-muted-foreground">
        {{ $t('page.auth.departmentSelect.subtitle') }}
      </p>
    </div>

    <div class="grid gap-3">
      <button
        v-for="department in departments"
        :key="department.key"
        class="group flex w-full items-center gap-4 rounded-lg border border-border bg-card px-4 py-4 text-left shadow-sm transition-colors hover:border-primary/60 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        type="button"
        @click="handleEnterDepartment"
      >
        <span
          class="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <IconifyIcon :icon="department.icon" class="size-5" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block text-base font-medium text-foreground">
            {{ department.title }}
          </span>
          <span class="mt-1 block text-sm text-muted-foreground">
            {{ department.description }}
          </span>
        </span>
        <IconifyIcon
          class="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          icon="lucide:arrow-right"
        />
      </button>
    </div>

    <VbenButton class="mt-6 w-full" disabled variant="outline">
      {{ $t('page.auth.departmentSelect.requiredTip') }}
    </VbenButton>
  </div>
</template>
