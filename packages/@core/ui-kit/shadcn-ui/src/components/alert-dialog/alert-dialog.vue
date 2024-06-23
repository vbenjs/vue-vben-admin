<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as AlertDialogRoot,
  AlertDialogTitle,
} from '@vben-core/shadcn-ui/components/ui/alert-dialog';

interface Props {
  cancelText?: string;
  content?: string;
  submitText?: string;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  submitText: '确认',
});

const emits = defineEmits<{
  cancel: [];
  submit: [];
}>();

const openModal = defineModel<boolean>('open');

function handleSubmit() {
  emits('submit');
  openModal.value = false;
}

function handleCancel() {
  emits('cancel');
  openModal.value = false;
}
</script>

<template>
  <AlertDialogRoot v-model:open="openModal">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ content }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">
          {{ cancelText }}
        </AlertDialogCancel>
        <AlertDialogAction @click="handleSubmit">
          {{ submitText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialogRoot>
</template>
