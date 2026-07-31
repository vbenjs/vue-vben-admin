import type { Plugin } from 'vite';

const FORM_FIELD_SLOT_MIGRATION_WARNING =
  '[Vben Form] BREAKING CHANGE: Named field slot control bindings moved to `slotProps.componentProps`. Replace `v-bind="slotProps"` with `v-bind="slotProps.componentProps"`. See https://doc.vben.pro/components/common-ui/vben-form.html';

function viteFormFieldSlotMigrationWarningPlugin(): Plugin {
  return {
    apply: 'serve',
    configResolved(config) {
      config.logger.warn(FORM_FIELD_SLOT_MIGRATION_WARNING);
    },
    name: 'vite:form-field-slot-migration-warning',
    transformIndexHtml() {
      return [
        {
          attrs: {
            'data-vben-form-field-slot-migration-warning': '',
          },
          children: `console.warn(${JSON.stringify(FORM_FIELD_SLOT_MIGRATION_WARNING)});`,
          injectTo: 'body',
          tag: 'script',
        },
      ];
    },
  };
}

export {
  FORM_FIELD_SLOT_MIGRATION_WARNING,
  viteFormFieldSlotMigrationWarningPlugin,
};
