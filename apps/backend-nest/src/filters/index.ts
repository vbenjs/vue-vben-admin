import type { ClassProvider, Type } from '@nestjs/common';

import { APP_FILTER } from '@nestjs/core';

const glob_result = import.meta.glob<Type>('./*.filter.ts', {
  import: 'default',
  eager: true,
});

export default Object.values(glob_result).map<ClassProvider>((useClass) => ({
  provide: APP_FILTER,
  useClass,
}));
