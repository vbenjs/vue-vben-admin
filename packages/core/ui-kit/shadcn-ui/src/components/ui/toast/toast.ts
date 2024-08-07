import type { ToastRootProps } from 'radix-vue';

import type { HTMLAttributes } from 'vue';

import { cva, type VariantProps } from 'class-variance-authority';

export const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'border bg-background border-border text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
  },
);

type ToastVariants = VariantProps<typeof toastVariants>;

export interface ToastProps extends ToastRootProps {
  class?: HTMLAttributes['class'];
  onOpenChange?: ((value: boolean) => void) | undefined;
  variant?: ToastVariants['variant'];
}
