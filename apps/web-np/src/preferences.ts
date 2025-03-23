import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    locale: 'en-US',
    enablePreferences: false,
  },
  theme: {
    mode: 'light',
  },
  widget: {
    languageToggle: false,
    lockScreen: false,
  },
  tabbar: {
    enable: false,
  },
  copyright: {
    companyName: 'Netpower',
    companySiteLink: 'https://www.netpower.com',
  },
});
