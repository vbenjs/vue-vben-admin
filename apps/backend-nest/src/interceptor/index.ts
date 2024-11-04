import type { ClassProvider, Type } from '@nestjs/common';

import { APP_INTERCEPTOR } from '@nestjs/core';

const glob_result = import.meta.glob<Type>('./*.interceptor.ts', {
  import: 'default',
  eager: true,
});

export default Object.values(glob_result).map<ClassProvider>((useClass) => ({
  provide: APP_INTERCEPTOR,
  useClass,
}));
