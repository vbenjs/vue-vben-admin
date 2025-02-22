import { defineOverridesPreferences } from '@vben/preferences';

export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    locale: 'en-US',
  },
  theme: {
    mode: 'light',
  },
  tabbar: {
    enable: false,
  },
  copyright: {
    companyName: 'Netpower',
    companySiteLink: 'https://www.netpower.com',
  },
});
